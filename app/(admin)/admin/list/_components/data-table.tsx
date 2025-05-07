"use client";

import {
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sortChanged?: (sorting: ColumnSort) => void;
  onRowSelectionChange?: (selectedIds: string[]) => void; // 新增回调属性
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sortChanged,
  onRowSelectionChange, // 新增props
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === "function" 
        ? updater(rowSelection)
        : updater;
      setRowSelection(newSelection);
      
      // 触发外部回调，传递选中行的_id
      if (onRowSelectionChange) {
        const selectedIds = Object.keys(newSelection)
          .filter(key => newSelection[key])
          .map(key => (table.getRow(key).original as any)?._id); // 假设数据行有_id字段
        onRowSelectionChange(selectedIds.filter(Boolean) as string[]);
      }
    },
    onSortingChange: (updater) => {
      // 正确处理 Updater 类型（可能为函数或值）
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;

      setSorting(newSorting);
      if (sortChanged) {
        const [currentSort] = newSorting;
        if (currentSort) {
          sortChanged(currentSort);
        }
      }
    },
    enableMultiSort: false,
    manualSorting: true,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      minWidth: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.size,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      minWidth: cell.column.columnDef.size,
                      maxWidth: cell.column.columnDef.size,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
