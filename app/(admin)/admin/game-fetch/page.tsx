"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { GameMonetizeResult } from "@/models/game";

const GameFetchPage = () => {
  const [type, setType] = useState<string>("");
  const [popularity, setPopularity] = useState<string>("");
  const [api, setApi] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [games, setGames] = useState<GameMonetizeResult[]>([]);
  const [isPreImport, setIsPreImport] = useState<boolean>(false);

  const getApiUrl = () => {
    if (!type || !popularity) {
      return;
    }
    let baseUrl =
      "https://rss.gamemonetize.com/rssfeed.php?format=json&category=All&company=All&amount=All";
    if (type) {
      baseUrl += `&type=${type}`;
    }
    if (popularity) {
      baseUrl += `&popularity=${popularity}`;
    }
    setApi(baseUrl);
  };

  useEffect(() => {
    getApiUrl();
  }, [type, popularity]);

  const handleFetchGames = async () => {
    if (!api) {
      toast.error("Please select a type and popularity!");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get(api);
      const data = res.data;
      if (data.length === 0) {
        toast.error("No games found!");
        return;
      }
      setGames(data);
      setIsPreImport(true);
      toast.success("Games fetched successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportGames = async () => {
    if (!games || games.length === 0) {
      toast.error("No Game need to import!");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/game/fetch`, games);
      console.log("handleImportGames:", res);
      toast.success("Games import successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
      setIsPreImport(false);
      setGames([]);
    }
  };

  return (
    <div className="flex flex-col p-6 w-full gap-y-4 justify-between text-slate-500">
      <h1 className="text-2xl ">GameMonetize</h1>
      <hr className="w-full text-slate-500/80" />
      <div className="w-full px-8 md:w-[500px]">
        <label>Type</label>
        <Select onValueChange={setType} value={type}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select a Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html5">Html5</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full px-8 md:w-[500px]">
        <label>Popularity</label>
        <Select onValueChange={setPopularity} value={popularity}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select a Popularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="mostplayed">Mostplayed</SelectItem>
            <SelectItem value="hotgames">Hotgames</SelectItem>
            <SelectItem value="bestgames">Bestgames</SelectItem>
            <SelectItem value="exclusivegames">Exclusivegames</SelectItem>
            <SelectItem value="editorpicks">Editorpicks</SelectItem>
            <SelectItem value="branding">Branding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full px-8 md:w-[500px]">
        <Button
          disabled={!api || isLoading}
          className="w-full"
          type="button"
          onClick={isPreImport ? handleImportGames : handleFetchGames}
        >
          {isLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-secondary" />
          )}
          {isPreImport ? "Import Games" : "Fetch Games"}
        </Button>
      </div>
      {api && (
        <>
          <div className="w-full text-sm pl-8 text-sky-700/60 mt-2">
            <span className="bg-sky-300/20 p-2">rss url: {api}</span>
          </div>
          <div className="w-full text-sm pl-8 text-sky-700/60 mt-2">
            <span className="bg-sky-300/20 p-2">total: {games.length}</span>
          </div>
        </>
      )}
      <hr className="w-full text-slate-500/80" />
    </div>
  );
};

export default GameFetchPage;
