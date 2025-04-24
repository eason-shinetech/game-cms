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

const MobileBanner = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [banners, setBanners] = useState<{ id: string; bannerImage: string }[]>(
    []
  );

  const getBanners = async () => {
    try {
      const response = await axios("/api/game/config");
      const data = await response.data;
      setBanners(data?.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div className="w-full md:hidden mt-4 cursor-pointer">
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
