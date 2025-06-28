import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, User, Eye } from "lucide-react";

export default function EnsinoVideo() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6">
                Ensinos em Vídeo
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Assista aos nossos vídeos de ensino, pregações e estudos bíblicos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-gray-800 rounded-t-lg flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">O Poder da Oração</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      45 min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      1.2k
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Uma mensagem transformadora sobre como a oração pode mudar sua vida.
                  </p>
                  <Button size="sm" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Assistir
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-gray-800 rounded-t-lg flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Fé que Move Montanhas</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      38 min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      950
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Como desenvolver uma fé inabalável que supera obstáculos.
                  </p>
                  <Button size="sm" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Assistir
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-gray-800 rounded-t-lg flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">O Amor de Deus</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      52 min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      1.5k
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Reflexão sobre o amor incondicional de Deus por nós.
                  </p>
                  <Button size="sm" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Assistir
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Estudos Bíblicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Acesse nossa coleção de estudos bíblicos em vídeo, organizados por temas e livros da Bíblia.
                  </p>
                  <Button variant="outline">Ver Estudos</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transmissões ao Vivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Participe dos nossos cultos e eventos especiais através das transmissões ao vivo.
                  </p>
                  <Button variant="outline">Ver Agenda</Button>
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