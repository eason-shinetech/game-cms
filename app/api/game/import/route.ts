import { saveGameDistributionGames } from "@/actions/game-import-action";
import dbConnect from "@/lib/db";
import { GameDistributionResult } from "@/models/game";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const games: GameDistributionResult[] = await req.json();
    if (!games || games.length === 0) {
      return new NextResponse("No games provided", { status: 400 });
    }
    await dbConnect();
    await saveGameDistributionGames(games);
    return new NextResponse("Games imported successfully", { status: 200 });
  } catch (error) {
    console.error("[Import Game Error]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
