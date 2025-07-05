import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { type BlogPost } from "@shared/schema";

export default function BlogSection() {
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Últimas Publicações</h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filtrar apenas posts publicados e pegar os mais recentes
  const recentPosts = blogPosts
    .filter((post: BlogPost) => post.isPublished === true)
    .sort((a: BlogPost, b: BlogPost) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3); // Mostrar apenas os 3 posts mais recentes

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Mensagem Pastoral": "bg-blue-100 text-blue-800",
      "Ensino Bíblico": "bg-green-100 text-green-800",
      "Reflexão Espiritual": "bg-purple-100 text-purple-800",
      "Vida Cristã": "bg-yellow-100 text-yellow-800",
      "Testemunho": "bg-orange-100 text-orange-800",
      "Oração": "bg-pink-100 text-pink-800",
      "Família": "bg-indigo-100 text-indigo-800",
      "Jovens": "bg-cyan-100 text-cyan-800",
      "Eventos": "bg-red-100 text-red-800",
      "Notícias": "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Últimas Publicações</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe nossos ensinamentos, reflexões e novidades da igreja
          </p>
        </div>

        {/* Blog Posts Grid */}
        {recentPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recentPosts.map((post: BlogPost) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <div className="relative">
                  {post.imageUrl && (
                    <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-purple-500" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                      {post.createdAt ? format(new Date(post.createdAt), "dd MMM", { locale: ptBR }) : "N/A"}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Comentários
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                        Ler mais
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma publicação encontrada</h3>
            <p className="text-gray-500">Novos conteúdos serão publicados em breve!</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              Ver Todas as Publicações
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}