import AdBanner from "./_components/ad-banner";
import GameBanner from "./_components/banner";
import GameCategory from "./_components/category";
import GameList from "./_components/game-list";
import { Suspense } from "react";

const GamePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <GameBanner />
      {/* <AdBanner /> */}
      <GameCategory />
      <Suspense>
        <GameList />
      </Suspense>
    </div>
  );
};

export default GamePage;
