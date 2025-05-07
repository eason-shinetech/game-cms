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
    const ids = await req.json();
    await dbConnect();
    if (!ids || ids.length === 0) {
      return new NextResponse("No ids provided", { status: 400 });
    }
    await GameModel.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 'published' } }
    );
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.log("[Selected Publish Error]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
