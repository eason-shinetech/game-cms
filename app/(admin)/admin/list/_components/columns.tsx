"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown, EyeIcon, FlagIcon, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type GameList = {
  _id: string;
  thumb: string;
  title: string;
  categories: string[];
  tags: string[];
  from: string;
  status: "draft" | "published";
  bannerImage?: string;
  isSetBanner: boolean;
};

// 修改 columns 定义，接收 onRefresh 参数
export const getColumns = (onRefresh: () => void): ColumnDef<GameList>[] => [
  {
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "thumb",
    header: () => "Thumb",
    size: 100,
    cell: ({ row }) => {
      const img = String(row.getValue("thumb"));
      return (
        <div className="w-[100px] h-[75px] relative">
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
  },
  {
    accessorKey: "title",
    size: 200,
    header: ({ column }) => (
      <div>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="font-semibold break-words whitespace-pre-wrap">
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "isSetBanner",
    header: () => "Banner",
    size: 100,
    cell: ({ row }) => {
      const isSetBanner = Boolean(row.getValue("isSetBanner"));
      return (
        <div className="w-[50px] flex items-center justify-center">
          {isSetBanner && <FlagIcon className="w-4 h-4" />}
        </div>
      );
    },
  },
  {
    accessorKey: "categories",
    header: () => "Category",
    size: 160,
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
  },
  // {
  //   accessorKey: "tags",
  //   header: () => "Tag",
  //   size: 300,
  //   cell: ({ row }) => {
  //     const tags = row.getValue("tags") as string[];

  //     return (
  //       <div className="flex flex-wrap gap-2">
  //         {tags.map((tag) => (
  //           <span
  //             key={tag}
  //             className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
  //           >
  //             {tag}
  //           </span>
  //         ))}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "from",
    size: 120,
    header: ({ column }) => (
      <div>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          From
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "status",
    size: 100,
    header: ({ column }) => (
      <div>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as "draft" | "published";
      return (
        <span
          className={cn(
            `px-2 py-1 text-xs rounded bg-slate-200 text-slate-800`,
            status === "published" && "font-semibold bg-emerald-200"
          )}
        >
          {status === "draft" ? "Draft" : "Published"}
        </span>
      );
    },
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
