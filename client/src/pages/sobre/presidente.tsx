import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart, Globe, Award } from "lucide-react";

export default function SobrePresidente() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6">
                Presidente do MIR
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conheça o líder e fundador do Ministério Internacional de Restauração.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-3xl">Biografia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg text-gray-700">
                      O Ministério Internacional de Restauração foi fundado com uma visão clara: 
                      levar esperança e restauração a todas as nações através do poder transformador 
                      do Evangelho de Jesus Cristo.
                    </p>
                    
                    <p className="text-gray-700">
                      Com anos de experiência no ministério, o presidente do MIR tem dedicado sua vida 
                      à pregação da Palavra, ao cuidado pastoral e à expansão do Reino de Deus através 
                      de missões locais e internacionais.
                    </p>
                    
                    <p className="text-gray-700">
                      Sua paixão pela oração, pelo ensino bíblico e pela transformação de vidas tem 
                      sido o alicerce sobre o qual o ministério tem crescido e impactado milhares 
                      de pessoas ao redor do mundo.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <User className="h-8 w-8 text-[hsl(43,96%,56%)] mb-2" />
                    <CardTitle>Chamado Ministerial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Chamado por Deus para liderar e pastorear, com foco na restauração 
                      de vidas e famílias.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Heart className="h-8 w-8 text-[hsl(262,83%,58%)] mb-2" />
                    <CardTitle>Coração Pastoral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Dedicado ao cuidado das ovelhas e ao discipulado, formando líderes 
                      para a obra de Deus.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Globe className="h-8 w-8 text-[hsl(13,85%,69%)] mb-2" />
                    <CardTitle>Visão Missionária</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Comprometido com a Grande Comissão, levando o Evangelho a todas 
                      as nações e povos.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-center">Ministério e Legado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-[hsl(43,96%,56%)]">Impacto Global</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Plantação de igrejas em diversos países</li>
                      <li>• Formação de líderes e pastores</li>
                      <li>• Conferências e eventos internacionais</li>
                      <li>• Projetos sociais e missionários</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-[hsl(262,83%,58%)]">Valores Centrais</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Integridade e transparência</li>
                      <li>• Amor e compaixão pelas pessoas</li>
                      <li>• Compromisso com a Palavra de Deus</li>
                      <li>• Unidade no corpo de Cristo</li>
                    </ul>
                  </div>
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