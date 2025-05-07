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
    const games = await GameModel.find({
      _id: { $in: ids },
      bannerImage: { $exists: true, $ne: null },
    });
    if (games.length === 0) {
      return new NextResponse("No games found", { status: 404 });
    }
    const config = await GameConfigModel.findOne();
    if (!config) {
      const banners = games.map((game) => ({
        id: game._id,
        titleUrl: game.titleUrl,
        bannerImage: game.bannerImage,
      }));
      await GameConfigModel.create({
        banners: banners,
      });
    } else {
      for (const game of games) {
        if (
          config.banners.some(
            (banner: any) => banner.id.toString() === game._id.toString()
          )
        ) {
          continue;
        }
        await GameConfigModel.updateOne(
          { _id: config._id },
          {
            $push: {
              banners: {
                id: game._id,
                titleUrl: game.titleUrl,
                bannerImage: game.bannerImage,
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
