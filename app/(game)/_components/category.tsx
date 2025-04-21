import dbConnect from "@/lib/db";
import GameCategoryModel from "@/models/game-category";
import CategoryItem from "./category-item";
import { Suspense } from "react";

const GameCategory = async () => {
  await dbConnect();
  const categories = await GameCategoryModel.find(
    {},
    { name: 1 },
    { sort: { order: 1 } }
  );
  if (categories.length === 0) return null;

  return (
    <div className="hidden md:flex w-full min-h-[80px] items-center flex-wrap gap-4 shadow-sm rounded-md p-4">
      <Suspense>
        <CategoryItem _id="" name="All" />
        {categories.map((category) => {
          return (
            <CategoryItem
              key={category._id}
              _id={category._id.toString()}
              name={category.name}
            />
          );
        })}{" "}
      </Suspense>
    </div>
  );
};

export default GameCategory;
