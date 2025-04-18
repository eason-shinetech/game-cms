import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/providers/toaster-provider";
import Logo from "../components/commons/logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Funny Games",
  description:
    "Find the best games for your fun! Play now! Include y8-like games, poki-like games, kizi games and more!",
  keywords: [
    "y8-like games",
    "poki-like games",
    "kizi games",
    "best games",
    "funny games",
    "play now",
    "online games",
    "free games",
    "game store",
    "game reviews",
    "html5 games",
    "mobile games",
    "games",
    "fun",
    "play",
    "online",
    "free",
    "store",
    "reviews",
    "html5",
    "mobile",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="absolute p-6">
          <Logo />
        </div>
        {children}
      </body>
    </html>
  );
}
