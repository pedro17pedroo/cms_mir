import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}