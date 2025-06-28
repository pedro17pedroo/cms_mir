import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-[hsl(43,96%,56%)] text-white px-3 py-2 rounded font-bold text-lg">
              MIR
            </div>
            <span className="text-[hsl(210,11%,15%)] font-medium hidden sm:block">
              Ministério Internacional
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Início
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium flex items-center">
                Sobre <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/about">Ministério</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/about">No que Cremos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/about">Presidente do MIR</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/services"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Serviços
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium flex items-center">
                Ensino <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/teachings">Áudio</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/teachings">Vídeo</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium flex items-center">
                Plataforma de ensino <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/events">Conferência da Fé</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/events">Escola de Fundação</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/events">Conferência de Ministros</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/events">Conferência de Mulheres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/events">Conferência dos Jovens</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/events">Mulheres Transformadas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/events">Reis e Sacerdotes</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/events"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Eventos e Blogs
            </Link>
            
            <Link
              href="/contact"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Contacto
            </Link>
            
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </Link>
              
              <div className="space-y-2">
                <div className="font-medium text-[hsl(210,11%,15%)]">Sobre</div>
                <div className="pl-4 space-y-2">
                  <Link href="/about" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Ministério
                  </Link>
                  <Link href="/about" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    No que Cremos
                  </Link>
                  <Link href="/about" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Presidente do MIR
                  </Link>
                </div>
              </div>

              <Link
                href="/services"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Serviços
              </Link>

              <div className="space-y-2">
                <div className="font-medium text-[hsl(210,11%,15%)]">Ensino</div>
                <div className="pl-4 space-y-2">
                  <Link href="/teachings" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Áudio
                  </Link>
                  <Link href="/teachings" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Vídeo
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-[hsl(210,11%,15%)]">Plataforma de ensino</div>
                <div className="pl-4 space-y-2">
                  <Link href="/events" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Conferência da Fé
                  </Link>
                  <Link href="/events" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Escola de Fundação
                  </Link>
                  <Link href="/events" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Conferência de Ministros
                  </Link>
                  <Link href="/events" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Conferência de Mulheres
                  </Link>
                  <Link href="/events" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Conferência dos Jovens
                  </Link>
                  <Link href="/events" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Mulheres Transformadas
                  </Link>
                  <Link href="/events" className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]" onClick={() => setIsMobileMenuOpen(false)}>
                    Reis e Sacerdotes
                  </Link>
                </div>
              </div>

              <Link
                href="/events"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Eventos e Blogs
              </Link>
              
              <Link
                href="/contact"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              
              <Link href="/admin">
                <Button variant="outline" size="sm" className="w-full">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
