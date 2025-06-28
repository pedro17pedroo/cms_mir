import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Calendar, Book, Award, Star } from "lucide-react";
import { Link } from "wouter";

export default function PlataformaEnsino() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6">
                Plataforma de Ensino
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Acesse cursos, conferências e materiais educacionais do MIR para crescimento espiritual e ministerial.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <Link href="/plataforma-ensino/conferencia-fe">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <Star className="h-12 w-12 text-[hsl(43,96%,56%)] mb-4" />
                    <CardTitle>Conferência da Fé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Evento anual focado no fortalecimento da fé e crescimento espiritual.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/plataforma-ensino/escola-fundacao">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <GraduationCap className="h-12 w-12 text-[hsl(262,83%,58%)] mb-4" />
                    <CardTitle>Escola de Fundação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Curso fundamental para novos convertidos e membros da igreja.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/plataforma-ensino/conferencia-ministros">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <Users className="h-12 w-12 text-[hsl(13,85%,69%)] mb-4" />
                    <CardTitle>Conferência de Ministros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Treinamento e capacitação para líderes ministeriais.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/plataforma-ensino/conferencia-mulheres">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <Award className="h-12 w-12 text-[hsl(43,96%,56%)] mb-4" />
                    <CardTitle>Conferência de Mulheres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Encontro especial focado em crescimento espiritual e propósito.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/plataforma-ensino/conferencia-jovens">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <Calendar className="h-12 w-12 text-[hsl(262,83%,58%)] mb-4" />
                    <CardTitle>Conferência dos Jovens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Evento voltado para jovens com foco em identidade e chamado cristão.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/plataforma-ensino/mulheres-transformadas">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <Book className="h-12 w-12 text-[hsl(13,85%,69%)] mb-4" />
                    <CardTitle>Mulheres Transformadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Ministério dedicado ao empoderamento de mulheres através de Cristo.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Como Participar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Para participar dos nossos cursos e conferências, você pode se inscrever 
                    através dos links específicos de cada evento ou entrar em contato conosco.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Inscrições online disponíveis</li>
                    <li>• Certificados de participação</li>
                    <li>• Material didático incluído</li>
                    <li>• Acompanhamento pastoral</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Próximos Eventos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="border-l-4 border-[hsl(43,96%,56%)] pl-4">
                      <h4 className="font-semibold">Escola de Fundação</h4>
                      <p className="text-sm text-gray-600">Início: Janeiro 2025</p>
                    </div>
                    <div className="border-l-4 border-[hsl(262,83%,58%)] pl-4">
                      <h4 className="font-semibold">Conferência de Mulheres</h4>
                      <p className="text-sm text-gray-600">Data: Março 2025</p>
                    </div>
                  </div>
                  <Button className="w-full">Ver Agenda Completa</Button>
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