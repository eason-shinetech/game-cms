import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { id } = await params;
    await dbConnect();
    const game = await GameModel.findById(id);
    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }
    game.status = game.status === "published" ? "draft" : "published";
    await game.save();
    return NextResponse.json(game);
  } catch (error) {
    console.log("[Publish Error]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
