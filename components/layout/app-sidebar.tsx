"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import Logo from "../commons/logo";
import {
  AirplayIcon,
  BetweenHorizonalEndIcon,
  BookMarkedIcon,
  Gamepad2Icon,
  ListIcon,
  SearchIcon,
  Users2Icon,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const menus = [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/new-admin",
          icon: AirplayIcon,
        },
        {
          title: "Games",
          icon: Gamepad2Icon,
          items: [
            {
              title: "List",
              url: "/new-admin/game-list",
              icon: ListIcon,
            },
            {
              title: "Fetch",
              url: "/new-admin/game-fetch",
              icon: BetweenHorizonalEndIcon,
            },
            {
              title: "Fetch URL",
              url: "/new-admin/fetch-url",
              icon: SearchIcon,
            },
          ],
        },
        {
          title: "Category",
          url: "/new-admin/category",
          icon: BookMarkedIcon,
        },
        {
          title: "Users",
          url: "/new-admin/users",
          icon: Users2Icon,
        },
      ],
    },
  ];
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <Logo className="p-4" />
      </SidebarHeader>
      <SidebarContent>
        {menus.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
