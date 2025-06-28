import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subscribeMutation = useMutation({
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
        description: "Você receberá nossas novidades em breve.",
      });
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter-subscribers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao se inscrever",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeMutation.mutate(email.trim());
  };

  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-700 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/10 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Receba Nossas Novidades
          </h2>
          
          <p className="text-lg text-purple-100 mb-8">
            Inscreva-se em nossa newsletter e receba mensagens inspiradoras, 
            eventos especiais e atualizações da nossa comunidade.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20"
              required
            />
            <Button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)] text-black font-semibold px-6"
            >
              {subscribeMutation.isPending ? (
                "Inscrevendo..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Inscrever
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}