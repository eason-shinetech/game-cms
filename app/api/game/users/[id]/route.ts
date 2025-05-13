import dbConnect from "@/lib/db";
import HistoryModel from "@/models/history";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    await HistoryModel.deleteMany({ userId: id });
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}