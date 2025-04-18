import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Game ID is required", { status: 400 });
    }
    await dbConnect();
    const game = await GameModel.findById(id);
    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }
    return NextResponse.json(game, { status: 200 });
  } catch (err) {
    console.log("[Game Detail Error]: ", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
