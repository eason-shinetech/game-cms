import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import { MetadataRoute } from "next";

// 添加错误处理逻辑
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const baseUrl = "https://funnyplayers.com";

    // 修正 MongoDB 连接配置（根据生产环境实际情况）
    await dbConnect().catch((error) => {
      console.error("数据库连接失败:", error);
      throw error;
    });

    const staticRoutes = [
      "",
      "/about",
      "/privacy",
      "/terms",
      "/contact",
      "/history",
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // 添加游戏数据查询的错误处理
    const games = await GameModel.find(
      { status: "published", clickCount: { $gte: 1 } },
      { titleUrl: 1, updatedAt: 1 } // 确保选择需要的字段
    )
      .lean()
      .catch((error) => {
        console.error("游戏数据查询失败:", error);
        return [];
      });

    // 添加空值检查
    const gameRoutes = games
      .filter((game) => game.titleUrl) // 过滤无效标题
      .map((game) => ({
        url: `${baseUrl}/${game.titleUrl}`,
        lastModified: game.updatedAt ? new Date(game.updatedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      ...staticRoutes,
      ...gameRoutes,
    ];
  } catch (error) {
    console.error("生成 sitemap 失败:", error);
    return []; // 返回空数组避免构建失败
  }
}
