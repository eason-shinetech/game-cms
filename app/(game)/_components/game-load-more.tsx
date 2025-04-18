"use client";

import { ChevronsDown, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import GameItem from "./game-item";

interface GameLoadMoreProps {
  data: { _id: string; title: string; thumb: string }[];
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: (page: number) => void;
}

const GameLoadMore = ({
  data,
  currentPage,
  hasMore,
  isLoading,
  onLoadMore,
}: GameLoadMoreProps) => {
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
    <div className="grid gird-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 p-4 gap-4 space-y-4 h-full overflow-y-auto">
      {data.map((item, index) => (
        <GameItem key={index} {...item} />
      ))}

      {/* 滚动触发元素 */}
      <div
        ref={observerRef}
        className="col-span-full h-12 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
            <span className="text-slate-500">Loading...</span>
          </>
        ) : hasMore ? (
          <>
            <ChevronsDown className="w-4 h-4 text-slate-500 animate-bounce" />
            <span className="text-slate-500">Scroll and load more</span>
          </>
        ) : (
          <span className="text-slate-500">No more data</span>
        )}
      </div>
    </div>
  );
};

export default GameLoadMore;
