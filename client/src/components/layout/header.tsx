import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type MenuItem } from "@shared/schema";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Organize menu items into hierarchy
  const organizeMenuItems = (items: MenuItem[]) => {
    const parentItems = items.filter(item => !item.parentId && item.isActive);
    const childItems = items.filter(item => item.parentId && item.isActive);
    
    return parentItems
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(parent => ({
        ...parent,
        children: childItems
          .filter(child => child.parentId === parent.id)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      }));
  };

  const organizedMenuItems = organizeMenuItems(menuItems);

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
            {organizedMenuItems.map((item) => (
              item.children && item.children.length > 0 ? (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium flex items-center">
                    {item.title} <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.id}>
                        <Link href={child.url}>{child.title}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.id}
                  href={item.url}
                  className="text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] transition-colors font-medium"
                >
                  {item.title}
                </Link>
              )
            ))}
            
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
              {organizedMenuItems.map((item) => (
                item.children && item.children.length > 0 ? (
                  <div key={item.id} className="space-y-2">
                    <div className="font-medium text-[hsl(210,11%,15%)]">{item.title}</div>
                    <div className="pl-4 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          className="block text-sm text-gray-600 hover:text-[hsl(43,96%,56%)]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="block text-[hsl(210,11%,15%)] hover:text-[hsl(43,96%,56%)] font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )
              ))}
              
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
