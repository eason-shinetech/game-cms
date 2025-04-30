import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Game Click:", id);
    await dbConnect();
    const game = await GameModel.findOne({ titleUrl: id });
    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }
    await GameModel.updateOne({ _id: game._id }, { $inc: { clickCount: 1 } });
    return new NextResponse("Game Clicked", { status: 200 });
  } catch (error) {
    console.log("[Game Click Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
