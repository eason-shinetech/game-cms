import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import HistoryModel, { IHistory } from "@/models/history";
import mongoose from "mongoose";
import GameModel from "@/models/game";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("Add Game History", userId, id);
    await dbConnect();
    const game = await GameModel.findOne({ titleUrl: id });
    if (!game) {
      return new NextResponse("Game Not Found", { status: 404 });
    }
    const date = dayjs().format("YYYY-MM-DD");
    const history = await HistoryModel.findOne({
      userId,
      date,
      gameId: game._id,
    });
    if (!history) {
      await HistoryModel.create({
        userId,
        date,
        gameId: game._id,
      });
    }
    return new NextResponse("Post Game History Updated", { status: 200 });
  } catch (error) {
    console.log("[Game History Error]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
