"use client";

import { Game } from "@/models/game";
import { useGameVistorStore } from "@/store/game-visitor-store";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GameDetail = () => {
  const params = useParams();
  const { id } = params;
  const [game, setGame] = useState<Game | null>(null);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const router = useRouter();

  const visitor = useGameVistorStore((state: any) => state.visitor);

  useEffect(() => {
    getGame();
  }, []);

  const addHistory = async () => {
    console.log("addHistory", visitor);
    if (!visitor) return;
    try {
      const res = await axios.post(`/api/game/${id}/history`, {
        userId: visitor,
      });
      const data = await res.data;
      console.log(data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    addHistory();
  }, [visitor]);

  const getGame = async () => {
    try {
      const res = await axios.get(`/api/game/search/${id}`);
      const data = await res.data;
      let newUrl = data.url;
      if (data.url.includes("gamedistribution.com")) {
        newUrl = `https://embed.gamedistribution.com/?url=${data.url}&width=800&height=600&language=es&gdpr-tracking=1&gdpr-targeting=1&gdpr-third-party=0&gd_sdk_referrer_url=${process.env.NEXTAUTH_URL}/${id}`;
      }
      console.log("newUrl", process.env.NEXTAUTH_URL, newUrl);
      setGame({ ...data, url: newUrl });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
      router.push("/");
    }
  };

  const iframeLoaded = () => {
    setTimeout(() => {
      setIsFrameLoaded(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 gap-4">
      {game && (
        <>
          <div className="w-full relative overflow-hidden h-0 pt-[75%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={game.url}
              onLoad={iframeLoaded}
              // sandbox="allow-same-origin allow-scripts"
              allowFullScreen
            />
            {!isFrameLoaded && (
              <div
                className={`absolute w-full h-full top-0 left-0 bg-slate-400 flex items-center justify-center gap-x-2 z-10`}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            )}
          </div>
          <div className={`w-full flex flex-col gap-4`}>
            <h2 className="text-xl font-semibold text-slate-600">
              {game.title}
            </h2>
            <span className="text-sm text-slate-400">{game.instructions}</span>
            <p className="text-xs text-slate-400">{game.description}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default GameDetail;
