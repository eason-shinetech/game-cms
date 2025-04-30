"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      className="relative flex items-center justify-center cursor-pointer shadow-sm"
      onMouseEnter={() => setHoverId(_id)}
      onTouchStart={() => setHoverId(_id)}
      onMouseLeave={() => setHoverId(null)}
      onTouchCancel={() => setHoverId(null)}
      onTouchEnd={() => setHoverId(null)}
      onClick={() => onClick(titleUrl)}
    >
      <Image
        src={thumb}
        alt={title}
        width={512}
        height={512}
        priority={true} //预加载
      />
      {hoverId === _id && (
        <div
          className="absolute w-full bottom-0 left-0 text-xs p-2 text-slate-100 bg-gray-400 truncate"
          title={title}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export default GameItem;
