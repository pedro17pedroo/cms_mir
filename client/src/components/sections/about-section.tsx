import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, Flag, Users } from "lucide-react";
import type { AboutContent } from "@shared/schema";

const iconMap = {
  "fas fa-eye": Eye,
  "fas fa-flag": Flag,
  "fas fa-users": Users,
};

export default function AboutSection() {
  const { data: aboutContent, isLoading } = useQuery<AboutContent[]>({
    queryKey: ["/api/about-content"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-[hsl(210,20%,98%)]" id="sobre">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[hsl(210,20%,98%)]" id="sobre">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(210,11%,15%)] mb-4">
            JESUS CRISTO É O SENHOR
          </h2>
          <div className="w-24 h-1 bg-[hsl(43,96%,56%)] mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {aboutContent?.map((content, index) => {
            const IconComponent = iconMap[content.icon as keyof typeof iconMap] || Eye;
            
            return (
              <motion.div 
                key={content.id}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group-hover:scale-105 transform transition-transform duration-300">
                  <div className="w-16 h-16 bg-[hsl(43,96%,56%)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="text-white text-2xl h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[hsl(210,11%,15%)] mb-4">
                    {content.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {content.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
