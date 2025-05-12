"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import ToasterProvider from "@/components/providers/toaster-provider";
import { ThemeSwitch } from "@/components/commons/theme-switch";
import { Header } from "@/components/layout/header";
import { ProfileDropdown } from "./new-admin/_components/profile-dropdown";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <SessionProvider refetchInterval={60 * 60}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <div
              id="content"
              className={cn(
                "max-w-full w-full ml-auto",
                "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
                "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
                "transition-[width] ease-linear duration-200",
                "h-full flex flex-col",
              )}
            >
              <Header fixed>
                <div className="ml-auto flex items-center space-x-4">
                  <ThemeSwitch />
                  <ProfileDropdown />
                </div>
              </Header>
              {children}
              <ToasterProvider />
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </SessionProvider>
    </div>
  );
}
