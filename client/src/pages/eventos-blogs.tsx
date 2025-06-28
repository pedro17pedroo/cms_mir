import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function EventosBlogs() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6">
                Eventos e Blogs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Fique por dentro dos nossos eventos e leia os artigos mais recentes do nosso blog.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Eventos Section */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-[hsl(210,11%,15%)]">Próximos Eventos</h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">Conferência de Fé 2025</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              15-17 de Janeiro, 2025
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              19:00 - 21:30
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Igreja MIR - Sede Principal
                            </div>
                          </div>
                        </div>
                        <Button size="sm">
                          Inscrever-se
                        </Button>
                      </div>
                      <p className="text-gray-700">
                        Três dias de ministração poderosa sobre como desenvolver uma fé inabalável 
                        que transforma vidas e circunstâncias.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">Retiro de Jovens</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              28-30 de Março, 2025
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Todo o dia
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Centro de Retiros
                            </div>
                          </div>
                        </div>
                        <Button size="sm">
                          Inscrever-se
                        </Button>
                      </div>
                      <p className="text-gray-700">
                        Fim de semana especial para jovens com ministração, atividades e muito crescimento espiritual.
                      </p>
                    </CardContent>
                  </Card>

                  <Link href="/eventos">
                    <Button variant="outline" className="w-full">
                      Ver Todos os Eventos <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Blog Section */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-[hsl(210,11%,15%)]">Artigos Recentes</h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        Como Manter a Fé em Tempos Difíceis
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Pastor Principal
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          5 min de leitura
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Reflexões bíblicas sobre como permanecer firme na fé mesmo quando 
                        enfrentamos desafios e adversidades...
                      </p>
                      <Button variant="outline" size="sm">
                        Ler Artigo
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        O Poder da Oração Intercessória
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Líder de Oração
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          7 min de leitura
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Descubra como a oração intercessória pode transformar vidas e 
                        impactar nações através do poder de Deus...
                      </p>
                      <Button variant="outline" size="sm">
                        Ler Artigo
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        Vivendo em Comunidade Cristã
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Pastor Associado
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          6 min de leitura
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">
                        A importância de viver em comunidade e como isso fortalece 
                        nossa caminhada cristã...
                      </p>
                      <Button variant="outline" size="sm">
                        Ler Artigo
                      </Button>
                    </CardContent>
                  </Card>

                  <Link href="/blog">
                    <Button variant="outline" className="w-full">
                      Ver Todos os Artigos <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">Fique por Dentro</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700 mb-6">
                  Inscreva-se na nossa newsletter para receber atualizações sobre eventos, 
                  novos artigos e mensagens especiais.
                </p>
                <div className="flex gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <Button>Inscrever</Button>
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