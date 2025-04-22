"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GameBanner = () => {
  const router = useRouter();
  const [banners, setBanners] = useState<{ id: string; bannerImage: string }[]>(
    []
  );

  const getBanners = async () => {
    try {
      const res = await axios.get("/api/game/config");
      setBanners(res.data?.banners || []);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

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
          onClick={() => handleClick(banner.id)}
        >
          <Image
            key={`image-${index}`}
            src={banner.bannerImage}
            alt={banner.id}
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
