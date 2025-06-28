import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Clock, User } from "lucide-react";

export default function EnsinoAudio() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6">
                Ensinos em Áudio
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Acesse nossa biblioteca de mensagens e estudos bíblicos em formato de áudio.
              </p>
            </div>

            <div className="grid gap-6 mb-12">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">O Poder da Oração</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Pastor Principal
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          45 min
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Uma mensagem poderosa sobre a importância da oração na vida cristã 
                        e como ela transforma nossa relação com Deus.
                      </p>
                    </div>
                    <div className="flex gap-2 ml-6">
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Ouvir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Fé que Move Montanhas</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Pastor Associado
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          38 min
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Estudo sobre como desenvolver uma fé inabalável que supera 
                        todos os obstáculos da vida.
                      </p>
                    </div>
                    <div className="flex gap-2 ml-6">
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Ouvir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">O Amor de Deus</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Líder de Louvor
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          52 min
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Uma reflexão profunda sobre o amor incondicional de Deus 
                        e como ele transforma nossas vidas.
                      </p>
                    </div>
                    <div className="flex gap-2 ml-6">
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Ouvir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Como Acessar</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700 mb-6">
                  Todos os áudios estão disponíveis gratuitamente. Você pode ouvir online 
                  ou fazer o download para ouvir offline.
                </p>
                <Button size="lg">
                  Ver Todos os Áudios
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}