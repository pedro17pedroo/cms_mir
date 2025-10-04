import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, User, ArrowRight, Eye } from "lucide-react";
import { Link } from "wouter";
import type { Event, BlogPost } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function EventosBlogs() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: blogPosts, isLoading: blogsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/newsletter-subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inscrição realizada!",
        description: "Você receberá nossas novidades por e-mail.",
      });
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter-subscribers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na inscrição",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      newsletterMutation.mutate(email.trim());
    }
  };

  const isLoading = eventsLoading || blogsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando conteúdo...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Pegar apenas os próximos 2 eventos
  const upcomingEvents = events?.slice(0, 2) || [];
  
  // Pegar apenas os 3 artigos mais recentes publicados
  const recentPosts = (blogPosts?.filter(post => post.isPublished) || []).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6" data-testid="heading-eventos-blogs">
                Eventos e Blogs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Fique por dentro dos nossos eventos e leia os artigos mais recentes do nosso blog.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Eventos Section */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-[hsl(210,11%,15%)]">
                  Próximos Eventos
                </h2>
                
                <div className="space-y-6">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <Card key={event.id} data-testid={`card-event-${event.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold">{event.title}</h3>
                                {event.category && (
                                  <Badge className="bg-purple-600">
                                    {event.category}
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(event.date).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {event.time}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            {event.registrationLink && (
                              <Button size="sm" asChild data-testid={`button-register-${event.id}`}>
                                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                  Inscrever-se
                                </a>
                              </Button>
                            )}
                          </div>
                          <p className="text-gray-700 line-clamp-2">
                            {event.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        Nenhum evento agendado no momento.
                      </CardContent>
                    </Card>
                  )}

                  <Link href="/events" data-testid="link-all-events">
                    <Button variant="outline" className="w-full">
                      Ver Todos os Eventos <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Blog Section */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-[hsl(210,11%,15%)]">
                  Artigos Recentes
                </h2>
                
                <div className="space-y-6">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                      <Card key={post.id} data-testid={`card-blog-${post.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-2 mb-2">
                            <h3 className="text-xl font-semibold flex-1">
                              {post.title}
                            </h3>
                            {post.category && (
                              <Badge className="bg-orange-600">
                                {post.category}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.publishedAt ? 
                                new Date(post.publishedAt).toLocaleDateString('pt-BR') : 
                                'Data não informada'
                              }
                            </div>
                            {post.viewCount !== null && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.viewCount} visualizações
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {post.excerpt || post.content?.substring(0, 150) + '...'}
                          </p>
                          <Button variant="outline" size="sm" data-testid={`button-read-${post.id}`}>
                            Ler Artigo
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        Nenhum artigo publicado no momento.
                      </CardContent>
                    </Card>
                  )}

                  <Link href="/blog" data-testid="link-all-blog">
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
                <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-newsletter-email"
                  />
                  <Button 
                    type="submit" 
                    disabled={newsletterMutation.isPending}
                    data-testid="button-newsletter-submit"
                  >
                    {newsletterMutation.isPending ? "Inscrevendo..." : "Inscrever"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
