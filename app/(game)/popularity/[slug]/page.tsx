"use client";

import { Game } from "@/models/game";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PopularityPage = () => {
  const params = useParams();
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);

  const getPopularityGames = async () => {
    try {
      const res = await axios.get(`/api/game/popularity/${params.slug}`);
      const data = await res.data;
      setGames(data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    getPopularityGames();
  }, []);
  return <div>popularity</div>;
};

export default PopularityPage;
