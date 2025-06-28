import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const testimonialsPerPage = 2;
  const totalPages = Math.ceil((testimonials?.length || 0) / testimonialsPerPage);

  const currentTestimonials = testimonials?.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-[hsl(210,20%,98%)]" id="testemunhos">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg text-center animate-pulse">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[hsl(210,20%,98%)]" id="testemunhos">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(262,83%,58%)] mb-4">
            TESTEMUNHOS DE FÉ
          </h2>
          <div className="w-24 h-1 bg-[hsl(262,83%,58%)] mx-auto"></div>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {currentTestimonials?.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[hsl(262,83%,58%)]">
                  <span className="text-2xl font-bold text-[hsl(262,83%,58%)]">
                    {testimonial.initial}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-[hsl(262,83%,58%)] mb-2">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {testimonial.location}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {testimonial.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Navigation Controls */}
          <motion.div 
            className="flex items-center justify-center mt-12 space-x-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={prevPage}
              className="w-12 h-12 bg-[hsl(262,83%,58%)] text-white rounded-full flex items-center justify-center hover:bg-[hsl(262,83%,48%)] transition-colors"
              size="icon"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Ver Todos
            </Button>
            
            <Button
              onClick={nextPage}
              className="w-12 h-12 bg-[hsl(262,83%,58%)] text-white rounded-full flex items-center justify-center hover:bg-[hsl(262,83%,48%)] transition-colors"
              size="icon"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
