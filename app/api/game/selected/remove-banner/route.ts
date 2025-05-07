import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import GameConfigModel from "@/models/game-config";
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

    const config = await GameConfigModel.findOne();
    if (!config) {
      return new NextResponse("Game config not found", { status: 404 });
    }
    for (const id of ids) {
      if (config.banners.some((banner: any) => banner.id.toString() === id)) {
        await GameConfigModel.updateOne(
          { _id: config._id },
          {
            $pull: {
              banners: {
                id: id,
              },
            },
          }
        );
      }
    }
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.log("[Selected Add Banner Error]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
