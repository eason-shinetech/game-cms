import GameModel from "@/models/game";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ popularity: string }> }
) {
  try {
    const { popularity } = await params;
    const data = await GameModel.find({ popularity: popularity });
    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
}
