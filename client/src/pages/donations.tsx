import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Target, TrendingUp, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Donations() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const { data: campaigns = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/donation-campaigns"],
  });

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  const calculateProgress = (raised: string, goal: string) => {
    const raisedNum = parseFloat(raised || "0");
    const goalNum = parseFloat(goal);
    return Math.min((raisedNum / goalNum) * 100, 100);
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(amount));
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[hsl(262,83%,58%)] mb-4">
            Faça Sua Doação
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua contribuição nos ajuda a continuar nossa missão e apoiar nossa comunidade
          </p>
        </div>

        {/* Quick Donation Section */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              <Heart className="h-6 w-6 inline-block mr-2 text-red-500" />
              Doação Rápida
            </CardTitle>
            <CardDescription className="text-center">
              Escolha um valor ou digite um valor personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={selectedAmount === amount ? "bg-[hsl(43,96%,56%)]" : ""}
                >
                  R$ {amount}
                </Button>
              ))}
            </div>
            
            <div className="mb-6">
              <input
                type="number"
                placeholder="Outro valor (R$)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(43,96%,56%)]"
              />
            </div>

            <Button 
              className="w-full bg-[hsl(262,83%,58%)] hover:bg-[hsl(262,83%,48%)] py-6 text-lg"
              disabled={!selectedAmount && !customAmount}
            >
              Doar {selectedAmount ? `R$ ${selectedAmount}` : customAmount ? `R$ ${customAmount}` : ""}
            </Button>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[hsl(262,83%,58%)]">
            Campanhas Ativas
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[hsl(262,83%,58%)] mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando campanhas...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const progress = calculateProgress(campaign.raised, campaign.goal);
                const daysRemaining = getDaysRemaining(campaign.endDate);

                return (
                  <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      {campaign.imageUrl && (
                        <img
                          src={campaign.imageUrl}
                          alt={campaign.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&w=400&h=300&auto=format&fit=crop';
                          }}
                        />
                      )}
                      <CardTitle className="text-xl text-[hsl(262,83%,58%)]">
                        {campaign.title}
                      </CardTitle>
                      <CardDescription>{campaign.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Arrecadado</span>
                            <span className="font-bold text-[hsl(262,83%,58%)]">
                              {formatCurrency(campaign.raised)}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>{progress.toFixed(0)}% do objetivo</span>
                            <span>Meta: {formatCurrency(campaign.goal)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Encerrada'}
                          </div>
                          {daysRemaining > 0 && (
                            <Badge className="bg-green-500 text-white">
                              Ativa
                            </Badge>
                          )}
                        </div>

                        <Button 
                          className="w-full bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                          disabled={daysRemaining === 0}
                        >
                          Contribuir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {campaigns.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">
                Nenhuma campanha ativa no momento
              </p>
            </div>
          )}
        </div>

        {/* Donation Info */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <CardTitle>Doação Segura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Todas as doações são processadas com segurança através de gateways confiáveis
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-[hsl(43,96%,56%)] mx-auto mb-2" />
              <CardTitle>Impacto Comunitário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sua doação ajuda diretamente em nossos projetos sociais e atividades da igreja
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-[hsl(262,83%,58%)] mx-auto mb-2" />
              <CardTitle>Transparência</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acompanhe o progresso das campanhas e veja como sua contribuição faz a diferença
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}