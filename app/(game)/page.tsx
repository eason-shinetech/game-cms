import AdBanner from "./_components/ad-banner";
import GameBanner from "./_components/banner";
import GameCategory from "./_components/category";
import GameList from "./_components/game-list";
import { Suspense } from "react";
import MobileSearch from "./_components/mobile/mobile-search";
import MobileBanner from "./_components/mobile/mobile-banner";
import Popularity from "./_components/popularity";

const GamePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <GameBanner />
      <MobileBanner />
      {/* <AdBanner /> */}
      <MobileSearch />
      <Suspense>
        <Popularity />
      </Suspense>
      <GameCategory />
      <Suspense>
        <GameList />
      </Suspense>
    </div>
  );
};

export default GamePage;
