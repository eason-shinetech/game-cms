"use client";

import Logo from "@/components/commons/logo";
import { SearchInput } from "./search-input";
import { TimerIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const GameNavbar = () => {
  return (
    <div className="w-full flex justify-between items-center gap-2">
      <div>
        <Logo />
      </div>
      <div className="hidden md:block ml-auto">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>
      <div>
        <Link href="/" title="History">
          <TimerIcon />
        </Link>
      </div>
    </div>
  );
};

export default GameNavbar;
