import GameModel, { Game, GameDistributionResult } from "@/models/game";
import { handleCategorys, handleTags } from "./game-fetch-action";
import { PropsCURDOmitted } from "@/models/base";
import { CategoryMapping } from "@/models/game-category";
import { getTitleUrl } from "@/lib/utils";

export async function saveGameDistributionGames(
  games: GameDistributionResult[]
) {
  try {
    if (!games || games.length === 0) {
      return;
    }
    // 处理categorys
    const categorys = Array.from(
      new Set(games.flatMap((game) => game.categories)?.filter((c) => c))
    );
    await handleCategorys(categorys);

    // 处理tags
    const tags = Array.from(
      new Set(games.flatMap((game) => game.tags)?.filter((t) => t))
    );
    await handleTags(tags);

    // 最后处理games
    const addGames: Omit<Game, PropsCURDOmitted>[] = games
      .filter(
        (g) => !!g.title && !!g.width && !!g.height && !!g.thumb && !!g.url
      )
      .map((game) => {
        if (game.categories.length === 0) {
          game.categories = ["Others"];
        }
        const categoryMapping = game.categories.map((category) => {
          const mapping = CategoryMapping.find((m) =>
            m.categories.includes(category)
          );
          return mapping?.name || "Others";
        });

        return {
          gameId: game.id,
          title: game.title.trim(),
          titleUrl: getTitleUrl(game.title.trim()),
          description: game.description?.trim(),
          instructions: game.instructions?.trim(),
          url: game.url,
          thumb: game.thumb,
          bannerImage: game.bannerImage,
          images: game.images,
          width: game.width,
          height: game.height,
          categories: categoryMapping,
          tags: game.tags,
          lastUpdated: new Date(),
          fetchFrom: "game distribution",
          platforms: ["html5", "mobile"],
          popularity: "",
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
