"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CategoryMapping } from "@/models/game-category";
import { JoystickIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
  _id: string;
  name: string;
}

const CategoryItem = ({ _id, name }: CategoryItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryName = searchParams.get("categoryName") || "All";
  const title = searchParams.get("title");
  const popularity = searchParams.get("popularity");
  const queryForCategory = (categoryName: string) => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryName: categoryName === "All" ? "" : categoryName,
          title: title,
          popularity: popularity
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };
  const Icon = CategoryMapping.find((item) => item.name === name)?.icon || JoystickIcon;

  return (
    <Button
      onClick={() => queryForCategory(name)}
      variant={`outline`}
      className={cn(
        "text-xs text-sky-700 hover:text-sky-700 rounded-2xl cursor-pointer",
        categoryName === name &&
          "bg-sky-500 text-white hover:bg-sky-700 hover:text-white"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {name}
    </Button>
  );
};

export default CategoryItem;
