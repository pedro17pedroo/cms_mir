import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Heart, Users, Globe } from "lucide-react";

export default function SobreMinisterio() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6">
                Nosso Ministério
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Somos um ministério dedicado à transformação de vidas através do poder do Espírito Santo,
                levando esperança e restauração a todas as nações.
              </p>
            </div>

            {/* Valores do Ministério */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Church className="h-12 w-12 text-[hsl(43,96%,56%)] mx-auto mb-4" />
                  <CardTitle>Adoração</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Exaltamos o nome de Jesus através da adoração verdadeira e da comunhão com Deus.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Heart className="h-12 w-12 text-[hsl(262,83%,58%)] mx-auto mb-4" />
                  <CardTitle>Amor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Demonstramos o amor de Cristo através de ações concretas e relacionamentos genuínos.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-[hsl(13,85%,69%)] mx-auto mb-4" />
                  <CardTitle>Comunidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Construímos uma família de fé onde todos são acolhidos e podem crescer espiritualmente.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Globe className="h-12 w-12 text-[hsl(210,11%,15%)] mx-auto mb-4" />
                  <CardTitle>Missões</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Expandimos o Reino de Deus através de missões locais e internacionais.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}