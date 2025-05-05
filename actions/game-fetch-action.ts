import { getTitleUrl } from "@/lib/utils";
import { PropsCURDOmitted } from "@/models/base";
import GameModel, { GameMonetizeResult, Game } from "@/models/game";
import GameCategoryModel, { CategoryMapping } from "@/models/game-category";
import GameTagModel from "@/models/game-tag"; // 新增导入标签模型

export async function saveGameMonetizeGames(games: GameMonetizeResult[]) {
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
    // 查找已存在的games
    const existGames = await GameModel.find({ title: { $in: titles } });

    // 最后处理games
    const addGames: Omit<Game, PropsCURDOmitted>[] = games
      .filter((g) => !!g.title && !!g.width && !!g.height)
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
          popularity: game.popularity,
        };
      });
    // 批量插入或更新games
    const batchSize = 3000;
    while (addGames.length > 0) {
      const batch = addGames.splice(0, batchSize);
      await GameModel.bulkWrite(
        batch.map((game) => {
          return {
            updateOne: {
              filter: { title: game.title.trim() },
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

export async function handleCategorys(categorys: string[]) {
  if (!categorys || categorys.length === 0) {
    return;
  }
  const categoryMapping = categorys.map((category) => {
    const nameMapping = CategoryMapping.find((m) =>
      m.categories.includes(category)
    );
    return nameMapping?.name || "Others";
  });
  try {
    await GameCategoryModel.bulkWrite(
      categoryMapping.map((category) => {
        const exist = CategoryMapping.find((m) => m.name === category);
        return {
          updateOne: {
            filter: { name: category },
            update: {
              $setOnInsert: { name: category, order: exist?.order || 0 },
            },
            upsert: true,
          },
        };
      })
    );
    // return await GameCategoryModel.find({ name: { $in: categoryMapping } });
  } catch (error) {
    console.error("saveCategorys error", error);
  }
}

export async function handleTags(tags: string[]) {
  if (!tags || tags.length === 0) {
    return;
  }
  try {
    await GameTagModel.bulkWrite(
      // 改为使用标签专用模型
      tags.map((tag) => {
        return {
          updateOne: {
            filter: { name: tag },
            update: { $setOnInsert: { name: tag } },
            upsert: true,
          },
        };
      })
    );
    // return await GameTagModel.find({ name: { $in: tags } }); // 改为使用标签专用模型
  } catch (error) {
    console.error("saveTags error", error);
  }
}
