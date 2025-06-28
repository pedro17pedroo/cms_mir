import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, ArrowRight } from "lucide-react";
import type { Message } from "@shared/schema";

export default function LatestMessages() {
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const { data: featuredMessage } = useQuery<Message>({
    queryKey: ["/api/messages/featured"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white" id="mensagens">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>
          <div className="mb-12">
            <div className="lg:flex items-center gap-12 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-3xl p-8 lg:p-12 animate-pulse">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <div className="w-full h-80 bg-gray-300 rounded-2xl"></div>
              </div>
              <div className="lg:w-1/2 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white" id="mensagens">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(210,11%,15%)] mb-4">
            Últimas Mensagens e Atualizações da Igreja
          </h2>
          <div className="w-24 h-1 bg-[hsl(43,96%,56%)] mx-auto"></div>
        </motion.div>

        {/* Featured Message */}
        {featuredMessage && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="lg:flex items-center gap-12 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-3xl p-8 lg:p-12">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <div className="relative rounded-2xl overflow-hidden">
                  <img 
                    src={featuredMessage.imageUrl} 
                    alt={featuredMessage.title}
                    className="w-full h-80 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-[hsl(13,85%,69%)] text-white">
                    {featuredMessage.category}
                  </Badge>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <button className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                      <Play className="text-[hsl(210,11%,15%)] h-6 w-6 ml-1" />
                    </div>
                  </button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-2xl lg:text-3xl font-bold text-[hsl(210,11%,15%)] mb-4">
                  {featuredMessage.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {featuredMessage.description}
                </p>
                <Button className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)] text-white font-semibold">
                  VER TODOS <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Messages Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {messages?.slice(0, 3).map((message, index) => (
            <motion.div 
              key={message.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="relative">
                <img 
                  src={message.imageUrl} 
                  alt={message.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-[hsl(13,85%,69%)] text-white">
                  {message.category}
                </Badge>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-[hsl(210,11%,15%)] mb-3">
                  {message.title}
                </h4>
                <p className="text-gray-600 mb-4">
                  {message.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{message.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
