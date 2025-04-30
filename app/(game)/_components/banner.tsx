"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import BannerItem from "./banner-item";
import { Loader2 } from "lucide-react";

const GameBanner = () => {
  const [banners, setBanners] = useState<{ id: string; bannerImage: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const getBanners = async () => {
    try {
      setIsLoading(true);
      const response = await axios("/api/game/config");
      const data = await response.data;
      setBanners(data?.banners?.slice(0, 4) || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div className="hidden w-full md:grid grid-rows-1 grid-cols-4 gap-4 mt-4 cursor-pointer rounded-md">
      {isLoading && (
        <div className="col-span-full w-full h-[140px] flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-center text-slate-500">Loading...</span>
        </div>
      )}
      {banners.map((banner, index) => (
        <BannerItem
          key={index}
          id={banner.id.toString()}
          bannerImage={banner.bannerImage}
        />
      ))}
    </div>
  );
};

export default GameBanner;
