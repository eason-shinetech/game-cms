"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { useRouter } from "next/navigation";
//每日推荐：4个.
//TODO: 通过管理端配置
const getBanners = () => {
  return [
    {
      _id: "67ffc54b9a1b34c3624c36cd",
      thumb:
        "https://img.gamedistribution.com/7699b0229f2d4ce48c179f960b962ade-1280x550.jpg",
    },
    {
      _id: "67ffc54b9a1b34c3624c36d4",
      thumb:
        "https://img.gamedistribution.com/325e890fbf644ba49b067bcdc01d5c8e-1280x550.jpeg",
    },
    {
      _id: "67ffc54b9a1b34c3624c36dd",
      thumb:
        "https://img.gamedistribution.com/8bd204b4425b41bb80c1f68ea089e2b7-1280x550.jpg",
    },
    {
      _id: "67ffc54b9a1b34c3624c36ed",
      thumb:
        "https://img.gamedistribution.com/9db0d3b51d19496d879b5895e76a8218-1280x550.jpg",
    },
  ];
};

const GameBanner = () => {
  const banners = getBanners();
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/${id}`);
  };
  return (
    <div className="hidden w-full md:grid grid-rows-1 grid-cols-4 gap-4 mt-4 cursor-pointer">
      {banners.map((banner, index) => (
        <AspectRatio
          key={index}
          ratio={128 / 55}
          className="bg-muted rounded-md"
          onClick={() => handleClick(banner._id)}
        >
          <Image
            key={`image-${index}`}
            src={banner.thumb}
            alt={banner._id}
            width={640}
            height={275}
            className="h-full w-full rounded-md object-contain shadow-sm"
          />
        </AspectRatio>
      ))}
    </div>
  );
};

export default GameBanner;
