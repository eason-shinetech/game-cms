"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

interface GameItemProps {
  _id: string;
  title: string;
  titleUrl: string;
  thumb: string;
}

const GameItem = ({ _id, title, titleUrl, thumb }: GameItemProps) => {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  const onClick = async (titleUrl: string) => {
    try {
      axios.post(`/api/game/${titleUrl}/click`);
      router.push(`/${titleUrl}`);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <div
      className="relative h-fit flex items-center justify-center cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setHoverId(_id)}
      onTouchStart={() => setHoverId(_id)}
      onMouseLeave={() => setHoverId(null)}
      onTouchCancel={() => setHoverId(null)}
      onTouchEnd={() => setHoverId(null)}
      onClick={() => onClick(titleUrl)}
    >
      {/* 加载动画 */}
      {isLoading && (
        <img
          src="/loading.gif"
          alt="loading"
          className="absolute z-10 w-12 h-12"
          style={{ display: isLoading ? "block" : "none" }}
        />
      )}

      <Image
        ref={imageRef}
        src={thumb}
        alt={title}
        width={512}
        height={384}
        priority={true}
        quality={50}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
      {hoverId === _id && (
        <div
          className="text-xs md:text-sm absolute w-full bottom-0 left-0 p-2 text-slate-100 bg-gray-400 truncate"
          title={title}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export default GameItem;
