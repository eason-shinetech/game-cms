"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import BannerItem from "../banner-item";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const MobileBanner = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [banners, setBanners] = useState<{ id: string; bannerImage: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const getBanners = async () => {
    try {
      setIsLoading(true);
      const response = await axios("/api/game/config");
      const data = await response.data;
      setBanners(data?.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div className="w-full md:hidden mt-4 cursor-pointer">
      {isLoading && (
        <div className="w-full h-[140px] flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-center text-slate-500">Loading...</span>
        </div>
      )}
      <Carousel
        className="flex w-full"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="w-full -ml-2">
          {banners.map((banner, index) => (
            <CarouselItem key={index} className="w-full">
              <BannerItem
                key={banner.id.toString()}
                id={banner.id.toString()}
                bannerImage={banner.bannerImage}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious /> */}
        {/* <CarouselNext /> */}
      </Carousel>
    </div>
  );
};

export default MobileBanner;
