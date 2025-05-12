"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { GameList } from "@/data/game-schema";
import { DataTableColumnHeader } from "./data-table-column-header";
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
import Image from "next/image";

export const getColumns = (onRefresh: () => void): ColumnDef<GameList>[] => [
  {
    id: "select",
    size: 30,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "thumb",
    size: 100,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thumb" />
    ),
    cell: ({ row }) => {
      const img = String(row.getValue("thumb"));
      return (
        <div className="w-[100px] h-[100px] relative">
          <Image
            src={img}
            alt="thumb"
            fill
            sizes="(max-width: 768px) 100px, 100px"
            className="object-contain"
            priority={true}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="flex space-x-2" title={title}>
          <span className="truncate font-medium">{title}</span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "isSetBanner",
    size: 50,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banner" />
    ),
    cell: ({ row }) => {
      const isSetBanner = Boolean(row.getValue("isSetBanner"));
      return (
        <div className="w-[50px] flex items-center justify-center">
          {isSetBanner && <FlagIcon className="w-4 h-4" />}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "categories",
    size: 80,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const categories = row.getValue("categories") as string[];
      return categories.map((category) => (
        <span
          key={category}
          className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
        >
          {category}
        </span>
      ));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "clickCount",
    size: 80,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clicks" />
    ),
    cell: ({ row }) => {
      const clickCount = row.getValue("clickCount") as string;
      return (
        <div className="break-words whitespace-pre-wrap">{clickCount}</div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "popularity",
    size: 80,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Popularity" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "from",
    size: 80,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    size: 100,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as "draft" | "published";
      return (
        <div className="flex items-center">
          <CircleCheckIcon
            className={cn(
              "mr-2 h-4 w-4 text-muted-foreground",
              status === "published" && "text-green-500"
            )}
          />
          <span>{status}</span>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "actions",
    size: 80,
    cell: ({ row }) => {
      const status = row.getValue("status") as "draft" | "published";
      const isSetBanner = Boolean(row.getValue("isSetBanner"));
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
                publish(row.original).then(onRefresh);
              }}
            >
              {status === "draft" ? `Publish` : `Unpublish`}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setBanner(row.original).then(onRefresh);
              }}
            >
              {isSetBanner ? `Remove Banner` : `Set Banner`}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                addClick(row.original).then(onRefresh);
              }}
            >
              Add Click
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const publish = async (game: GameList) => {
  try {
    const res = await axios.post(`/api/game/publish/${game._id}`);
    toast.success(
      `Game “${game.title}” ${
        res.data.status === "published" ? "published" : "unpublished"
      } successfully!`
    );
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong");
  }
};

const setBanner = async (game: GameList) => {
  try {
    if (!game.bannerImage) {
      toast.error("This game has no banner image");
      return;
    }
    if (game.isSetBanner) {
      await axios.delete(`/api/game/list/${game._id}/banner`);
    } else {
      await axios.post(`/api/game/list/${game._id}/banner`);
    }

    toast.success(`Game “${game.title}” set banner successfully!`);
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong");
  }
};

const addClick = async (game: GameList) => {
  try {
    await axios.post(`/api/game/list/${game._id}/click`);
    toast.success(`Game “${game.title}” add click successfully!`);
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong");
  }
};
