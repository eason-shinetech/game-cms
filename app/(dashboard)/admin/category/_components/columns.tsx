"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GameCategoryList } from "@/data/game-category-schema";
import { DataTableColumnHeader } from "../../../../../components/commons/data-table-column-header";

export const getColumns = (onRefresh: () => void): ColumnDef<GameCategoryList>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("name") as string;
      return (
        <div className="flex space-x-2" title={title}>
          <span className="truncate font-medium">{title}</span>
        </div>
      );
    },
    enableHiding: false,
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
];