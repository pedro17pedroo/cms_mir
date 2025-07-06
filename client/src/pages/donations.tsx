import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DonationForm from "@/components/forms/donation-form";
import MetaTags, { generatePageMeta } from "@/components/seo/meta-tags";

export default function Donations() {
  const pageMeta = generatePageMeta({
    title: "Doações - Igreja MIR",
    description: "Faça sua contribuição para apoiar a missão da Igreja MIR. Doações seguras e transparentes para nossas campanhas e projetos.",
    keywords: "doações, igreja, contribuição, campanhas, apoio financeiro, dízimo, ofertas",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags {...pageMeta} />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <DonationForm />
      </main>
      
      <Footer />
    </div>
  );
}