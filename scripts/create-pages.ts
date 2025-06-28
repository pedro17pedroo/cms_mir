import fs from 'fs';
import path from 'path';

// Page template function
const createPageTemplate = (title: string, description: string, sectionTitle?: string) => `
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/sobre">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[hsl(210,11%,15%)] mb-6">
              ${title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ${description}
            </p>
          </div>

          {/* Content */}
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-center">${sectionTitle || title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-700">
                  Esta página está sendo desenvolvida para oferecer conteúdo relevante sobre ${title.toLowerCase()}.
                  Em breve teremos informações detalhadas e recursos específicos disponíveis.
                </p>
                
                <p className="text-lg text-gray-700">
                  ${description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
`;

// Pages to create
const pages = [
  // Sobre pages
  { path: 'client/src/pages/sobre/cremos.tsx', title: 'No que Cremos', description: 'Conheça as nossas crenças fundamentais baseadas na Palavra de Deus.' },
  { path: 'client/src/pages/sobre/presidente.tsx', title: 'Presidente do MIR', description: 'Conheça o líder e fundador do Ministério Internacional de Restauração.' },
  
  // Ensino pages
  { path: 'client/src/pages/ensino/audio.tsx', title: 'Ensinos em Audio', description: 'Acesse nossa biblioteca de mensagens e estudos bíblicos em formato de áudio.' },
  { path: 'client/src/pages/ensino/video.tsx', title: 'Ensinos em Video', description: 'Assista aos nossos vídeos de ensino, pregações e estudos bíblicos.' },
  
  // Plataforma de ensino pages
  { path: 'client/src/pages/plataforma-ensino/index.tsx', title: 'Plataforma de Ensino', description: 'Acesse cursos, conferências e materiais educacionais do MIR.' },
  { path: 'client/src/pages/plataforma-ensino/conferencia-fe.tsx', title: 'Conferência da Fé', description: 'Participe da nossa conferência anual focada no fortalecimento da fé.' },
  { path: 'client/src/pages/plataforma-ensino/escola-fundacao.tsx', title: 'Escola de Fundação', description: 'Curso fundamental para novos convertidos e membros da igreja.' },
  { path: 'client/src/pages/plataforma-ensino/conferencia-ministros.tsx', title: 'Conferência de Ministros', description: 'Evento dedicado ao treinamento e capacitação de líderes ministeriais.' },
  { path: 'client/src/pages/plataforma-ensino/conferencia-mulheres.tsx', title: 'Conferência de Mulheres', description: 'Encontro especial para mulheres, focado em crescimento espiritual e propósito.' },
  { path: 'client/src/pages/plataforma-ensino/conferencia-jovens.tsx', title: 'Conferência dos Jovens', description: 'Evento voltado para jovens, com foco em identidade e chamado cristão.' },
  { path: 'client/src/pages/plataforma-ensino/mulheres-transformadas.tsx', title: 'Mulheres Transformadas', description: 'Ministério dedicado ao empoderamento e transformação de mulheres através de Cristo.' },
  { path: 'client/src/pages/plataforma-ensino/reis-sacerdotes.tsx', title: 'Reis e Sacerdotes', description: 'Curso sobre liderança cristã e o chamado real e sacerdotal dos crentes.' },
  
  // Eventos e Blogs
  { path: 'client/src/pages/eventos-blogs.tsx', title: 'Eventos e Blogs', description: 'Fique por dentro dos nossos eventos e leia os artigos mais recentes do nosso blog.' }
];

// Create pages
function createPages() {
  console.log('Creating missing pages...');
  
  pages.forEach(({ path: filePath, title, description }) => {
    const dir = path.dirname(filePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create page file
    const content = createPageTemplate(title, description);
    fs.writeFileSync(filePath, content.trim());
    console.log(`Created: ${filePath}`);
  });
  
  console.log('All pages created successfully!');
}

createPages();