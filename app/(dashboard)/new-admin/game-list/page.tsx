"use client";
import { ColumnSort } from "@tanstack/react-table";
import { getColumns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { SearchInput } from "@/components/commons/search-input";
import { Button } from "@/components/ui/button";
import React, { use, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Game } from "@/models/game";
import {
  CheckCircle2Icon,
  Loader2,
  SearchIcon,
  SquareMousePointerIcon,
  XIcon,
} from "lucide-react";
import { DataTablePagination } from "./_components/data-table-pagination";
import { useLoadingStore } from "@/store/loading-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameConfig } from "@/models/game-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GameList } from "@/data/game-schema";
import { HeaderContainer } from "../_components/header-container";
import { DataTableFacetedFilter } from "./_components/data-table-faceted-filter";
import { CategoryMapping } from "@/models/game-category";
import { cn } from "@/lib/utils";
import { Main } from "../_components/main";

const ListPage = () => {
  const [data, setData] = React.useState<GameList[]>([]);
  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
      icon: React.ComponentType<{ className?: string }>;
    }[]
  >([]);

  const [gameConfig, setGameConfig] = React.useState<GameConfig | null>(null);

  const [keyword, setKeyword] = React.useState("");
  const [sort, setSort] = React.useState<ColumnSort | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPublishAll, setIsPublishAll] = React.useState(false);
  const setGlobalIsLoading = useLoadingStore(
    (state: any) => state.setIsLoading
  );

  const [status, setStatus] = React.useState<string[]>([]);
  const [categoryNames, setCategoryNames] = React.useState<string[]>([]);
  const [searchBanner, setSearchBanner] = React.useState("");

  const [refreshKey, setRefreshKey] = useState(0);
  const columns = useMemo(
    () => getColumns(() => setRefreshKey((k) => k + 1)),
    []
  );

  const statusOptions = [
    {
      label: "Draft",
      value: "draft",
      icon: CheckCircle2Icon,
    },
    {
      label: "Published",
      value: "published",
      icon: ({ className }: { className?: string }) => (
        <CheckCircle2Icon className={cn(className, "text-green-400")} />
      ),
    },
  ];

  const getCategories = async () => {
    try {
      const res = await axios.get("/api/game/category");
      const data = res.data.map((category: any) => {
        const mapping = CategoryMapping.find((m) => m.name === category.name);
        return {
          _id: category._id,
          name: category.name,
          icon: mapping?.icon,
        };
      });
      setCategories(data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const getGameConfig = async () => {
    try {
      const res = await axios.get("/api/game/config");
      setGameConfig(res.data);
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
      if (status.length === 1) {
        // 添加条件判断
        url += `&status=${status[0]}`;
      }
      if (categoryNames.length > 0) {
        // 添加条件判断
        url += `&categoryName=${categoryNames.join(",")}`;
      }
      if (searchBanner === "banner") {
        // 添加条件判断
        url += `&isOnlyBanner=true`;
      } else if (searchBanner === "selected") {
        url += `&searchSelectedBanner=true`;
      }
      const res = await axios.get(url);
      const total = res.data.total;
      setTotal(total);
      const data = res.data.data.map((game: Game) => ({
        ...game,
        from: game.fetchFrom,
        isSetBanner: gameConfig?.banners?.length
          ? gameConfig.banners.some((b) => b.id === game._id)
          : false,
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
    setIsMounted(false);
    getGameConfig().then(() => {
      setIsMounted(true);
      getGameData();
    });
  }, [refreshKey]);

  useEffect(() => {
    Promise.all([getCategories(), getGameConfig()]).then(() => {
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
  }, [isMounted, page, pageSize]);

  const search = async () => {
    getGameData();
  };

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  //#region Actions
  const publishSelected = async () => {
    try {
      if (selectedIds.length === 0) return;
      await axios.post(`/api/game/selected/publish`, selectedIds);
      toast.success(`Update successfully!`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const unpublishSelected = async () => {
    try {
      if (selectedIds.length === 0) return;
      await axios.post(`/api/game/selected/unpublish`, selectedIds);
      toast.success(`Update successfully!`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const addBannerSelected = async () => {
    try {
      if (selectedIds.length === 0) return;
      await axios.post(`/api/game/selected/banner`, selectedIds);
      toast.success(`Update successfully!`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const removeBannerSelected = async () => {
    try {
      if (selectedIds.length === 0) return;
      await axios.post(`/api/game/selected/remove-banner`, selectedIds);
      toast.success(`Update successfully!`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const addClickSelected = async () => {
    try {
      if (selectedIds.length === 0) return;
      await axios.post(`/api/game/selected/click`, selectedIds);
      toast.success(`Update successfully!`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };
  //#endregion

  return (
    <Main fixed>
      <HeaderContainer>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Games</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your games!
          </p>
        </div>
      </HeaderContainer>
      <div className="flex items-center gap-x-4 my-4">
        <SearchInput setKeyword={setKeyword} />
        {/* Filter by status */}
        <DataTableFacetedFilter
          title="Status"
          options={statusOptions}
          value={status}
          onChange={(val) => {
            setPage(1);
            setStatus(val);
          }}
        />
        {/* Filter by category */}
        <DataTableFacetedFilter
          title="Categories"
          options={categories.map((item) => ({
            label: item.name,
            value: item.name,
            icon: item.icon,
          }))}
          value={categoryNames}
          onChange={(val) => {
            setPage(1);
            setCategoryNames(val);
          }}
        />
        {/* Filter by banner */}
        <Select
          value={searchBanner}
          onValueChange={(val) => {
            setPage(1);
            setSearchBanner(val);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search for banner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banner">Has Banner</SelectItem>
            <SelectItem value="selected">Selected Banner</SelectItem>
          </SelectContent>
        </Select>

        {(status.length > 0 ||
          categoryNames.length > 0 ||
          searchBanner !== "") && (
          <Button
            variant="outline"
            onClick={() => {
              setStatus([]);
              setCategoryNames([]);
              setSearchBanner("");
              setPage(1);
            }}
          >
            <XIcon className="w-4 h-4 text-secondary-foreground" /> Reset
          </Button>
        )}

        <Button disabled={isLoading} onClick={search}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-secondary" />
          ) : (
            <SearchIcon className="w-4 h-4 text-secondary" />
          )}{" "}
          Search
        </Button>

        <Button disabled={isLoading} onClick={publishAll}>
          {isPublishAll ? (
            <Loader2 className="w-4 h-4 animate-spin text-secondary" />
          ) : (
            <SquareMousePointerIcon className="w-4 h-4 text-secondary" />
          )}{" "}
          Publish All
        </Button>

        {selectedIds?.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={publishSelected}>
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={unpublishSelected}>
                Unpublish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={addBannerSelected}>
                Set Banner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={removeBannerSelected}>
                Remove Banner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={addClickSelected}>
                Add Clicks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <DataTable
        columns={columns}
        data={data}
        sortChanged={sortChanged}
        onRowSelectionChange={setSelectedIds}
      />
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
    </Main>
  );
};

export default ListPage;
