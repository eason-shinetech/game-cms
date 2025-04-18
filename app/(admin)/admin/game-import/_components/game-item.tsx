"use client";

import Image from "next/image";

interface GameItemProps {
  title: string;
  description: string;
  thumb: string;
}

const GameItem = ({ title, description, thumb }: GameItemProps) => {
  return (
    <div className="flex items-center gap-4 shadow-sm rounded-md border border-slate-200/50 hover:bg-slate-50 p-4">
      <div className="p-2 relative w-[100px] h-[100px] rouned-md">
        <Image
          src={thumb}
          alt={title}
          width={100}
          height={100}
          sizes="(max-width: 768px) 100px, 100px"
          className="object-contain"
          priority={true}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="flex-1 text-sm text-slate-500">{description}</p>
      </div>
      <div>

      </div>
    </div>
  );
};

export default GameItem;
