import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Target, BookOpen, Users } from "lucide-react";

export default function About() {
  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ["/api/about-content"],
  });

  const { data: siteSettings } = useQuery({
    queryKey: ["/api/site-settings"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (section: string) => {
    switch (section) {
      case 'vision': return <Target className="h-8 w-8 text-purple-600" />;
      case 'mission': return <Heart className="h-8 w-8 text-purple-600" />;
      case 'beliefs': return <BookOpen className="h-8 w-8 text-purple-600" />;
      default: return <Users className="h-8 w-8 text-purple-600" />;
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'vision': return 'Nossa Visão';
      case 'mission': return 'Nossa Missão';
      case 'beliefs': return 'No Que Cremos';
      default: return section;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Sobre Nós</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Conheça nossa história, missão e valores
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {Array.isArray(aboutContent) && aboutContent.map((content: any) => (
              <Card key={content.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {getIcon(content.section)}
                  </div>
                  <CardTitle className="text-2xl text-purple-800">
                    {getSectionTitle(content.section)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {content.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Church History */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Nossa História
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-purple-800 mb-6">
                Uma Jornada de Fé
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nossa igreja foi fundada com o propósito de criar uma comunidade onde 
                pessoas de todas as idades e origens possam encontrar esperança, amor e 
                propósito através da palavra de Deus.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Ao longo dos anos, temos crescido não apenas em número, mas em fé, 
                compromisso e impacto na nossa comunidade local e além.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Comunidade Acolhedora
                </Badge>
                <Badge variant="secondary" className="bg-gold-100 text-gold-800">
                  Ensino Bíblico
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Transformação Vidas
                </Badge>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Fundação</h4>
                    <p className="text-gray-600">Início da nossa jornada</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-gold-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Crescimento</h4>
                    <p className="text-gray-600">Expansão da nossa comunidade</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Hoje</h4>
                    <p className="text-gray-600">Continuamos a servir e crescer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Nossa Liderança
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sample leadership - this would come from database */}
            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">Pastor Principal</CardTitle>
                <CardDescription>Liderança Espiritual</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dedicado ao ensino da palavra e ao cuidado pastoral da nossa comunidade.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-24 h-24 bg-gold-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-gold-600" />
                </div>
                <CardTitle className="text-purple-800">Ministério de Louvor</CardTitle>
                <CardDescription>Adoração e Música</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conduzindo a congregação em momentos de adoração e louvor a Deus.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-orange-600" />
                </div>
                <CardTitle className="text-purple-800">Ministério de Ensino</CardTitle>
                <CardDescription>Educação e Discipulado</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Desenvolvendo programas de ensino e crescimento espiritual.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}