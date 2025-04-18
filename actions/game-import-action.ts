import GameModel, { Game, GameDistributionResult } from "@/models/game";
import { handleCategorys, handleTags } from "./game-fetch-action";
import { PropsCURDOmitted } from "@/models/base";
import { CategoryMapping } from "@/models/game-category";

export async function saveGameDistributionGames(
  games: GameDistributionResult[]
) {
  try {
    if (!games || games.length === 0) {
      return;
    }
    // 处理categorys
    const categorys = Array.from(
      new Set(games.flatMap((game) => game.categorys)?.filter((c) => c))
    );
    const dbCategorys = await handleCategorys(categorys);

    // 处理tags
    const tags = Array.from(
      new Set(games.flatMap((game) => game.tags)?.filter((t) => t))
    );
    const dbTags = await handleTags(tags);

    // 最后处理games
    const addGames: Omit<Game, PropsCURDOmitted>[] = games
      .filter((g) => !!g.title && !!g.width && !!g.height)
      .map((game) => {
        if (game.categorys.length === 0) {
          game.categorys = ["Others"];
        }
        const categoryMapping = game.categorys.map((category) => {
          const mapping = CategoryMapping.find((m) =>
            m.categories.includes(category)
          );
          return mapping?.name || "Others";
        });

        const categoryIds =
          dbCategorys
            ?.filter((item) => categoryMapping.includes(item.name))
            .map((category) => category._id) || [];
        if (categoryIds.length === 0) {
          console.log(
            "categoryIds is empty",
            game.title,
            game.categorys,
            categoryMapping
          );
        }
        const tagIds =
          dbTags
            ?.filter((tag) => game.tags.includes(tag.name))
            .map((tag) => tag._id) || [];
        return {
          gameId: game.id,
          title: game.title.trim(),
          description: game.description?.trim(),
          instructions: game.instructions?.trim(),
          url: game.url,
          thumb: game.thumb,
          bannerImage: game.bannerImage,
          images: game.images,
          width: game.width,
          height: game.height,
          categoryIds,
          tagIds,
          lastUpdated: new Date(),
          fetchFrom: "game distribution",
        };
      });

    // 批量插入或更新games
    await GameModel.bulkWrite(
      addGames.map((game) => {
        return {
          updateOne: {
            filter: {
              title: game.title.trim(),
            },
            update: { $set: game },
            upsert: true,
          },
        };
      })
    );
  } catch (error) {
    console.error("saveGameMonetizeGames error", error);
  }
}
