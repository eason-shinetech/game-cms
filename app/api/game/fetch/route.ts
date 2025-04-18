import { saveGameMonetizeGames } from "@/actions/game-fetch-action";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const games = await req.json();
    if (!games || games.length === 0) {
      return new NextResponse("No games provided", { status: 400 });
    }
    await dbConnect();
    await saveGameMonetizeGames(games);
    return new NextResponse("OK", { status: 200 });
  } catch (e) {
    console.error("[Game Fetch Error]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
