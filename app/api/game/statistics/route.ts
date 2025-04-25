import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import HistoryModel from "@/models/history";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await dbConnect();
    // 总共游戏数
    const games = await GameModel.find({}, { status: 1 });
    const publishedGames = games.filter((game) => game.status === "published");
    // 玩家数
    const aggregate: any[] = [
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
        },
      },
    ];
    const result = await HistoryModel.aggregate(aggregate);
    const totalCount = result.length > 0 ? result[0].totalCount : 0;
    const todayAggr = [
      { $match: { date: dayjs().format("YYYY-MM-DD") } },
      ...aggregate,
    ];
    const todayResult = await HistoryModel.aggregate(todayAggr);
    const todayCount = todayResult.length > 0 ? todayResult[0].totalCount : 0;
    return NextResponse.json({
      gameCount: games.length,
      publishedGameCount: publishedGames.length,
      playerCount: totalCount,
      todayPlayerCount: todayCount,
    });
  } catch (error) {
    console.log("", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
