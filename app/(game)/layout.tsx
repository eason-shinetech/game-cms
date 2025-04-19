import ToasterProvider from "@/components/providers/toaster-provider";
import GameHeader from "./_components/header";
import Script from "next/script";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9748776301585000"
        crossOrigin="anonymous"
      />
      <div className="h-[60px] fixed inset-y-0 w-full z-50">
        <GameHeader />
      </div>
      <main className="h-full pt-[60px] md:px-20">
        {children}
        <ToasterProvider />
      </main>
    </div>
  );
}
