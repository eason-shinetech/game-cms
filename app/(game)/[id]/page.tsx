"use client";

import { Button } from "@/components/ui/button";
import { Game } from "@/models/game";
import { useGameVistorStore } from "@/store/game-visitor-store";
import axios from "axios";
import { FullscreenIcon, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// 在文件顶部添加类型声明
declare global {
  interface ScreenOrientation {
    lock(orientation: string): Promise<void>;
  }
}

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
      let newUrl = data.url;
      if (data.url.includes("gamedistribution.com")) {
        newUrl = `https://embed.gamedistribution.com/?url=${data.url}&width=800&height=600&language=es&gdpr-tracking=1&gdpr-targeting=1&gdpr-third-party=0&gd_sdk_referrer_url=${process.env.NEXTAUTH_URL}/${params.id}`;
      }
      console.log("newUrl", process.env.NEXTAUTH_URL, newUrl);
      setGame({ ...data, url: newUrl });
      // setGame(data);
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

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 横屏切换逻辑
  const handleFullscreen = async () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      await iframe.requestFullscreen();

      // 增强设备支持检测
      const isOrientationLockSupported = () => {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        return isMobile && isPortrait && screen.orientation?.lock;
      };

      if (isOrientationLockSupported()) {
        await screen.orientation.lock("landscape").catch(() => null);
      }

      // document.documentElement.classList.add("landscape");

    } catch (err) {
      toast.error(`Full Screen Error: ${(err as Error).message}`);
    }
  };

  // 修改全屏事件处理逻辑
  useEffect(() => {
    if (!isFrameLoaded) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const fullscreenHandler = () => {
      console.log("[fullscreenchange]", document.fullscreenElement);
      if (!document.fullscreenElement) {
        console.log("[执行退出清理]");
        document.documentElement.classList.remove("landscape");
        screen.orientation?.unlock();
        // 强制重置iframe尺寸
        iframe.style.removeProperty("transform");
      }
    };

    // 仅在document上监听事件
    document.addEventListener("fullscreenchange", fullscreenHandler);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenHandler);
    };
  }, [isFrameLoaded]);

  return (
    <div className="flex flex-col items-center justify-between p-x-6 pt-2 gap-4">
      {game && (
        <>
          <div className="w-full h-[80vh] relative overflow-hidden md:w-[80vw] md:min-h-[600px]">
            <iframe
              ref={iframeRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none" // 添加 pointer-events-none
              src={game.url}
              onLoad={iframeLoaded}
              allowFullScreen={true}
              loading="eager"
            />
            <Button
              variant="ghost"
              onClick={handleFullscreen}
              className="fixed md:hidden landscape:hidden top-20 right-4 z-[9999]"
              style={{ transform: "translateZ(0)" }} // 强制创建新层叠上下文
            >
              <FullscreenIcon className="!w-6 !h-6 text-slate-800" />
            </Button>
            {!isFrameLoaded && (
              <div
                className={`absolute top-0 left-0 w-full h-full bg-slate-400 flex items-center justify-center gap-x-2 z-10`}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            )}
          </div>
          <div className={`w-full flex flex-col gap-4 px-2 pb-4`}>
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
