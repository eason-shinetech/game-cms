"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HeaderSideBar = () => {
  const { data: session } = useSession();

  const getFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      {session && session.user && (
        <div className="flex ml-auto mr-4 cursor-pointer">
          <Avatar className="w-10 h-10 text-sky-700">
            {session.user.image && (
              <AvatarImage src={session.user.image} alt="@shadcn" />
            )}
            <AvatarFallback className="bg-emerald-300/20">
              {getFirstLetter(session.user.name || "admin")}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </>
  );
};

export default HeaderSideBar;
