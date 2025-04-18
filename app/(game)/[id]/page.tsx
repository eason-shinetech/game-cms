"use client";

import { Game } from "@/models/game";
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
  useEffect(() => {
    getGame();
  }, []);

  const getGame = async () => {
    try {
      const res = await axios.get(`/api/game/search/${id}`);
      const data = await res.data;
      let newUrl = data.url;
      if (data.url.includes("gamedistribution.com")) {
        //&width=510&height=900&gd_sdk_referrer_url=https://www.example.com/games/game-path
        newUrl = `https://embed.gamedistribution.com/?url=${data.url}&width=${data.width}&height=${data.height}&language=es&gdpr-tracking=1&gdpr-targeting=1&gdpr-third-party=0&gd_sdk_referrer_url=${process.env.NEXTAUTH_URL}/${id}`;
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
          <div className="relative">
            <iframe
              src={game.url}
              width={`${game.width}`}
              height={`${game.height}`}
              id={game._id}
              onLoad={iframeLoaded}
              // sandbox="allow-same-origin allow-scripts"
              allowFullScreen
            />
            {!isFrameLoaded && (
              <div
                className={`absolute top-0 left-0 bg-slate-400 flex items-center justify-center gap-x-2 z-10`}
                style={{
                  width: `${game.width}px`,
                  height: `${game.height}px`,
                }}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            )}
          </div>
          <div
            className={`flex flex-col gap-4`}
            style={{
              width: `${game.width}px`,
            }}
          >
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
