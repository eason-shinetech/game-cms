"use client";
import { GameHistory } from "@/models/history";
import { useGameVistorStore } from "@/store/game-visitor-store";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import GameItem from "../_components/game-item";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";

const HistoryPage = () => {
  const visitor = useGameVistorStore((state: any) => state.visitor);
  const [histories, setHistories] = useState<GameHistory[]>([]);
  const [todayHistories, setTodayHistories] = useState<GameHistory[]>([]);
  const [yesterdayHistories, setYesterdayHistories] = useState<GameHistory[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [oldHistories, setOldHistories] = useState<GameHistory[]>([]);

  const getHistories = useCallback(async () => {
    try {
      if (!visitor) {
        return;
      }
      setIsLoading(true);
      const res = await axios.get(`/api/game/history/${visitor}`);
      const data = res.data as GameHistory[];
      setHistories(data);
      const today = dayjs().format("YYYY-MM-DD");
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      console.log(data, today, yesterday);
      const todayData = data.filter(
        (history) => dayjs(history.date).format("YYYY-MM-DD") === today
      );
      setTodayHistories(todayData);
      const yesterdayData = data.filter(
        (history) => dayjs(history.date).format("YYYY-MM-DD") === yesterday
      );
      setYesterdayHistories(yesterdayData);
      const allOldData = data.filter(
        (history) =>
          dayjs(history.date).format("YYYY-MM-DD") !== today &&
          dayjs(history.date).format("YYYY-MM-DD") !== yesterday
      );
      const oldData = allOldData.filter(
        (history, index, self) =>
          index === self.findIndex((h) => h.gameId === history.gameId)
      );
      setOldHistories(oldData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get histories");
    } finally {
      setIsLoading(false);
    }
  }, [visitor]);

  useEffect(() => {
    getHistories();
  }, [getHistories]);

  return (
    <div className="flex flex-col gap-4 px-4 mt-8">
      {isLoading && (
        <div className="w-full h-[400px] flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-center text-slate-500">Loading...</span>
        </div>
      )}
      {histories.length === 0 && !isLoading && (
        <div className="w-full h-[100px] flex items-center justify-center text-slate-500">
          No data
        </div>
      )}
      {histories.length > 0 && (
        <>
          {todayHistories.length > 0 && (
            <div className="w-full flex flex-col justify-between">
              <span className="text-2xl text-slate-600 font-semibold">
                Today
              </span>
              <hr className="border border-slate-300 my-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 p-4 gap-4 space-y-4 h-full overflow-y-auto">
                {todayHistories.map((history) => (
                  <GameItem
                    key={history.gameId}
                    _id={history.gameId}
                    title={history.gameTitle}
                    titleUrl={history.gameTitleUrl}
                    thumb={history.gameThumb}
                  />
                ))}
              </div>
            </div>
          )}
          {yesterdayHistories.length > 0 && (
            <div className="w-full flex flex-col justify-between">
              <span className="text-2xl text-slate-600 font-semibold">
                Yesterday
              </span>
              <hr className="border border-slate-300 my-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 p-4 gap-4 space-y-4 h-full overflow-y-auto">
                {yesterdayHistories.map((history) => (
                  <GameItem
                    key={history.gameId}
                    _id={history.gameId}
                    title={history.gameTitle}
                    titleUrl={history.gameTitleUrl}
                    thumb={history.gameThumb}
                  />
                ))}
              </div>
            </div>
          )}
          {oldHistories.length > 0 && (
            <div className="w-full flex flex-col justify-between">
              <span className="text-2xl text-slate-600 font-semibold">
                History
              </span>
              <hr className="border border-slate-300 my-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 p-4 gap-4 space-y-4 h-full overflow-y-auto">
                {oldHistories.map((history) => (
                  <GameItem
                    key={history.gameId}
                    _id={history.gameId}
                    title={history.gameTitle}
                    titleUrl={history.gameTitleUrl}
                    thumb={history.gameThumb}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
