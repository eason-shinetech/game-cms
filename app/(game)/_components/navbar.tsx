"use client";

import Logo from "@/components/commons/logo";
import { SearchInput } from "./search-input";
import { Home, TimerIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import MobileSidebar from "./mobile/mobile-sidebar";

const GameNavbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div className="w-full flex justify-between items-center gap-2">
      <div className="block md:hidden">
        <MobileSidebar />
      </div>
      <div>
        <Logo />
      </div>
      {isHomePage ? (
        <div className="hidden md:block ml-auto">
          <Suspense>
            <SearchInput />
          </Suspense>
        </div>
      ) : (
        <Link href="/" className="ml-auto" title="Home">
          <Home />
        </Link>
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
