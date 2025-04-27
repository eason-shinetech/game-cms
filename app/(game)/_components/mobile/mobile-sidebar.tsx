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
import Logo from "@/components/commons/logo";
import Link from "next/link";

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
        <SheetTrigger asChild className="md:hidden hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white overflow-auto">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="grid gap-2 py-2">
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
            <div className="my-4"></div>
            <SheetClose>
              <Link href={`/about`}>
                <div className="w-full h-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-4 transition-all shadow-sm hover:text-sky-500">
                  <div className="flex items-center">About Us</div>
                </div>
              </Link>
            </SheetClose>
            <SheetClose>
              <Link href={`/contact`}>
                <div className="w-full h-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-4 transition-all shadow-sm hover:text-sky-500">
                  <div className="flex items-center gap-x-2 py-2">Contact</div>
                </div>
              </Link>
            </SheetClose>
            <SheetClose>
              <Link href={`/terms`}>
                <div className="w-full h-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-4 transition-all shadow-sm hover:text-sky-500">
                  <div className="flex items-center gap-x-2 py-2">Terms</div>
                </div>
              </Link>
            </SheetClose>
            <SheetClose>
              <Link href={`/privacy`}>
                <div className="w-full h-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-4 transition-all shadow-sm hover:text-sky-500">
                  <div className="flex items-center gap-x-2 py-2">Privacy</div>
                </div>
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default GameMobileSidebar;
