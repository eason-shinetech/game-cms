"use client";

import ToasterProvider from "@/components/providers/toaster-provider";
import Navbar from "./admin/_components/navbar";
import Sidebar from "./admin/_components/sidebar";
import { SessionProvider, useSession } from "next-auth/react";
import { useLoadingStore } from "@/store/loading-store";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoading = useLoadingStore((state: any) => state.isLoading);
  return (
    <div className="h-full">
      <SessionProvider refetchInterval={60 * 60}>
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
          <Navbar />
        </div>
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="h-full md:pl-56 pt-[80px]">
          {isLoading && (
            <div className="fixed w-full h-full flex items-center justify-center bg-gray-500/20  text-slate-500 z-10 rounded-md">
              <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading...
            </div>
          )}
          {children}
          <ToasterProvider />
        </main>
      </SessionProvider>
    </div>
  );
}
