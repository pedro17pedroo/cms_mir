import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, Clock, Play, Search, Filter, Download, Share2 } from "lucide-react";
import { useState } from "react";

export default function Teachings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/messages"],
  });

  const { data: featuredMessage } = useQuery({
    queryKey: ["/api/messages/featured"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredMessages = messages?.filter((message: any) => {
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || message.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(messages?.map((m: any) => m.category) || [])];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Ensinos</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Explore nossa biblioteca de mensagens e estudos bíblicos
          </p>
        </div>
      </section>

      {/* Featured Message */}
      {featuredMessage && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-2">
                Mensagem em Destaque
              </h2>
              <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
            </div>
            
            <Card className="border-none shadow-xl bg-gradient-to-r from-purple-50 to-gold-50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-1">
                    <img 
                      src={featuredMessage.imageUrl} 
                      alt={featuredMessage.title}
                      className="w-full h-48 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <Badge className="bg-gold-100 text-gold-800">Destaque</Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-purple-800">
                      {featuredMessage.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {featuredMessage.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredMessage.date}</span>
                      </div>
                      <Badge variant="outline">{featuredMessage.category}</Badge>
                    </div>
                    <div className="flex space-x-4">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Play className="h-4 w-4 mr-2" />
                        Assistir Agora
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar mensagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Messages Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMessages?.map((message: any) => (
              <Card key={message.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={message.imageUrl} 
                      alt={message.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <Badge className="absolute top-3 right-3 bg-purple-600 text-white">
                      {message.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-lg text-purple-800 mb-2 line-clamp-2">
                    {message.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                    {message.description}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{message.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>45 min</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Play className="h-3 w-3 mr-1" />
                      Assistir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMessages?.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma mensagem encontrada
              </h3>
              <p className="text-gray-500">
                Tente ajustar seus filtros ou termo de busca
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Study Series */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Séries de Estudos
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample study series */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-purple-800">Parábolas de Jesus</CardTitle>
                <CardDescription>12 estudos sobre as parábolas do Novo Testamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>12 episódios</span>
                  <span>Em andamento</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Ver Série
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-purple-800">Vida Cristã Prática</CardTitle>
                <CardDescription>Aplicando os princípios bíblicos no dia a dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>8 episódios</span>
                  <span>Completa</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Ver Série
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-full h-32 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-purple-800">Fundamentos da Fé</CardTitle>
                <CardDescription>Série para novos convertidos e interessados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>6 episódios</span>
                  <span>Completa</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Ver Série
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Weekly Study */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Estudo Semanal
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Participe do nosso estudo bíblico toda quarta-feira às 19h30
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
              <Calendar className="h-5 w-5 mr-2" />
              Próximo Estudo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-800">
              <BookOpen className="h-5 w-5 mr-2" />
              Material de Estudo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}