import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, ArrowRight, Eye, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando artigos...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const publishedPosts = blogPosts?.filter(post => post.isPublished) || [];
  const featuredPost = publishedPosts[0];
  const otherPosts = publishedPosts.slice(1);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-900 via-orange-800 to-gold-700 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Blog da Igreja
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto mb-8">
              Artigos, mensagens, ensinos e reflexões para fortalecer sua jornada espiritual
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Artigos Espirituais
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <User className="w-4 h-4 mr-2" />
                Mensagens Pastorais
              </Badge>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Artigo em Destaque
                </h2>
              </div>
              
              <Card className="max-w-4xl mx-auto overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-gold-100 relative">
                      {featuredPost.imageUrl ? (
                        <img
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-orange-400" />
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-orange-600">
                        {featuredPost.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        {featuredPost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-orange-600" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                          {featuredPost.publishedAt ? 
                            new Date(featuredPost.publishedAt).toLocaleDateString('pt-BR') : 
                            'Data não informada'
                          }
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-2 text-orange-600" />
                          {featuredPost.viewCount || 0} visualizações
                        </div>
                      </div>

                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {featuredPost.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button asChild className="bg-orange-600 hover:bg-orange-700">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          Ler Artigo Completo
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Últimos Artigos
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Descubra mais conteúdo espiritual para sua edificação
              </p>
            </div>

            {otherPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-gold-100 relative">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-orange-400" />
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-orange-600">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1 text-orange-600" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-orange-600" />
                          {post.publishedAt ? 
                            new Date(post.publishedAt).toLocaleDateString('pt-BR') : 
                            'Data não informada'
                          }
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1 text-orange-600" />
                          {post.viewCount || 0}
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/blog/${post.slug}`}>
                            Ler Mais
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum artigo publicado
                </h3>
                <p className="text-gray-600">
                  Novos artigos serão publicados em breve. Fique atento!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Receba nossos artigos por email
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Inscreva-se na nossa newsletter e receba os últimos artigos, mensagens e reflexões
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="Seu email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <Button size="lg" variant="secondary">
                Inscrever-se
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}