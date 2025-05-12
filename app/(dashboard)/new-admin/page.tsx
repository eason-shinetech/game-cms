"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./_components/overview";
import { RecentSales } from "./_components/recent-sales";
import { Header } from "@/components/layout/header";
import { ProfileDropdown } from "./_components/profile-dropdown";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Main } from "./_components/main";
import { HeaderContainer } from "./_components/header-container";
import {
  Gamepad2Icon,
  JoystickIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const [data, setData] = useState<{
    gameCount: number;
    publishedGameCount: number;
    playerCount: number;
    todayPlayerCount: number;
  } | null>(null);

  const getData = async () => {
    const res = await axios.get("/api/game/statistics");
    const data = res.data;
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Main fixed>
        <HeaderContainer>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </HeaderContainer>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 py-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today Player
              </CardTitle>
              <User2Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{`${data?.todayPlayerCount || 0}`}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Player
              </CardTitle>
              <Users2Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{`${data?.playerCount || 0}`}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Gamepad2Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{`${data?.gameCount || 0}`}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published Games
              </CardTitle>
              <JoystickIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{`${data?.publishedGameCount || 0}`}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Popular Games</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
