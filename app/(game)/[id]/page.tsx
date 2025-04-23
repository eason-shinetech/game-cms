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
  // 移除解构赋值，直接通过params.id访问
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);

  const visitor = useGameVistorStore((state: any) => state.visitor);

  useEffect(() => {
    getGame();
  }, []);

  const addHistory = async () => {
    if (!visitor) return;
    try {
      // 将id替换为params.id
      const res = await axios.post(`/api/game/${params.id}/history`, {
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
      // 将id替换为params.id
      const res = await axios.get(`/api/game/search/${params.id}`);
      const data = await res.data;
      // let newUrl = data.url;
      // if (data.url.includes("gamedistribution.com")) {
      //   newUrl = `https://embed.gamedistribution.com/?url=${data.url}&width=800&height=600&language=es&gdpr-tracking=1&gdpr-targeting=1&gdpr-third-party=0&gd_sdk_referrer_url=${process.env.NEXTAUTH_URL}/${params.id}`;
      // }
      // console.log("newUrl", process.env.NEXTAUTH_URL, newUrl);
      // setGame({ ...data, url: newUrl });
      setGame(data);
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
    <div className="flex flex-col items-center justify-between p-x-6 pt-2 gap-4">
      {game && (
        <>
          <div className="w-full h-[90vh] relative overflow-hidden md:min-h-[600px]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={game.url}
              onLoad={iframeLoaded}
              // sandbox="allow-same-origin allow-scripts"
              allowFullScreen
              allow="autoplay *; fullscreen *; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
            {!isFrameLoaded && (
              <div
                className={`absolute top-0 left-0 w-full h-full bg-slate-400/40 flex items-center justify-center gap-x-2 z-10`}
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
