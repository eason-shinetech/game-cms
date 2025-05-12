"use client";

import { useEffect, useRef } from "react";
import GameItem from "./game-item";
interface GameListProps {
  data: { title: string; description: string; thumb: string }[];
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: (page: number) => void;
}

const GameList = ({
  data,
  currentPage,
  hasMore,
  isLoading,
  onLoadMore,
}: GameListProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore(currentPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [currentPage, hasMore, isLoading, onLoadMore]);

  return (
    <div className="space-y-4 min-h-[400px] overflow-y-auto">
      {data.map((item, index) => (
        <GameItem key={index} {...item} />
      ))}

      {/* 滚动触发元素 */}
      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {isLoading ? (
          <span className="text-gray-500">Loading...</span>
        ) : hasMore ? (
          <span className="text-gray-500">Release load more</span>
        ) : (
          <span className="text-gray-400">No more data</span>
        )}
      </div>
    </div>
  );
};

export default GameList;
