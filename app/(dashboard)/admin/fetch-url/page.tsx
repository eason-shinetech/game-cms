"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

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
import dayjs from "dayjs";
import { CategoryMapping } from "@/models/game-category";
import GameList from "../_components/game-list";
import { Main } from "../_components/main";
import { HeaderContainer } from "../_components/header-container";
import FetchUrlHeader from "./_components/fetch-url-header";

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
  const [isFetching, setIsFetching] = useState(false);
  const [isImporting, setImporting] = useState(false);
  //一次处理20条数据
  const pageSize = 10;
  const timer = useRef<NodeJS.Timeout>(null);

  const fetchTimer = useRef<NodeJS.Timeout>(null);

  //循环获取数据
  const fetchData = async () => {
    if (!url || !from) {
      toast.error("Please enter a url and from!");
      return;
    }
    try {
      setData([]);
      await fetchFromUrl(
        1,
        [],
        ["gamepix", "gamedistribution"].includes(from) ? 1000 : 13000
      );
    } catch (error) {
      console.error(error);
      toast.error("Fetch data failed");
    }
  };

  const fetchFromUrl = async (page: number, games: any[], time: number) => {
    try {
      setIsFetching(true);
      let res, fetchData;
      if (from === "gamedistribution") {
        const params = {
          operationName: "GetGamesSearched",
          query:
            'fragment CoreGame on SearchHit {\n  objectID\n  title\n description\n  instruction\n width\n height\n mobile\n categories\n tags\n mobileMode\n company\n  visible\n  exclusiveGame\n assets {\n    name\n    __typename\n  }\n  lastPublishedAt\n  sortScore\n  __typename\n}\n\nquery GetGamesSearched($id: String! = "", $perPage: Int! = 0, $page: Int! = 0, $search: String! = "", $UIfilter: UIFilterInput! = {}, $filters: GameSearchFiltersFlat! = {}, $sortBy: KnownOrder, $sortByGeneric: [String!], $sortByCountryPerf: SortByCountryPerf! = {}, $sortByGenericWithDirection: [SortByGenericWithDirection!], $sortByScore: SortByScore) {\n  gamesSearched(\n    input: {collectionObjectId: $id, hitsPerPage: $perPage, page: $page, search: $search, UIfilter: $UIfilter, filters: $filters, sortBy: $sortBy, sortByCountryPerf: $sortByCountryPerf, sortByGeneric: $sortByGeneric, sortByGenericWithDirection: $sortByGenericWithDirection, sortByScore: $sortByScore}\n  ) {\n    hitsPerPage\n    nbHits\n    nbPages\n    page\n    hits {\n      ...CoreGame\n   __typename\n    }\n    filters {\n      title\n      key\n      type\n      values\n      __typename\n    }\n    __typename\n  }\n}',
          variables: {
            UIfilter: {
              mobile_ready: [],
            },
            filters: {},
            id: "",
            page: page - 1,
            perPage: 400,
            search: "",
            sortByGenericWithDirection: [
              {
                field: "publishedAt",
                direction: "DESC",
              },
            ],
          },
        };
        res = await axios.post(url, params);
        fetchData = res.data.data?.gamesSearched?.hits || [];
      } else {
        const fetchUrl = `${url}&page=${page}`;
        res = await axios.get(fetchUrl);
        fetchData = res.data;
      }
      if (!res) {
        toast.error("Fetch data failed");
        setIsFetching(false);
        if (fetchTimer.current) {
          clearTimeout(fetchTimer.current);
          fetchTimer.current = null;
        }
        return;
      }
      console.log("fetchFromUrl:", time, fetchData.length, games.length);
      if (fetchData.length === 0) {
        setIsFetching(false);
        if (fetchTimer.current) {
          console.log("clearTimeout fetchTimer");
          clearTimeout(fetchTimer.current);
          fetchTimer.current = null;
        }
        if (games.length > 0) {
          setData(games);
        }
        return;
      }
      //如果是monetize，直接返回数据
      let currentGames = fetchData;
      if (from === "gamepix") {
        const items = fetchData.items;
        currentGames = convertGamepixData(items);
      } else if (from === "gamedistribution") {
        currentGames = convertDistributionData(fetchData);
      }
      games.push(...currentGames);
      if (!fetchTimer.current) {
      }
      fetchTimer.current = setTimeout(async () => {
        await fetchFromUrl(page + 1, games, time);
      }, time);
    } catch (error: any) {
      if (
        error?.response?.data?.message === "Page number request out of bound"
      ) {
        setIsFetching(false);
        if (fetchTimer.current) {
          clearTimeout(fetchTimer.current);
          fetchTimer.current = null;
        }
        if (games.length > 0) {
          const uniqueGames = games.filter(
            (game, index, self) =>
              index === self.findIndex((g) => g.title === game.title)
          );
          console.log("uniqueGames:", games.length, uniqueGames.length);
          setData(uniqueGames);
        }
      } else {
        console.error(error);
        toast.error("Fetch data failed");
        setIsFetching(false);
        if (fetchTimer.current) {
          clearTimeout(fetchTimer.current);
          fetchTimer.current = null;
        }
      }
    }
  };

  const onLoadMore = (page: number) => {
    setCurrentPage(page);
    getPageData(page);
  };

  //#region Gamepix
  const convertGamepixData = (data: any[]) => {
    if (data.length === 0 || from === "monetize") return data;
    const newData = data.map((item: any) => {
      const image = item?.image;
      const banner = item?.banner_image;
      return {
        ...item,
        title: item?.title,
        // titleUrl: item?.namespace,
        description: item?.description,
        thumb: image,
        bannerImage: banner,
        category: getCategory(item),
        tags: "",
        platform: "mobile",
        popularity: getPopularity(item),
        from: "gamepix",
      };
    });
    return newData;
  };

  const getPopularity = (item: any) => {
    if (from === "monetize") {
      return item?.popularity;
    }
    if (dayjs(item.date_modified).year() === dayjs().year()) {
      return "newest";
    }
    if (
      item.quality_score > 0.8 &&
      dayjs().year() - dayjs(item.date_modified).year() <= 1
    ) {
      return "hotgames";
    }
    if (item.quality_score > 0.9) {
      return "bestgames";
    }
    return "";
  };

  const getCategory = (item: any) => {
    if (from === "monetize") {
      return item?.category;
    }
    const category = item?.category;
    const current = CategoryMapping.find((item) =>
      item.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
    return current?.name || "Hypercasual";
  };
  //#endregion

  const convertDistributionData = (data: any[]) => {
    if (data.length === 0 || from === "monetize") return data;
    const newData = data.map((item: any) => {
      const image = (item?.assets as any[])?.find(
        (a) => a.name.indexOf("512x384") > -1
      )?.name;
      if (!image) {
        console.log(
          "convertDistributionData: no image",
          item?.title,
          item?.assets
        );
      }
      return {
        id: item?.objectID,
        title: item?.title,
        description: item?.description,
        instructions: item?.instructions,
        url: `https://html5.gamedistribution.com/${item?.objectID}`,
        thumb: `https://img.gamedistribution.com/${image}`,
        bannerImage: `https://img.gamedistribution.com/${image}`,
        width: item?.width,
        height: item?.height,
        category: item?.categories?.join(","),
        tags: item?.tags?.join(","),
        platform:
          item?.mobile?.includes("ForIOS") ||
          item?.mobile?.includes("ForAndroid")
            ? "mobile"
            : "html5",
        popularity: "",
        from: from,
      };
    });
    return newData;
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
      setImporting(true);
      const size = 3000;
      const start = index * size;
      const end =
        (index + 1) * size > data.length ? data.length : (index + 1) * size;
      const items = data.slice(start, end);
      if (items.length === 0) {
        setImporting(false);
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
        console.log("import data successfully", index);
        toast.success("Import data successfully");
        setProgress(0);
        return;
      }
      items.forEach((game: any) => {
        game.platform = platform;
        game.popularity = game.popularity || "";
        game.from = from;
      });

      await axios.post("/api/game/fetch-url", items);
      //Go on
      const progress = (end / data.length) * 100;
      setProgress(progress);

      timer.current = setTimeout(async () => {
        await saveData(index + 1);
      }, 200);
    } catch (error) {
      setImporting(false);
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      console.error("Error saving data:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!url || !from) return;
    fetchData();
  }, [from, url]);

  return (
    <Main fixed>
      <HeaderContainer>
        <FetchUrlHeader
          isFetching={isFetching}
          onFetch={(url, from, platform) => {
            setUrl(url);
            setFrom(from);
            setPlatform(platform);
          }}
          isImportDisabled={data.length === 0 || isImporting}
          isImporting={isImporting}
          onImport={importData}
          length={data.length}
        />
      </HeaderContainer>
      <div className="flex flex-col gap-4">
        {isImporting && (
          <div className="flex items-center justify-between gap-2">
            <Progress value={progress} />
          </div>
        )}
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
    </Main>
  );
};

export default FetchUrlPage;
