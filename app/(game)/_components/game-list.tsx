"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import GameLoadMore from "./game-load-more";

const GameList = () => {
  const [page, setPage] = useState(0);
  const pageSize = 24;
  const [games, setGames] = useState<
    { _id: string; title: string; titleUrl: string; thumb: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const categoryName = searchParams.get("categoryName") || "";
  const title = searchParams.get("title") || "";
  const popularity = searchParams.get("popularity") || "";
  const getGamesByPageChange = async (page: number) => {
    try {
      setIsLoading(true);
      let url = `/api/game/search?page=${page}&pageSize=${pageSize}`;
      if (categoryName) {
        url += `&categoryName=${categoryName}`;
      }
      if (title) {
        url += `&title=${title}`;
      }
      if (popularity) {
        url += `&popularity=${popularity}`;
      }
      const res = await axios.get(url);
      const total = res.data.total;
      const data = res.data.data;
      setGames(games.concat(data));
      setHasMore(total > page * pageSize);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setGames([]);
    setPage(0);
    setHasMore(true);
  }, [categoryName, title, popularity]);

  const onLoadMore = (page: number) => {
    setPage(page);
    getGamesByPageChange(page);
  };

  return (
    <>
      <div className="w-full rounded-md shadow-sm">
        <GameLoadMore
          data={games}
          currentPage={page}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={onLoadMore}
        />
      </div>
      {games.length === 0 && !isLoading && !hasMore && (
        <div className="w-full h-[100px] flex items-center justify-center text-center text-slate-400 rounded-md text-sm shadow-sm">
          No Games Found
        </div>
      )}
    </>
  );
};

export default GameList;
