import dbConnect from "@/lib/db";
import GameConfigModel from "@/models/game-config";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const config = await GameConfigModel.findOne();
    return NextResponse.json(config);
  } catch (error) {
    console.log("[Get Game Config]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
