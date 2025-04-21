"use client";
import axios from "axios";
import GameMobileCategoryItem from "./mobile-category-item";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GameMobileSidebar = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const response = await axios.get("/api/game/category");
      setCategories(response.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="flex flex-col">
      <Sheet>
        <SheetTrigger
          asChild
          className="md:hidden hover:opacity-75 transition"
        >
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white overflow-auto">
          <SheetHeader>
            <SheetTitle>Categories</SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Select a category to search for games
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <SheetClose>
              <GameMobileCategoryItem key={`all`} _id={``} name={`All`} />
            </SheetClose>
            {categories.map((category: any) => {
              return (
                <SheetClose key={`close_${category._id}`}>
                  <GameMobileCategoryItem
                    key={category._id}
                    _id={category._id.toString()}
                    name={category.name}
                  />
                </SheetClose>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
      {/* <Sheet>
        <SheetTrigger
          className="md:hidden pr-4 hover:opacity-75 transition"
          asChild
        >
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white overflow-auto">
          <SheetTitle className="p-4 text-lg font-semibold text-slate-600 mb-2 border border-b-2">
            Category
          </SheetTitle>
          <SheetClose asChild>
            <GameMobileCategoryItem key={`all`} _id={``} name={`All`} />
          </SheetClose>
          {categories.map((category: any) => {
            return (
              <SheetClose key={`close_${category._id}`} asChild>
                <GameMobileCategoryItem
                  key={category._id}
                  _id={category._id.toString()}
                  name={category.name}
                />
              </SheetClose>
            );
          })}
        </SheetContent>
      </Sheet> */}
    </div>
  );
};

export default GameMobileSidebar;
