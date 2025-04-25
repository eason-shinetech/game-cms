"use client";

import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import StatisticsItem from "./_components/statistics-item";

const AdminPage = () => {
  const [data, setData] = useState<{
    gameCount: number;
    publishedGameCount: number;
    playerCount: number;
    todayPlayerCount: number;
  } | null>(null);

  const getData = async () => {
    const res = await axios.get("/api/game/statistics");
    const data = res.data;
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-full h-full">
      <div className="flex gap-10 p-8">
        <StatisticsItem
          title={"Today Player"}
          value={`${data?.todayPlayerCount || 0}`}
        />
        <StatisticsItem
          title={"Total Player"}
          value={`${data?.playerCount || 0}`}
        />
        <StatisticsItem
          title={"Games"}
          value={`${data?.publishedGameCount || 0} / ${data?.gameCount || 0}`}
        />
      </div>
    </div>
  );
};

export default AdminPage;
