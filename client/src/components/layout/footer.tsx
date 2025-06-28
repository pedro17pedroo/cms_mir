import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Newsletter",
        description: "Obrigado por se inscrever em nossa newsletter!",
      });
      setEmail("");
    }
  };

  return (
    <footer className="bg-[hsl(210,11%,15%)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Contact */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-[hsl(43,96%,56%)] text-white px-3 py-2 rounded font-bold text-lg">
                MIR
              </div>
              <span className="font-medium">Ministério Internacional</span>
            </div>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">Kingston, New York 12401 United States</p>
              <p className="text-sm">*******@famtech.com</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-[hsl(43,96%,56%)] transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(43,96%,56%)] transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(43,96%,56%)] transition-colors">
                <i className="fab fa-google text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(43,96%,56%)] transition-colors">
                <i className="fab fa-pinterest text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(43,96%,56%)] transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(43,96%,56%)] transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
            </div>
          </div>

          {/* Links Principais */}
          <div>
            <h4 className="font-bold text-lg mb-4">Links Principais</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Serviços</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Eventos e Blogs</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Áudio</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Vídeo</a></li>
            </ul>
          </div>

          {/* Sobre Nós */}
          <div>
            <h4 className="font-bold text-lg mb-4">Sobre Nós</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Ministério</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">No que Cremos</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Presidente do MIR</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Nossos Líderes</a></li>
            </ul>
          </div>

          {/* Conferências */}
          <div>
            <h4 className="font-bold text-lg mb-4">Conferências</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Conferência de Fé</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Escola de Fundação</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Conferência de Ministros</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Conferência de Mulheres</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Conferência dos Jovens</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Mulheres Transformadas</a></li>
              <li><a href="#" className="hover:text-[hsl(43,96%,56%)] transition-colors">Reis e Sacerdotes</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter and Contact */}
        <div className="border-t border-gray-700 pt-8">
          <div className="lg:flex items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h4 className="font-bold text-lg mb-2">NEWSLETTER</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-gray-800 text-white border-gray-600 focus:border-[hsl(43,96%,56%)]"
                />
                <Button
                  type="submit"
                  className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)] text-white ml-2"
                >
                  Submit
                </Button>
              </form>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
                <i className="fas fa-phone mr-2"></i>
                <span>Linha Direta +8801xxxxxxxx</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400">&copy; mir2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
