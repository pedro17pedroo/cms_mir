import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { BibleVerse } from "@shared/schema";

export default function BibleVerseSection() {
  const { data: bibleVerse, isLoading } = useQuery<BibleVerse>({
    queryKey: ["/api/bible-verse"],
  });

  if (isLoading) {
    return (
      <section className="py-20 church-gradient-secondary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded mx-auto mb-8"></div>
            <div className="h-8 bg-white/20 rounded w-3/4 mx-auto mb-8"></div>
            <div className="h-6 bg-white/20 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!bibleVerse) {
    return null;
  }

  return (
    <section className="py-20 church-gradient-secondary text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          backgroundImage: `url('${bibleVerse.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      <div className="container mx-auto px-4 text-center relative">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Quote className="text-6xl text-[hsl(43,96%,56%)] mb-8 opacity-80 mx-auto" />
          </motion.div>
          
          <motion.blockquote 
            className="text-3xl lg:text-4xl font-bold mb-8 leading-relaxed text-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            "{bibleVerse.verse}"
          </motion.blockquote>
          
          <motion.cite 
            className="text-xl text-purple-200 font-medium"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {bibleVerse.reference}
          </motion.cite>
        </motion.div>
      </div>
    </section>
  );
}
