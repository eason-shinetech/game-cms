"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import GameLoadMore from "./game-load-more";

const GameList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 24;
  const [games, setGames] = useState<
    { _id: string; title: string; thumb: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";
  const title = searchParams.get("title") || "";
  const getGames = async () => {
    try {
      setIsLoading(true);
      let url = `/api/game/search?page=${page}&pageSize=${pageSize}`;
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }
      if (title) {
        url += `&title=${title}`;
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
    getGames();
  }, [page]);

  useEffect(() => {
    setGames([]);
    setPage(1);
  }, [categoryId, title]);

  const onLoadMore = (page: number) => {
    setPage(page);
  };

  return (
    <>
      <div className="w-full shadow-sm">
        <GameLoadMore
          data={games}
          currentPage={page}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={onLoadMore}
        />
      </div>
      {games.length === 0 && !isLoading && (
        <div className="w-full h-[100px] flex items-center justify-center text-center text-slate-400 text-sm shadow-sm">
          No Games Found
        </div>
      )}
    </>
  );
};

export default GameList;
