"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface GameItemProps {
  _id: string;
  title: string;
  thumb: string;
}

const GameItem = ({ _id, title, thumb }: GameItemProps) => {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const router = useRouter();

  const onClick = async (id: string) => {
    try {
      axios.post(`/api/game/${id}/click`);
      router.push(`/${id}`);
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
      onClick={() => onClick(_id)}
    >
      <Image
        src={thumb}
        alt={title}
        width={512}
        height={512}
        priority={true} //预加载
        // loading="eager"
      />
      {hoverId === _id && (
        <div className="absolute bottom-0 left-0 text-xs p-1 text-slate-100 bg-gray-400">
          {title}
        </div>
      )}
    </div>
  );
};

export default GameItem;
