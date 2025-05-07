"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import GameList from "../game-import/_components/game-list";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";

const FetchUrlPage = () => {
  const [from, setFrom] = useState("monetize");
  const [platform, setPlatform] = useState("mobile");
  const [url, setUrl] = useState("");

  const [data, setData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [items, setItems] = useState<
    { title: string; description: string; thumb: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHandling, setIsHandling] = useState(false);
  //一次处理20条数据
  const pageSize = 10;
  const timer = useRef<NodeJS.Timeout>(null);

  const fetchData = async () => {
    if (!url || !from) {
      toast.error("Please enter a url and from!");
      return;
    }
    try {
      setIsHandling(true);
      const res = await axios.get(url);
      const data = res.data;
      if (data.length === 0) {
        toast.error("No data found");
        return;
      }
      setData(data);
      toast.success("Fetch data successfully");
    } catch (error) {
      console.error(error);
      toast.error("Fetch data failed");
    } finally {
      setIsHandling(false);
    }
  };

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
        title: item?.title,
        description: item?.description,
        thumb: item?.thumb,
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
      setIsHandling(true);
      const size = 500;
      const start = index * size;
      const end =
        (index + 1) * size > data.length ? data.length : (index + 1) * size;
      const items = data.slice(start, end);
      if (items.length === 0) {
        setIsHandling(false);
        if (timer.current) {
          clearTimeout(timer.current);
        }
        console.log("import data successfully", index);
        toast.success("Import data successfully");
        setData([]);
        setProgress(0);
        return;
      }
      items.forEach((game) => {
        game.platform = platform;
        game.popularity = '';
        game.from = from;
      });

      await axios.post("/api/game/fetch", items);
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
    <div className="flex flex-col p-10 gap-6">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="url">Url</Label>
        <span className="text-xs text-slate-400">
          https://gamemonetize.com/feed.php?format=0&page=1
        </span>
        <Input
          type="url"
          id="url"
          placeholder="Enter a url"
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="from">From</Label>
        <Input
          type="from"
          id="from"
          value={from}
          placeholder="monetize"
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="from">Platform</Label>
        <Select onValueChange={setPlatform} value={platform}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select a Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html5">Html5</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Button
          type="button"
          onClick={fetchData}
          disabled={isHandling}
          hidden={data.length > 0}
        >
          {isHandling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Fetch
        </Button>
        <Button
          type="button"
          onClick={importData}
          disabled={isHandling}
          hidden={data.length === 0}
        >
          {isHandling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Import {data.length} items
        </Button>
      </div>
      {data && data.length > 0 && (
        <div className="w-full md:w-[800px] flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Progress value={progress} />
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

export default FetchUrlPage;
