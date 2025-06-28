import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Cross, Heart, Crown } from "lucide-react";

export default function SobreCremos() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6">
                No que Cremos
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nossas crenças fundamentais estão baseadas na Palavra de Deus e nos princípios cristãos eternos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Book className="h-12 w-12 text-[hsl(43,96%,56%)] mb-4" />
                  <CardTitle>A Bíblia Sagrada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Cremos que a Bíblia é a Palavra de Deus inspirada, infalível e autoridade suprema 
                    para fé e prática cristã.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Cross className="h-12 w-12 text-[hsl(262,83%,58%)] mb-4" />
                  <CardTitle>Jesus Cristo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Cremos em Jesus Cristo como Filho de Deus, nosso Salvador e Senhor, que morreu 
                    pelos nossos pecados e ressuscitou para nossa justificação.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Declaração de Fé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-[hsl(43,96%,56%)]">A Trindade</h3>
                  <p className="text-gray-700">
                    Cremos na Trindade: Deus Pai, Deus Filho e Deus Espírito Santo, três pessoas 
                    distintas em uma única essência divina.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-[hsl(262,83%,58%)]">Salvação</h3>
                  <p className="text-gray-700">
                    Cremos que a salvação é pela graça mediante a fé em Jesus Cristo, não por obras, 
                    mas é dom de Deus para todos que creem.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-[hsl(13,85%,69%)]">O Espírito Santo</h3>
                  <p className="text-gray-700">
                    Cremos no batismo no Espírito Santo e nos dons espirituais para edificação 
                    da igreja e expansão do Reino de Deus.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}