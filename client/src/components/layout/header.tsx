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
                  <a href="/#visao">Nossa Visão</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="/#missao">Nossa Missão</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="/#cremos">O que Cremos</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/events"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Eventos
            </Link>
            <Link
              href="/blog"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/videos"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Vídeos
            </Link>
            <Link
              href="/donations"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Doações
            </Link>
            <a
              href="/#contato"
              className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
            >
              Contato
            </a>
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
              <a
                href="#inicio"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
              >
                Início
              </a>
              <a
                href="#visao"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
              >
                Nossa Visão
              </a>
              <a
                href="#missao"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
              >
                Nossa Missão
              </a>
              <a
                href="#cremos"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
              >
                O que Cremos
              </a>
              <a
                href="#servicos"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
              >
                Serviços
              </a>
              <a
                href="#ensinos"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
              >
                Ensinos
              </a>
              <a
                href="#eventos"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
              >
                Eventos e Blogs
              </a>
              <a
                href="#contato"
                className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
              >
                Contato
              </a>
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
