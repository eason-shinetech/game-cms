"use client";

import { cn } from "@/lib/utils";
import { CategoryMapping } from "@/models/game-category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
  _id: string;
  name: string;
}

const GameMobileCategoryItem = ({ _id, name }: CategoryItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryName = searchParams.get("categoryName") || "";
  const title = searchParams.get("title");

  const isActive = categoryName === name;

  const queryForCategory = (categoryName: string) => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryName: categoryName,
          title: title,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  const Icon = CategoryMapping.find((item) => item.name === name)?.icon;

  return (
    <div
      onClick={() => queryForCategory(name)}
      className={cn(
        "w-full h-full flex items-center gap-x-2 text-sky-500 text-sm font-[500] pl-4 transition-all shadow-sm hover:text-sky-500",
        isActive && "bg-sky-400/80 text-white hover:bg-sky-500 hover:text-white"
      )}
    >
      <div className="flex items-center gap-x-2 py-2">
        {Icon && <Icon className="w-4 h-4" />}
        {name}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </div>
  );
};
export default GameMobileCategoryItem;
