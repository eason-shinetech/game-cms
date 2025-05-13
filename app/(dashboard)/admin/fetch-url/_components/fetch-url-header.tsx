"use client";

import { Button } from "@/components/ui/button";
import { ImportIcon, Loader2Icon, SearchIcon } from "lucide-react";
import FetchUrlDialog from "./fetch-url-dialog";

interface FetchUrlHeaderProps {
  isFetching: boolean;
  onFetch: (url: string, from: string, platform: string) => void;
  isImportDisabled: boolean;
  isImporting: boolean;
  onImport: () => void;
}

const FetchUrlHeader = ({
  isFetching,
  onFetch,
  isImportDisabled,
  isImporting,
  onImport,
}: FetchUrlHeaderProps) => {
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fetch From URL</h2>
        <p className="text-muted-foreground">
          Fetch games from url here. Click 'Start Fetch' when you're done.
        </p>
      </div>
      <div className="flex gap-2">
        <FetchUrlDialog isFetching={isFetching} onFetch={onFetch} />
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

export default FetchUrlHeader;
