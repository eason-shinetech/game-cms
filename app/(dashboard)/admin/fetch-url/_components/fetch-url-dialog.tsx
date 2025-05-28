"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useState } from "react";

interface FetchUrlDialogProps {
  isFetching: boolean;
  onFetch: (url: string, from: string, platform: string) => void;
}

const FetchUrlDialog = ({ isFetching, onFetch }: FetchUrlDialogProps) => {
  const [from, setFrom] = useState("");
  const [platform, setPlatform] = useState("mobile");
  const [url, setUrl] = useState("");

  const gameUrls = [
    {
      from: "monetize",
      url: "https://gamemonetize.com/feed.php?format=0",
    },
    {
      from: "gamepix",
      url: "https://feeds.gamepix.com/v2/json?sid=45F4Y&pagination=96",
    },
    {
      from: "gamedistribution",
      url: "https://gd-website-api.gamedistribution.com/graphql",
    },
  ];

  const startFetch = () => {
    console.log("start fetch", url, from, platform);
    onFetch(url, from, platform);
  };

  const onFromChange = (value: string) => {
    setFrom(value);
    const currentUrl = gameUrls.find((item) => item.from === value)?.url;
    setUrl(currentUrl || "");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-1">
          {isFetching ? (
            <Loader2Icon size={18} className="animate-spin" />
          ) : (
            <SearchIcon size={18} />
          )}
          <span>Fetch</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fetch Games</DialogTitle>
          <DialogDescription>
            Fetch games from url here. Click 'Start Fetch' when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-2">
          <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="from">From</Label>
          <Select onValueChange={onFromChange} value={from}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select a From" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monetize">Game Monetize</SelectItem>
              <SelectItem value="gamepix">gamepix</SelectItem>
              <SelectItem value="gamedistribution">Game Distribution</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
          <Label htmlFor="url">Url</Label>
          <Input
            type="url"
            id="url"
            placeholder="Enter a url"
            value={url}
            disabled
          />
        </div>
        
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="from">Platform</Label>
          <Select onValueChange={setPlatform} value={platform}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select a Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="html5">Html5</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={startFetch} disabled={isFetching || !url ||  !from}>
            {isFetching && <Loader2Icon size={18} className="animate-spin" />}
            {isFetching ? `Fetching Data` : `Start Fetch`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FetchUrlDialog;
