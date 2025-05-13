"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { GameUserList } from "@/data/game-user-schema";
import { DataTableColumnHeader } from "../../../../../components/commons/data-table-column-header";
import { CircleCheckIcon, FlagIcon, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

export const getColumns = (onRefresh: () => void): ColumnDef<GameUserList>[] => [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("userId") as string;
      return (
        <div className="flex space-x-2" title={title}>
          <span className="truncate font-medium">{title}</span>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "gameCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Games" />
    ),
    cell: ({ row }) => {
      const gameCount = row.getValue("gameCount") as string;
      return <div className="break-words whitespace-pre-wrap">{gameCount}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "loginCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logins" />
    ),
    cell: ({ row }) => {
      const loginCount = row.getValue("loginCount") as string;
      return (
        <div className="break-words whitespace-pre-wrap">{loginCount}</div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "lastDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
    cell: ({ row }) => {
      const lastDate = row.getValue("lastDate") as string;
      return <div className="break-words whitespace-pre-wrap">{lastDate}</div>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    size: 80,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                Remove(row.original).then(onRefresh);
              }}
            >
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Remove = async (user: GameUserList) => {
  try {
    await axios.delete(`/api/game/users/${user.userId}`);
    toast.success(`Remove successfully!`);
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong");
  }
};
