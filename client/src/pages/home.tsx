import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DynamicLandingPage from "@/components/sections/dynamic-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <DynamicLandingPage />
      <Footer />
    </div>
  );
}
