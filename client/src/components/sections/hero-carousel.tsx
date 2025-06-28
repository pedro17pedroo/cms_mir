import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, Play } from "lucide-react";
import type { HeroSlide } from "@shared/schema";

export default function HeroCarousel() {
  const { data: slides, isLoading } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides"],
  });

  if (isLoading) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 animate-pulse">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl">
            <div className="h-8 bg-white/20 rounded w-64 mb-6"></div>
            <div className="h-16 bg-white/20 rounded w-full mb-6"></div>
            <div className="h-6 bg-white/20 rounded w-3/4 mb-8"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-white/20 rounded w-32"></div>
              <div className="h-12 bg-white/20 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const activeSlide = slides?.[0]; // Using first slide for now

  if (!activeSlide) {
    return (
      <section className="relative h-[600px] bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Bem-vindos ao Ministério Internacional Renascer</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${activeSlide.backgroundImage}')` }}
      ></div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <motion.div 
          className="max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="bg-[hsl(43,96%,56%)] text-white px-4 py-2 rounded-full inline-flex items-center gap-2 mb-6 font-semibold">
              <Calendar className="h-4 w-4" />
              Próximo Evento: 28 de Junho, 2025
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {activeSlide.title}
          </motion.h1>

          <motion.p 
            className="text-xl lg:text-2xl mb-8 text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {activeSlide.description}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button 
              className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              {activeSlide.buttonText}
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              size="lg"
            >
              Saiba Mais
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
        <div className="w-3 h-3 bg-white rounded-full"></div>
        <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
      </div>
    </section>
  );
}
