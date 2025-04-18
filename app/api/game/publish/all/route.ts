import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await dbConnect();
    await GameModel.updateMany(
      { status: "draft" },
      { $set: { status: "published" } }
    );
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.log("[Publish All Error]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
