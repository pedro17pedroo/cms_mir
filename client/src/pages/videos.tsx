import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Calendar, User, Clock, Eye, Radio } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Videos() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const { data: videos = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/videos"],
  });

  const categories = ["all", "sermon", "teaching", "testimony", "worship", "youth"];

  const filteredVideos = selectedCategory === "all" 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const liveVideos = videos.filter(video => video.isLive);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sermon':
        return 'bg-[hsl(262,83%,58%)]';
      case 'teaching':
        return 'bg-[hsl(43,96%,56%)]';
      case 'testimony':
        return 'bg-[hsl(25,95%,53%)]';
      case 'worship':
        return 'bg-green-600';
      case 'youth':
        return 'bg-blue-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getYoutubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[hsl(262,83%,58%)] mb-4">
            Vídeos e Transmissões
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Assista nossos cultos, mensagens e testemunhos onde e quando quiser
          </p>
        </div>

        {/* Live Section */}
        {liveVideos.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <Radio className="h-6 w-6 text-red-500 animate-pulse mr-2" />
              <h2 className="text-2xl font-bold text-red-500">AO VIVO AGORA</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {liveVideos.map((video) => (
                <Card key={video.id} className="border-red-500 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative">
                      <img
                        src={video.thumbnailUrl || getYoutubeThumbnail(video.youtubeId)}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-pulse">
                        AO VIVO
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-[hsl(262,83%,58%)]">
                      {video.title}
                    </CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Assistir Agora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-[hsl(262,83%,58%)]" : ""}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Selected Video Player */}
        {selectedVideo && (
          <div className="mb-12">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-t-lg"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[hsl(262,83%,58%)] mb-2">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {selectedVideo.speaker && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {selectedVideo.speaker}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(selectedVideo.date)}
                    </div>
                    {selectedVideo.duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedVideo.duration}
                      </div>
                    )}
                    {selectedVideo.viewCount > 0 && (
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {selectedVideo.viewCount} visualizações
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Video Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[hsl(262,83%,58%)] mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando vídeos...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.filter(v => !v.isLive).map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedVideo(video)}>
                <CardHeader>
                  <div className="relative">
                    <img
                      src={video.thumbnailUrl || getYoutubeThumbnail(video.youtubeId)}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&w=400&h=300&auto=format&fit=crop';
                      }}
                    />
                    <Badge className={`absolute top-2 right-2 ${getCategoryColor(video.category)} text-white`}>
                      {video.category}
                    </Badge>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-[hsl(262,83%,58%)] line-clamp-2">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      {video.speaker && (
                        <>
                          <User className="h-4 w-4 mr-1" />
                          {video.speaker}
                        </>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(video.date)}
                    </div>
                  </div>
                  {video.duration && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {video.duration}
                    </div>
                  )}
                  {video.viewCount > 0 && (
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {video.viewCount} visualizações
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredVideos.filter(v => !v.isLive).length === 0 && !isLoading && (
          <div className="text-center py-12">
            <PlayCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              Nenhum vídeo encontrado nesta categoria
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}