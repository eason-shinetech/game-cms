import { GameCategoryList } from "@/data/game-category-schema";
import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import GameCategoryModel from "@/models/game-category";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const categories = await GameCategoryModel.find(
      {},
      { name: 1 },
      { sort: { order: 1 } }
    );
    const aggr: any[] = [
      { $match: { "categories.0": { $exists: 1 } } },
      { $unwind: { path: "$categories", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
    ];
    const result = await GameModel.aggregate<{ _id: string; count: number }>(
      aggr
    );
    const data: GameCategoryList[] = categories.map((item) => ({
      name: item.name,
      gameCount: result.length
        ? result.find((r) => r._id === item.name)?.count || 0
        : 0,
    }));
    return NextResponse.json(data);
  } catch (err) {
    console.log("[Get Game Category List Error]:", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
