import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Church, Book, Heart, Clock } from "lucide-react";
import type { ServiceSchedule } from "@shared/schema";

const iconMap = {
  "fas fa-church": Church,
  "fas fa-book": Book,
  "fas fa-praying-hands": Heart,
};

export default function ServiceSchedule() {
  const { data: schedules, isLoading } = useQuery<ServiceSchedule[]>({
    queryKey: ["/api/service-schedules"],
  });

  if (isLoading) {
    return (
      <section className="py-16 church-gradient-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="h-8 bg-white/20 rounded w-48 mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-effect rounded-2xl p-8 text-center animate-pulse">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-6"></div>
                <div className="h-6 bg-white/20 rounded w-24 mx-auto mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-32 mx-auto mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-28 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 church-gradient-dark text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" 
        }}
      ></div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nossos Cultos</h2>
          <p className="text-gray-300 text-lg">
            Junte-se a nós nos nossos momentos de adoração e comunhão
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {schedules?.map((schedule, index) => {
            const IconComponent = iconMap[schedule.icon as keyof typeof iconMap] || Church;
            
            return (
              <motion.div 
                key={schedule.id}
                className="glass-effect rounded-2xl p-8 text-center hover:bg-white/20 transition-all transform hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="w-16 h-16 bg-[hsl(43,96%,56%)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="text-white h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{schedule.day}</h3>
                <p className="text-gray-300 mb-4">{schedule.description}</p>
                <div className="flex items-center justify-center text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{schedule.time}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
