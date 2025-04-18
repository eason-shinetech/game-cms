import dbConnect from "@/lib/db";
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
    return NextResponse.json(categories);
  } catch (err) {
    console.log("[Get Game Category List Error]:", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
