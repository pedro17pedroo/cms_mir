import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Events from "@/pages/events";
import Blog from "@/pages/blog";
import Videos from "@/pages/videos";
import Donations from "@/pages/donations";
import About from "@/pages/about";
import Services from "@/pages/services";
import Teachings from "@/pages/teachings";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

// Import new pages
import SobreMinisterio from "@/pages/sobre/ministerio";
import SobreCremos from "@/pages/sobre/cremos";
import SobrePresidente from "@/pages/sobre/presidente";
import EnsinoAudio from "@/pages/ensino/audio";
import EnsinoVideo from "@/pages/ensino/video";
import PlataformaEnsino from "@/pages/plataforma-ensino/index";
import EventosBlogs from "@/pages/eventos-blogs";

// Temporary placeholder for remaining pages
function TemporaryPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600">Esta página está sendo construída.</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      
      {/* Sobre pages */}
      <Route path="/sobre" component={About} />
      <Route path="/sobre/ministerio" component={SobreMinisterio} />
      <Route path="/sobre/cremos" component={SobreCremos} />
      <Route path="/sobre/presidente" component={SobrePresidente} />
      
      <Route path="/servicos" component={Services} />
      
      {/* Ensino pages */}
      <Route path="/ensino" component={Teachings} />
      <Route path="/ensino/audio" component={EnsinoAudio} />
      <Route path="/ensino/video" component={EnsinoVideo} />
      
      {/* Plataforma de ensino pages */}
      <Route path="/plataforma-ensino" component={PlataformaEnsino} />
      <Route path="/plataforma-ensino/conferencia-fe" component={() => <TemporaryPage title="Conferência da Fé" />} />
      <Route path="/plataforma-ensino/escola-fundacao" component={() => <TemporaryPage title="Escola de Fundação" />} />
      <Route path="/plataforma-ensino/conferencia-ministros" component={() => <TemporaryPage title="Conferência de Ministros" />} />
      <Route path="/plataforma-ensino/conferencia-mulheres" component={() => <TemporaryPage title="Conferência de Mulheres" />} />
      <Route path="/plataforma-ensino/conferencia-jovens" component={() => <TemporaryPage title="Conferência dos Jovens" />} />
      <Route path="/plataforma-ensino/mulheres-transformadas" component={() => <TemporaryPage title="Mulheres Transformadas" />} />
      <Route path="/plataforma-ensino/reis-sacerdotes" component={() => <TemporaryPage title="Reis e Sacerdotes" />} />
      
      <Route path="/eventos" component={Events} />
      <Route path="/eventos-blogs" component={EventosBlogs} />
      <Route path="/blog" component={Blog} />
      <Route path="/videos" component={Videos} />
      <Route path="/doacoes" component={Donations} />
      <Route path="/contato" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
