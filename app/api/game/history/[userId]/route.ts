import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import HistoryModel, { GameHistory } from "@/models/history";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    if (!userId) {
      return new NextResponse("Missing id or userId", { status: 400 });
    }
    await dbConnect();
    //最多50条数据
    const histories: GameHistory[] = [];
    const data = await HistoryModel.find(
      { userId },
      { gameId: 1, date: 1, userId: 1 },
      { sort: { date: -1 }, limit: 50 }
    );
    if (data.length > 0) {
      const gameIds = data.map((item) => item.gameId);
      const gameData = await GameModel.find(
        { _id: { $in: gameIds } },
        { title: 1, thumb: 1, description: 1 }
      );
      for (const history of data) {
        const game = gameData.find(
          (item) => item._id.toString() === history.gameId.toString()
        );
        if (game) {
          histories.push({
            gameId: history.gameId,
            gameTitle: game.title,
            gameTitleUrl: game.titleUrl,
            gameThumb: game.thumb,
            gameDescription: game.description,
            date: history.date,
            userId: history.userId,
          });
        }
      }
    }
    return NextResponse.json(histories);
  } catch (error) {
    console.log("[Get Game History Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
