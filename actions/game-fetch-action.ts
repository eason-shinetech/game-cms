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
    const dbCategorys = await handleCategorys(categorys);
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
    const dbTags = await handleTags(tags);

    // 最后处理games
    const addGames: Omit<Game, PropsCURDOmitted>[] = games
      .filter((g) => !!g.title && !!g.width && !!g.height)
      .map((game) => {
        const categoryMapping = CategoryMapping.find((m) =>
          m.categories.includes(game.category)
        );
        const categoryName = categoryMapping?.name || "Others";
        const categoryIds =
          dbCategorys
            ?.filter((category) => category.name === categoryName)
            .map((category) => category._id) || [];
        if (categoryIds.length === 0) {
          console.log(
            "categoryIds is empty",
            game.title,
            game.category,
            categoryMapping
          );
        }
        const tagIds =
          dbTags
            ?.filter((tag) => game.tags.includes(tag.name))
            .map((tag) => tag._id) || [];
        return {
          gameId: game.id.trim(),
          title: game.title.trim(),
          description: game.description?.trim(),
          instructions: game.instructions?.trim(),
          url: game.url.trim(),
          thumb: game.thumb.trim(),
          width: game.width,
          height: game.height,
          categoryIds,
          tagIds,
          lastUpdated: new Date(),
          fetchFrom: "monetize",
          images: [],
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
    return await GameCategoryModel.find({ name: { $in: categoryMapping } });
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
    return await GameTagModel.find({ name: { $in: tags } }); // 改为使用标签专用模型
  } catch (error) {
    console.error("saveTags error", error);
  }
}
