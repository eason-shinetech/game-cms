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

interface GameFetchDialogProps {
  isFetching: boolean;
  onFetch: (type: string, popularity: string) => void;
}

const GameFetchDialog = ({ isFetching, onFetch }: GameFetchDialogProps) => {
  const [type, setType] = useState<string>("");
  const [popularity, setPopularity] = useState<string>("");

  const startFetch = () => {
    console.log("start fetch", type, popularity);
    onFetch(type, popularity);
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
        <div className="w-full px-8">
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
        <div className="w-full px-8">
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

export default GameFetchDialog;
