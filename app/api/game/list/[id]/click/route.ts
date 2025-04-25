import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const game = await GameModel.findById(id);
    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }
    game.clicks += 20;
    await game.save();
    return new NextResponse("Game clicked successfully", { status: 200 });
  } catch (error) {
    console.log("[Click Game]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
