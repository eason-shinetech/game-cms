import dbConnect from "@/lib/db";
import GameTagModel from "@/models/game-tag";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const tags = await GameTagModel.find({}, { name: 1 });
    return NextResponse.json(tags);
  } catch (err) {
    console.log("[Get Game List Error]:", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
