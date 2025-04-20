"use client";

import Logo from "@/components/commons/logo";
import { SearchInput } from "./search-input";
import { TimerIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

const GameNavbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div className="w-full flex justify-between items-center gap-2">
      <div>
        <Logo />
      </div>
      {isHomePage && (
        <div className="hidden md:block ml-auto">
          <Suspense>
            <SearchInput />
          </Suspense>
        </div>
      )}
      <div>
        <Link href="/history" title="History">
          <TimerIcon />
        </Link>
      </div>
    </div>
  );
};

export default GameNavbar;
