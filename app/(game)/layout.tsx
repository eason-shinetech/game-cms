import ToasterProvider from "@/components/providers/toaster-provider";
import GameHeader from "./_components/header";
import VisitorPage from "./_components/visitor";
import Footer from "./_components/footer";
import Logo from "@/components/commons/logo";

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="absolute p-6">
        <Logo />
      </div>
      <VisitorPage />
      <div className="h-[60px] fixed inset-y-0 w-full z-50">
        <GameHeader />
      </div>
      <main className="h-full pt-[60px] pb-[40px] md:px-20">
        {children}
        <ToasterProvider />
      </main>
      <div className="h-[40px] fixed bottom-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
}
