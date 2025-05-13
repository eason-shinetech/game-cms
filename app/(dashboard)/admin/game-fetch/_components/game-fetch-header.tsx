"use client";

import { Button } from "@/components/ui/button";
import { ImportIcon, Loader2Icon, SearchIcon } from "lucide-react";
import GameFetchDialog from "./game-fetch-dialog";

interface FetchHeaderProps {
  isFetching: boolean;
  onFetch: (type: string, popularity: string) => void;
  isImportDisabled: boolean;
  isImporting: boolean;
  onImport: () => void;
}

const GameFetchHeader = ({
  isFetching,
  onFetch,
  isImportDisabled,
  isImporting,
  onImport,
}: FetchHeaderProps) => {
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fetch From GameMonetize</h2>
        <p className="text-muted-foreground">
          Fetch games from GameMonetize here. Click 'Start Fetch' when you're done.
        </p>
      </div>
      <div className="flex gap-2">
        <GameFetchDialog isFetching={isFetching} onFetch={onFetch} />
        <Button
          className="space-x-1"
          onClick={onImport}
          disabled={isImportDisabled}
        >
          {isImporting ? (
            <Loader2Icon size={18} className="animate-spin" />
          ) : (
            <ImportIcon size={18} />
          )}
          <span>Import</span>
        </Button>
      </div>
    </>
  );
};

export default GameFetchHeader;
