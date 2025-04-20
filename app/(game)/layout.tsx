import ToasterProvider from "@/components/providers/toaster-provider";
import GameHeader from "./_components/header";
import VisitorPage from "./_components/visitor";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <VisitorPage />
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
