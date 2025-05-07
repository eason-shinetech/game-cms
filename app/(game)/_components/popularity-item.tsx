"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface PopularityItemProps {
  name: string;
  value: string;
  img: string;
}

const PopularityItem = ({ name, value, img }: PopularityItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryName = searchParams.get("categoryName");
  const title = searchParams.get("title");
  const popularity = searchParams.get("popularity");
  const queryFoPopularity = (value: string) => {
    if (popularity === value) {
      value = "";
    }
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryName: categoryName,
          title: title,
          popularity: value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };
  return (
    <Button
      onClick={() => queryFoPopularity(value)}
      variant={`outline`}
      className={cn(
        `relative text-md xl:text-xl h-30 text-sky-700 font-semibold hover:text-sky-700 rounded-2xl cursor-pointer`,
        popularity === value &&
          "bg-sky-500 text-white hover:bg-sky-700 hover:text-white"
      )}
    >
      <div
        style={{ backgroundImage: `url('${img}')` }}
        className="hidden xl:block w-30 h-30 bg-no-repeat bg-center bg-contain"
      ></div>
      <div
        style={{ backgroundImage: `url('${img}')` }}
        className="absolute xl:hidden w-full h-full bg-no-repeat opacity-20 bg-center bg-contain"
      ></div>
      <div className="flex-1">{name}</div>
    </Button>
  );
};

export default PopularityItem;
