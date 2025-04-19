"use client";

import { Button } from "@/components/ui/button";
import UploadFile from "./_components/upload-file";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import GameList from "./_components/game-list";
import toast from "react-hot-toast";
import { GameDistributionResult } from "@/models/game";
import axios from "axios";

const GameImport = () => {
  const [data, setData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [items, setItems] = useState<
    { title: string; description: string; thumb: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  //一次处理20条数据
  const pageSize = 10;
  const timer = useRef<NodeJS.Timeout>(null);

  const onLoadMore = (page: number) => {
    setCurrentPage(page);
    getPageData(page);
  };

  const getPageData = (page: number) => {
    setIsLoading(true);
    const take = pageSize;
    const allGames = [...data];
    const games = allGames.slice(0, take * page);
    const newItems = games.map((item) => {
      return {
        title: item?.Title,
        description: item?.Description,
        thumb:
          item?.Assets?.find((a: string) => a.includes("512x512")) ||
          item?.Assets[0],
      };
    });
    setItems(newItems);
    setHasMore(allGames.length > take * page);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      setItems([]);
      return;
    }
    getPageData(1);
  }, [data]);

  const importData = async () => {
    try {
      let index = 0;
      await saveData(index);
      ++index;
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error("Something went wrong");
    }
  };

  const saveData = async (index: number) => {
    try {
      setIsImporting(true);
      const size = 3000;
      const start = index * size;
      const end =
        (index + 1) * size > data.length ? data.length : (index + 1) * size;
      const items = data.slice(start, end);
      if (items.length === 0) {
        setIsImporting(false);
        if (timer.current) {
          clearTimeout(timer.current);
        }
        console.log("import data successfully", index);
        toast.success("Import data successfully");
        return;
      }
      const games: GameDistributionResult[] = items.map((item) => {
        return {
          id: item.Id,
          title: item.Title,
          description: item.Description,
          thumb:
            item.Assets.find((a: string) => a.includes("512x512")) ||
            item.Assets[0],
          instructions: item.Instructions,
          url: item["Game URL"],
          bannerImage:
            item.Assets.find((a: string) => a.includes("1280x550")) ||
            item.Assets.find((a: string) => a.includes("1280x720")),
          images: item.Assets,
          width: item.Width,
          height: item.Height,
          categorys: item.Genres,
          tags: item.Tags,
        };
      });
      await axios.post("/api/game/import", games);
      //Go on
      const progress = (end / data.length) * 100;
      setProgress(progress);

      timer.current = setTimeout(async () => {
        await saveData(index + 1);
      }, 200);
    } catch (error) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      console.error("Error saving data:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex flex-col p-6 gap-y-4 items-center justify-between text-slate-500">
      <h1 className="text-2xl ">GameDistribution</h1>
      <hr className="w-full text-slate-500/80" />
      <div className="w-full md:w-[800px] h-80 flex justify-center">
        <UploadFile setData={setData} />
      </div>
      <div className="w-full md:w-[800px] flex justify-between">
        <Button
          disabled={data?.length === 0 || isImporting}
          className="w-60 m-auto"
          onClick={importData}
        >
          Import Data
        </Button>
      </div>
      {data && data.length > 0 && (
        <div className="w-full md:w-[800px] flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Progress value={progress} />
            {/* <span className="text-xs w-[100px] text-slate-500">{`${importedCount} / ${data.length}`}</span> */}
          </div>
          <div className="w-full p-4 border border-slate-500/20 rounded-md">
            <GameList
              data={items}
              currentPage={currentPage}
              hasMore={hasMore}
              isLoading={isLoading}
              onLoadMore={onLoadMore}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameImport;
