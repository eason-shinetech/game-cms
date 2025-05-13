import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import HistoryModel, { UserStatisticsResult } from "@/models/history";
import { GameUserList } from "@/data/game-user-schema";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const aggr: any[] = [
      {
        $facet: {
          userIds: [
            { $group: { _id: "$userId", date: { $max: "$date" } } },
            { $sort: { date: -1, _id: 1 } },
          ],
          totalLogins: [
            {
              $group: {
                _id: { userId: "$userId", date: "$date" },
                count: { $sum: 1 },
              },
            },
            { $group: { _id: "$_id.userId", count: { $sum: 1 } } },
          ],
          totalGames: [
            {
              $group: {
                _id: { userId: "$userId", gameId: "$gameId" },
                count: { $sum: 1 },
              },
            },
            { $project: { userId: "$_id.userId" } },
            { $group: { _id: "$userId", count: { $sum: 1 } } },
          ],
        },
      },
    ];

    const result = await HistoryModel.aggregate<UserStatisticsResult>(aggr);
    const data: GameUserList[] = [];
    if (result.length) {
      const { userIds, totalLogins, totalGames } = result[0];
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i]._id;
        const totalLogin =
          totalLogins.find((item) => item._id === userId)?.count || 0;
        const totalGame =
          totalGames.find((item) => item._id === userId)?.count || 0;
        const lastLoginDate = userIds[i].date || "";
        data.push({
          userId,
          loginCount: totalLogin,
          gameCount: totalGame,
          lastDate: lastLoginDate,
        });
      }
    }
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
