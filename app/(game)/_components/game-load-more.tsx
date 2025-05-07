"use client";

import { ChevronsDown, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import GameItem from "./game-item";

interface GameLoadMoreProps {
  data: { _id: string; title: string; titleUrl: string; thumb: string }[];
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          // 先清除可能存在的旧定时器
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }

          timerRef.current = setTimeout(() => {
            // 添加二次状态检查
            if (hasMore && !isLoading) {
              onLoadMore(currentPage + 1);
            }
            timerRef.current = null;
          }, 500);
        }
      },
      { threshold: 0.8 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentPage, hasMore, isLoading, onLoadMore]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-4 gap-4 space-y-4 h-full overflow-y-auto">
      {data.map((item, index) => (
        <GameItem key={index} {...item} />
      ))}

      {/* 滚动触发元素 */}
      <div
        ref={observerRef}
        className="col-span-full h-[60px] flex items-center justify-center gap-2"
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
