"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { SearchInput } from "../search-input";

const MobileSearch = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <>
      {isHomePage && (
        <div className="md:hidden w-full p-4">
          <Suspense>
            <SearchInput />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default MobileSearch;
