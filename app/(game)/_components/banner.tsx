import dbConnect from "@/lib/db";
import GameConfigModel from "@/models/game-config";
import BannerItem from "./banner-item";
import MobileBanner from "./mobile/mobile-banner";

const GameBanner = async () => {
  await dbConnect();
  const config = await GameConfigModel.findOne();
  const banners: { id: string; bannerImage: string }[] =
    config?.banners?.slice(0, 4) || [];
  return (
    <>
      <div className="hidden w-full md:grid grid-rows-1 grid-cols-4 gap-4 mt-4 cursor-pointer">
        {banners.map((banner, index) => (
          <BannerItem
            key={index}
            id={banner.id.toString()}
            bannerImage={banner.bannerImage}
          />
        ))}
      </div>
    </>
  );
};

export default GameBanner;
