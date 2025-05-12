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

interface FetchDialogProps {
  isFetching: boolean;
  onFetch: (url: string, from: string, platform: string) => void;
}

const FetchDialog = ({ isFetching, onFetch }: FetchDialogProps) => {
  const [from, setFrom] = useState("monetize");
  const [platform, setPlatform] = useState("mobile");
  const [url, setUrl] = useState("https://gamemonetize.com/feed.php?format=0");

  const startFetch = () => {
    console.log("start fetch", url, from, platform);
    onFetch(url, from, platform);
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
          <Label htmlFor="url">Url</Label>
          {/* <span className="text-xs text-slate-400">
            https://gamemonetize.com/feed.php?format=0
            <br />
            https://feeds.gamepix.com/v2/json?sid=45F4Y&pagination=96
          </span> */}
          <Input
            type="url"
            id="url"
            placeholder="Enter a url"
            value={url}
            onChange={(e: any) => {
              const url = e.target.value;
              setUrl(url);
              if (url.indexOf("gamepix") > -1) {
                setFrom("gamepix");
              } else if (url.indexOf("gamemonetize") > -1) {
                setFrom("monetize");
              }
            }}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="from">From</Label>
          <span className="text-xs text-slate-400">monetize / gamepix</span>
          <Input
            type="from"
            id="from"
            value={from}
            placeholder="monetize"
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
          <Button onClick={startFetch} disabled={isFetching}>
            {isFetching && <Loader2Icon size={18} className="animate-spin" />}
            {isFetching ? `Fetching Data` : `Start Fetch`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FetchDialog;
