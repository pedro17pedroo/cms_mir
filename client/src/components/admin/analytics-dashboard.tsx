import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar,
  MessageSquare,
  Heart,
  Target,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    pageViews: number;
    avgSessionDuration: string;
    bounceRate: number;
    growthRate: number;
  };
  content: {
    topPages: Array<{ page: string; views: number; change: number }>;
    topBlogPosts: Array<{ title: string; views: number; engagement: number }>;
    topVideos: Array<{ title: string; views: number; duration: string }>;
  };
  engagement: {
    newsletterSubscribers: number;
    eventRegistrations: number;
    totalDonations: string;
    socialShares: number;
  };
  demographics: {
    topCities: Array<{ city: string; visitors: number; percentage: number }>;
    deviceTypes: Array<{ device: string; percentage: number }>;
    ageGroups: Array<{ group: string; percentage: number }>;
  };
  realTime: {
    activeUsers: number;
    liveStreamViewers: number;
    currentlyReading: Array<{ page: string; readers: number }>;
  };
}

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Simular dados de analytics - em produção viria do Google Analytics
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics", selectedPeriod],
    queryFn: async (): Promise<AnalyticsData> => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        overview: {
          totalVisitors: 2847,
          pageViews: 8934,
          avgSessionDuration: "3m 24s",
          bounceRate: 32.5,
          growthRate: 15.7
        },
        content: {
          topPages: [
            { page: "/", views: 3245, change: 12.5 },
            { page: "/eventos", views: 1876, change: 8.3 },
            { page: "/videos", views: 1432, change: -2.1 },
            { page: "/blog", views: 987, change: 22.4 },
            { page: "/doacoes", views: 743, change: 5.7 }
          ],
          topBlogPosts: [
            { title: "O Poder da Oração na Vida Cristã", views: 1245, engagement: 87 },
            { title: "Vivendo em Comunidade", views: 967, engagement: 92 },
            { title: "Fé e Esperança nos Tempos Difíceis", views: 834, engagement: 78 }
          ],
          topVideos: [
            { title: "Culto Domingo - Transformação", views: 2156, duration: "1h 23m" },
            { title: "Estudo Bíblico - Parábolas", views: 1543, duration: "45m" },
            { title: "Conferência de Fé 2025", views: 1287, duration: "2h 15m" }
          ]
        },
        engagement: {
          newsletterSubscribers: 1834,
          eventRegistrations: 456,
          totalDonations: "R$ 47.892",
          socialShares: 2341
        },
        demographics: {
          topCities: [
            { city: "São Paulo", visitors: 1234, percentage: 43.4 },
            { city: "Rio de Janeiro", visitors: 567, percentage: 19.9 },
            { city: "Belo Horizonte", visitors: 345, percentage: 12.1 },
            { city: "Salvador", visitors: 234, percentage: 8.2 },
            { city: "Outras", visitors: 467, percentage: 16.4 }
          ],
          deviceTypes: [
            { device: "Mobile", percentage: 67.8 },
            { device: "Desktop", percentage: 24.7 },
            { device: "Tablet", percentage: 7.5 }
          ],
          ageGroups: [
            { group: "25-34", percentage: 32.1 },
            { group: "35-44", percentage: 28.5 },
            { group: "45-54", percentage: 22.3 },
            { group: "18-24", percentage: 12.4 },
            { group: "55+", percentage: 4.7 }
          ]
        },
        realTime: {
          activeUsers: 45,
          liveStreamViewers: 12,
          currentlyReading: [
            { page: "Home", readers: 23 },
            { page: "Eventos", readers: 12 },
            { page: "Blog", readers: 8 },
            { page: "Vídeos", readers: 2 }
          ]
        }
      };
    }
  });

  const periods = [
    { value: '24h', label: 'Últimas 24h' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 3 meses' }
  ];

  const tabs = [
    { value: 'overview', label: 'Visão Geral', icon: BarChart },
    { value: 'content', label: 'Conteúdo', icon: MessageSquare },
    { value: 'engagement', label: 'Engajamento', icon: Heart },
    { value: 'demographics', label: 'Demografia', icon: Users }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-600">Acompanhe o desempenho do seu site</p>
        </div>

        <div className="flex gap-2">
          {periods.map(period => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas em Tempo Real */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{analytics.realTime.activeUsers}</p>
              <p className="text-sm text-green-700">Usuários Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{analytics.realTime.liveStreamViewers}</p>
              <p className="text-sm text-green-700">Assistindo Live</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {analytics.realTime.currentlyReading.reduce((sum, item) => sum + item.readers, 0)}
              </p>
              <p className="text-sm text-green-700">Lendo Conteúdo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-green-700">Site Operacional</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegação por Abas */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <Button
            key={tab.value}
            variant={selectedTab === tab.value ? "default" : "outline"}
            onClick={() => setSelectedTab(tab.value)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Conteúdo das Abas */}
      {selectedTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* KPIs Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Visitantes</p>
                    <p className="text-3xl font-bold">{analytics.overview.totalVisitors.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{analytics.overview.growthRate}%
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Visualizações</p>
                    <p className="text-3xl font-bold">{analytics.overview.pageViews.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{analytics.overview.avgSessionDuration} por sessão</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Rejeição</p>
                    <p className="text-3xl font-bold">{analytics.overview.bounceRate}%</p>
                    <p className="text-sm text-gray-600">Meta: {"<"}30%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Engajamento</p>
                    <p className="text-3xl font-bold">{analytics.engagement.socialShares}</p>
                    <p className="text-sm text-gray-600">Compartilhamentos</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Páginas Mais Visitadas */}
          <Card>
            <CardHeader>
              <CardTitle>Páginas Mais Visitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.content.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{page.page}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{page.views.toLocaleString()} visualizações</span>
                      <Badge className={page.change > 0 ? 'bg-green-500' : 'bg-red-500'}>
                        {page.change > 0 ? '+' : ''}{page.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {selectedTab === 'content' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Blog Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Posts Mais Lidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.content.topBlogPosts.map((post, index) => (
                    <div key={post.title} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
                        <Badge variant="secondary">{post.engagement}% engajamento</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{post.views.toLocaleString()} visualizações</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Videos */}
            <Card>
              <CardHeader>
                <CardTitle>Vídeos Mais Assistidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.content.topVideos.map((video, index) => (
                    <div key={video.title} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                        <Badge variant="secondary">{video.duration}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{video.views.toLocaleString()} visualizações</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {selectedTab === 'engagement' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.engagement.eventRegistrations}</p>
                <p className="text-sm text-gray-600">Inscrições em Eventos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.engagement.newsletterSubscribers}</p>
                <p className="text-sm text-gray-600">Assinantes Newsletter</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.engagement.totalDonations}</p>
                <p className="text-sm text-gray-600">Total de Doações</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.engagement.socialShares}</p>
                <p className="text-sm text-gray-600">Compartilhamentos</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {selectedTab === 'demographics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Cities */}
            <Card>
              <CardHeader>
                <CardTitle>Principais Cidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.demographics.topCities.map((city) => (
                    <div key={city.city} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{city.city}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{city.visitors}</span>
                        <Badge variant="secondary">{city.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Dispositivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.demographics.deviceTypes.map((device) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{device.device}</span>
                      <Badge variant="secondary">{device.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Age Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Faixas Etárias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.demographics.ageGroups.map((group) => (
                    <div key={group.group} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{group.group} anos</span>
                      <Badge variant="secondary">{group.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}