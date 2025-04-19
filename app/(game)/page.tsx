import dbConnect from "@/lib/db";
import AdBanner from "./_components/ad-banner";
import GameBanner from "./_components/banner";
import GameCategory from "./_components/category";
import GameList from "./_components/game-list";
import GameModel from "@/models/game";
import { convertToMongoId } from "@/lib/utils";
import { Suspense } from "react";

const GamePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ categoryId: string; title: string }>;
}) => {
  const { categoryId, title } = await searchParams;
  await dbConnect();
  const conds: any[] = [{ status: "published" }];
  if (categoryId) {
    conds.push({ categoryIds: convertToMongoId(categoryId) });
  }
  if (title) {
    conds.push({
      title: {
        $regex: title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      },
    });
  }
  const data = await GameModel.find(
    conds.length > 0 ? { $and: conds } : {},
    { title: 1, thumb: 1 },
    { limit: 24, sort: { clickCount: -1, updatedAt: -1, title: 1 } }
  );
  const games = data.map((item) => ({
    _id: item._id.toString(),
    title: item.title,
    thumb: item.thumb,
  }));
  return (
    <div className="flex flex-col gap-4">
      <GameBanner />
      {/* <AdBanner /> */}
      <GameCategory />
      <Suspense>
        <GameList initGames={games} />
      </Suspense>
    </div>
  );
};

export default GamePage;
