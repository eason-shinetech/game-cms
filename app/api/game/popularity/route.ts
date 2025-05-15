import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { selectIds, popularity } = body;
    if (
      !selectIds ||
      !Array.isArray(selectIds) ||
      selectIds.length === 0 ||
      !popularity
    ) {
      return new NextResponse("Missing info", { status: 400 });
    }
    await dbConnect();
    const games = await GameModel.find({ _id: { $in: selectIds } });
    if (!games || games.length === 0) {
      return new NextResponse("No games found", { status: 404 });
    }
    const gameIds = games.map((game) => game._id.toString());
    await GameModel.updateMany(
      { _id: { $in: gameIds } },
      { $set: { popularity } }
    )
    return new NextResponse("Games updated successfully", { status: 200 });
  } catch (e) {
    console.log("[Set Popularity Error]: ", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
