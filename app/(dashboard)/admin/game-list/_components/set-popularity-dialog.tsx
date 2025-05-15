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

import { Label } from "recharts";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SetPopularityDialogProps {
  selectIds: string[];
  onClose: () => void;
}

const SetPopularityDialog = ({
  selectIds,
  onClose,
}: SetPopularityDialogProps) => {
  const popularities = [
    {
      name: "Newest Games",
      value: "newest",
    },
    {
      name: "Popular Games",
      value: "mostplayed",
    },
    {
      name: "Hot Games",
      value: "hotgames",
    },
    {
      name: "Best Games",
      value: "bestgames",
    },
  ];
  const [popularity, setPopularity] = useState<string>("");
  const handleSubmit = async () => {
    try {
      if (!popularity) return;
      if (!selectIds || selectIds.length === 0) return;
      console.log(selectIds, popularity);
      await axios.post("/api/game/popularity", { selectIds, popularity });
      if (onClose) {
        onClose();
      }
      toast.success("Set Popularity Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-1">
          <span>Set Popularity</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Popularity</DialogTitle>
          <DialogDescription>
            Set the selected game to "Popularity".
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label>Popularity</Label>
          <Select onValueChange={setPopularity} value={popularity}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select a Popularity" />
            </SelectTrigger>
            <SelectContent>
              {popularities.map((popularity, index) => {
                return (
                  <SelectItem key={index} value={popularity.value}>
                    {popularity.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetPopularityDialog;
