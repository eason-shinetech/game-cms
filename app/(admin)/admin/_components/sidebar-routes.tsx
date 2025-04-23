"use client";

import {
  Import,
  Layout,
  List,
  LogOut,
  LogOutIcon,
  PencilIcon,
  Search,
  Settings,
} from "lucide-react";
import SidebarItem from "./sidebar-item";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const adminRoutes = [
  {
    icon: Layout,
    label: "Home",
    href: "/admin",
  },
  {
    icon: List,
    label: "Game List",
    href: "/admin/list",
  },
  {
    icon: Search,
    label: "Game Fetch",
    href: "/admin/game-fetch",
  },
  {
    icon: Import,
    label: "Game Import",
    href: "/admin/game-import",
  },
  {
    icon: PencilIcon,
    label: "Game Create",
    href: "/admin/game-create",
  },
];

const SidebarRoutes = () => {
  const logout = async () => {
    const res = await signOut({
      redirect: false,
      redirectTo: "/login",
    });
    if (res?.url) {
      redirect(res.url);
    }
  };
  return (
    <div className="flex flex-col w-full">
      {adminRoutes.map((route, index) => (
        <SidebarItem
          key={index}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
      <div className="absolute bottom-10 w-full">
        <Button
          onClick={logout}
          type="button"
          variant="ghost"
          className="w-full h-[60px] text-slate-500 text-md font-[500] transition-all hover:text-slate-600 hover:bg-slate-300/20"
        >
          <LogOutIcon className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SidebarRoutes;
