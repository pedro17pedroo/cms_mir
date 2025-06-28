import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageCircle,
  Share2,
  ExternalLink
} from "lucide-react";

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/igreja",
    description: "Acompanhe nossas atividades",
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/igreja",
    description: "Fotos e momentos especiais",
    color: "bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/igreja",
    description: "Cultos e ensinamentos",
    color: "bg-red-600 hover:bg-red-700"
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    url: "https://wa.me/5511999999999",
    description: "Fale conosco diretamente",
    color: "bg-green-600 hover:bg-green-700"
  }
];

interface SocialMediaProps {
  showShareButtons?: boolean;
  title?: string;
  url?: string;
}

export default function SocialMedia({ showShareButtons = false, title, url }: SocialMediaProps) {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || "Confira este conteúdo da nossa igreja";

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = `${shareTitle} - ${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (showShareButtons) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 mr-2">Compartilhar:</span>
        <Button
          size="sm"
          variant="outline"
          onClick={shareOnFacebook}
          className="h-8 w-8 p-0"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={shareOnWhatsApp}
          className="h-8 w-8 p-0"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-purple-600 rounded-full">
              <Share2 className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conecte-se Conosco
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Siga nossas redes sociais e mantenha-se conectado com nossa comunidade. 
            Compartilhe momentos especiais e receba inspiração diária.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialLinks.map((social, index) => (
            <motion.div
              key={social.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-full ${social.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <social.icon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {social.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {social.description}
                  </p>
                  
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-gray-50"
                    onClick={() => window.open(social.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Seguir
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feed de Instagram simulado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Últimas do Instagram
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg overflow-hidden group cursor-pointer"
              >
                <div className="w-full h-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => window.open('https://instagram.com/igreja', '_blank')}
            >
              <Instagram className="h-4 w-4 mr-2" />
              Ver todas as fotos
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}