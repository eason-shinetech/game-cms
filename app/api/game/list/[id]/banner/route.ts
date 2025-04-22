import dbConnect from "@/lib/db";
import GameModel from "@/models/game";
import GameConfigModel from "@/models/game-config";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params  }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const game = await GameModel.findById(id);
    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }
    if (!game.bannerImage) {
      return new NextResponse("Game banner not found", { status: 400 });
    }
    const config = await GameConfigModel.findOne();
    if (!config) {
      await GameConfigModel.create({
        banners: [
          {
            id: game._id,
            bannerImage: game.bannerImage,
          },
        ],
      });
    } else {
      await GameConfigModel.updateOne(
        { _id: config._id },
        {
          $push: {
            banners: {
              id: game._id,
              bannerImage: game.bannerImage,
            },
          },
        }
      );
    }
    return new NextResponse("Game banner set successfully", { status: 200 });
  } catch (error) {
    console.log("[Set Game Banner]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const config = await GameConfigModel.findOne();
    if (!config) {
      return new NextResponse("Game config not found", { status: 404 });
    }
    const game = await GameModel.findById(id);
    if (!game) {
      return new NextResponse("Game not found", { status: 404 });
    }
    const banners = config.banners || [];
    if (banners.length <= 4) {
      return new NextResponse("There must be at least four banners", {
        status: 400,
      });
    }
    await GameConfigModel.updateOne(
      { _id: config._id },
      {
        $pull: {
          banners: {
            id: game._id,
          },
        },
      }
    );
    return new NextResponse("Game banner deleted successfully", {
      status: 200,
    });
  } catch (error) {
    console.log("[Delete Game Banner]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
