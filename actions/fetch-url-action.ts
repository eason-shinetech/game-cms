import GameModel, { Game, GameMonetizeResult } from "@/models/game";
import { handleCategorys, handleTags } from "./game-fetch-action";
import { getTitleUrl } from "@/lib/utils";
import { PropsCURDOmitted } from "@/models/base";
import { CategoryMapping } from "@/models/game-category";

export async function saveFetchUrlGames(games: GameMonetizeResult[]) {
  if (!games || games.length === 0) {
    return;
  }
  try {
    // 先处理categorys
    const categorys = Array.from(
      new Set(games.map((game) => game.category)?.filter((c) => c))
    );
    await handleCategorys(categorys);
    // 再处理tags
    const tags = Array.from(
      new Set(
        games
          .flatMap((game) => game.tags.split(","))
          ?.map((t) => t.trim())
          ?.filter((t) => t)
      )
    );
    // 修改标签处理部分
    await handleTags(tags);

    const titles = games.map((game) => game.title.trim());
    const titleUrls = titles.map((title) => getTitleUrl(title));
    // 查找已存在的games
    const existGames = await GameModel.find({ titleUrl: { $in: titleUrls } });

    // 如果存在相同的title/titleUrl，就跳过
    const addGames: Omit<Game, PropsCURDOmitted>[] = games
      .filter(
        (g) =>
          !!g.title &&
          !!g.width &&
          !!g.height &&
          !existGames.some(
            (eg) =>
              eg.title === g.title.trim() ||
              eg.titleUrl === getTitleUrl(g.title.trim())
          )
      )
      .map((game) => {
        const categoryMapping = CategoryMapping.find((m) =>
          m.categories.includes(game.category)
        );
        const categoryName = categoryMapping?.name || "Others";
        const tags =
          game.tags
            ?.split(",")
            ?.map((t) => t.trim())
            ?.filter((t) => t) || [];
        const existGame = existGames.find((g) => g.title === game.title.trim());
        const platforms = existGame?.platforms || [];
        if (!platforms.includes(game.platform)) {
          platforms.push(game.platform);
        }
        const popularity = existGame?.popularity || game.popularity;
        return {
          gameId: game.id.trim(),
          title: game.title.trim(),
          titleUrl: getTitleUrl(game.title.trim()),
          description: game.description?.trim(),
          instructions: game.instructions?.trim(),
          url: game.url.trim(),
          thumb: game.thumb.trim(),
          bannerImage: game.thumb.trim(),
          width: game.width,
          height: game.height,
          categories: [categoryName],
          tags: tags,
          lastUpdated: new Date(),
          fetchFrom: game.from || "monetize",
          platforms: platforms,
          popularity: popularity,
        };
      });
    console.log("addGames", games.length, addGames.length);
    // 批量插入或更新games
    const batchSize = 3000;
    while (addGames.length > 0) {
      const batch = addGames.splice(0, batchSize);
      await GameModel.bulkWrite(
        batch.map((game) => {
          return {
            updateOne: {
              filter: { titleUrl: game.titleUrl },
              update: { $set: game },
              upsert: true,
            },
          };
        })
      );
    }
  } catch (error) {
    console.error("saveGameMonetizeGames error", error);
  }
}
