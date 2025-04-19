"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  const categoryId = searchParams.get("categoryId") || "";
  const title = searchParams.get("title");
  const queryForCategory = (categoryId: string) => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: categoryId,
          title: title,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <Button
      onClick={() => queryForCategory(_id)}
      variant={`outline`}
      className={cn(
        "text-xs text-sky-700 hover:text-sky-700 rounded-2xl cursor-pointer",
        categoryId === _id &&
          "bg-sky-500 text-white hover:bg-sky-700 hover:text-white"
      )}
    >
      {name}
    </Button>
  );
};

export default CategoryItem;
