"use client";
import { ColumnSort } from "@tanstack/react-table";
import { GameList, getColumns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { SearchInput } from "@/components/commons/search-input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Game } from "@/models/game";
import { Loader2 } from "lucide-react";
import { DataTablePagination } from "./_components/data-table-pagination";
import { useLoadingStore } from "@/store/loading-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ListPage = () => {
  const [data, setData] = React.useState<GameList[]>([]);
  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);
  const [tags, setTags] = React.useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);
  const [keyword, setKeyword] = React.useState("");
  const [sort, setSort] = React.useState<ColumnSort | null>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPublishAll, setIsPublishAll] = React.useState(false);
  const setGlobalIsLoading = useLoadingStore(
    (state: any) => state.setIsLoading
  );

  const [status, setStatus] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");

  const [refreshKey, setRefreshKey] = useState(0);
  const columns = useMemo(
    () => getColumns(() => setRefreshKey((k) => k + 1)),
    []
  );

  const getCategories = async () => {
    try {
      const res = await axios.get("/api/game/category");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const getTags = async () => {
    try {
      const res = await axios.get("/api/game/tag");
      setTags(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const getGameData = async () => {
    try {
      setIsLoading(true);
      let url = `/api/game/list?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;
      if (sort) {
        url += `&sort=${sort.id}&order=${sort.desc}`;
      }
      if (status && status !== "all") {
        // 添加条件判断
        url += `&status=${status}`;
      }
      if (categoryId && categoryId !== "all") {
        // 添加条件判断
        url += `&categoryId=${categoryId}`;
      }
      const res = await axios.get(url);
      const total = res.data.total;
      setTotal(total);
      const data = res.data.data.map((game: Game) => ({
        ...game,
        from: game.fetchFrom,
        categories:
          categories
            .filter((c) => game.categoryIds.includes(c._id))
            ?.map((c) => c.name) || [],
        tags:
          tags.filter((t) => game.tagIds.includes(t._id))?.map((c) => c.name) ||
          [],
      }));
      setData(data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGameData();
  }, [refreshKey]);

  useEffect(() => {
    Promise.all([getCategories(), getTags()]).then(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    setGlobalIsLoading(isLoading || isPublishAll);
  }, [isLoading, isPublishAll]);

  const sortChanged = (sorting: ColumnSort) => {
    setSort(sorting);
  };

  const publishAll = async () => {
    try {
      setIsPublishAll(true);
      await axios.post(`/api/game/publish/all`);
      toast.success(`All games published successfully!`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsPublishAll(false);
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    getGameData();
  }, [keyword, sort, page, pageSize, isMounted, status, categoryId]);

  useEffect(() => {
    setPage(1);
  }, [keyword]);
  return (
    <div className="p-10">
      <div className="flex items-center gap-x-4 my-4">
        <SearchInput setKeyword={setKeyword} />
        {/* Filter by status */}
        <Select onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* 将空值改为 'all' */}
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        {/* Filter by category */}
        <Select onValueChange={setCategoryId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem> {/* 将空值改为 'all' */}
            {categories.map((category) => {
              return (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button disabled={isLoading} onClick={publishAll}>
          {isPublishAll && (
            <Loader2 className="w-4 h-4 animate-spin text-secondary" />
          )}{" "}
          Publish All
        </Button>
      </div>
      <DataTable columns={columns} data={data} sortChanged={sortChanged} />
      <div className="mt-4 flex justify-end">
        <DataTablePagination
          totalCount={total}
          currentPage={page}
          pageSize={pageSize}
          isShowSelect={false}
          selectedRowsCount={0}
          onPageChange={(page) => {
            if (page <= 1) page = 1;
            if (page >= total) page = total;
            setPage(page);
          }}
          onPageSizeChange={(pageSize) => {
            setPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
};

export default ListPage;
