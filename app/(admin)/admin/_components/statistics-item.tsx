"use client";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticsItemProps {
  title: string;
  value: string;
}

const StatisticsItem = ({ title, value }: StatisticsItemProps) => {
  return (
    <Card className="flex-1 h-[150px]">
      <CardContent className="w-full h-full">
        <div className="w-full h-full gap-4 flex flex-col items-center justify-between">
          <p className="flex-1 text-3xl text-slate-600">{value}</p>
          <p className="flex-none text-sm text-slate-400">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsItem;
