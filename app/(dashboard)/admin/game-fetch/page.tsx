"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { GameMonetizeResult } from "@/models/game";
import { Main } from "../_components/main";
import { HeaderContainer } from "../_components/header-container";
import GameFetchHeader from "./_components/game-fetch-header";
import GameList from "../_components/game-list";

const GameFetchPage = () => {
  const [type, setType] = useState<string>("");
  const [popularity, setPopularity] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isImporting, setImporting] = useState(false);
  const [data, setData] = useState<GameMonetizeResult[]>([]);

  const getApiUrl = (type: string, popularity: string) => {
    if (!type || !popularity) {
      return null;
    }
    let baseUrl =
      "https://rss.gamemonetize.com/rssfeed.php?format=json&category=All&company=All&amount=All";
    if (type) {
      baseUrl += `&type=${type}`;
    }
    if (popularity) {
      baseUrl += `&popularity=${popularity}`;
    }
    return baseUrl;
  };

  const handleFetchGames = async (api: string | null) => {
    if (!api) {
      toast.error("Please select a type and popularity!");
      return;
    }
    try {
      setIsFetching(true);
      const res = await axios.get(api);
      const games = res.data;
      if (games.length === 0) {
        toast.error("No games found!");
        return;
      }
      setData(games);
      toast.success("Games fetched successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsFetching(false);
    }
  };

  const handleImportGames = async () => {
    if (!data || data.length === 0) {
      toast.error("No Game need to import!");
      return;
    }
    data.forEach((game) => {
      game.platform = type;
      game.popularity = popularity;
    });
    try {
      setImporting(true);
      const res = await axios.post(`/api/game/fetch`, data);
      console.log("handleImportGames:", res);
      toast.success("Games import successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setImporting(false);
    }
  };

  const [items, setItems] = useState<
    { title: string; description: string; thumb: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

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

  return (
    <Main fixed>
      <HeaderContainer>
        <GameFetchHeader
          isFetching={isFetching}
          onFetch={(type, Popularity) => {
            setType(type);
            setPopularity(Popularity);
            const api = getApiUrl(type, Popularity);
            handleFetchGames(api);
          }}
          isImportDisabled={data.length === 0 || isImporting}
          isImporting={isImporting}
          onImport={handleImportGames}
        />
      </HeaderContainer>
      <div className="flex flex-col gap-4">
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

export default GameFetchPage;
