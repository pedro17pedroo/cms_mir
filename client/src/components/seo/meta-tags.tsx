import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export default function MetaTags({
  title = "Igreja Comunidade de Fé - Transformando Vidas",
  description = "Descubra uma comunidade acolhedora onde a fé cresce e vidas são transformadas através do amor de Cristo. Junte-se a nós para cultos, estudos bíblicos e eventos especiais.",
  keywords = "igreja, fé, cristo, comunidade, culto, oração, bíblia, esperança, amor, transformação, deus, jesus",
  image = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=1200&h=630&auto=format&fit=crop",
  url,
  type = "website",
  siteName = "Igreja Comunidade de Fé"
}: MetaTagsProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Get current URL if not provided
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    // Define meta tags to update
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: siteName },
      { name: 'robots', content: 'index, follow' },
      { name: 'language', content: 'pt-BR' },
      
      // Open Graph / Facebook
      { property: 'og:type', content: type },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: currentUrl },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: 'pt_BR' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      
      // Additional SEO
      { name: 'theme-color', content: '#8B5CF6' }, // Purple color from the theme
      { name: 'msapplication-TileColor', content: '#8B5CF6' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: siteName },
      
      // Geo tags for local SEO
      { name: 'geo.region', content: 'BR' },
      { name: 'geo.placename', content: 'Brasil' },
      { name: 'ICBM', content: '-23.5505,-46.6333' }, // São Paulo coordinates as example
    ];

    // Update or create meta tags
    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (meta) {
        meta.content = content;
      } else {
        meta = document.createElement('meta');
        if (name) meta.name = name;
        if (property) meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Add structured data for local business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Church",
      "name": siteName,
      "description": description,
      "url": currentUrl,
      "image": image,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BR",
        "addressLocality": "São Paulo"
      },
      "telephone": "+55 11 9999-9999",
      "email": "contato@igrejacomunidadedeffe.com",
      "openingHours": [
        "Su 09:00-12:00", // Sunday service
        "We 19:30-21:00", // Wednesday bible study
        "Fr 19:00-20:30"  // Friday prayer
      ],
      "sameAs": [
        "https://facebook.com/igrejacomunidade",
        "https://instagram.com/igrejacomunidade",
        "https://youtube.com/igrejacomunidade"
      ]
    };

    // Add or update structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(structuredDataScript);
    }

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = currentUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = currentUrl;
      document.head.appendChild(canonical);
    }

  }, [title, description, keywords, image, url, type, siteName]);

  return null; // This component doesn't render anything
}

// Helper function to generate page-specific meta tags
export function generatePageMeta(page: string, customData?: Partial<MetaTagsProps>): MetaTagsProps {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const pageMetas: Record<string, MetaTagsProps> = {
    home: {
      title: "Igreja Comunidade de Fé - Transformando Vidas através do Amor de Cristo",
      description: "Descubra uma comunidade acolhedora onde a fé cresce e vidas são transformadas. Junte-se a nós para cultos, estudos bíblicos e eventos especiais.",
      url: baseUrl,
    },
    eventos: {
      title: "Eventos - Igreja Comunidade de Fé",
      description: "Participe dos nossos eventos especiais: conferências, retiros, cultos especiais e atividades comunitárias. Faça parte desta família de fé.",
      url: `${baseUrl}/eventos`,
      keywords: "eventos igreja, conferência fé, retiro cristão, cultos especiais, atividades igreja"
    },
    blog: {
      title: "Blog - Mensagens e Reflexões | Igreja Comunidade de Fé",
      description: "Leia nossas mensagens inspiradoras, reflexões bíblicas e artigos sobre fé, esperança e vida cristã. Alimente sua alma com a Palavra de Deus.",
      url: `${baseUrl}/blog`,
      keywords: "blog cristão, mensagens bíblicas, reflexões fé, artigos cristãos, palavra de deus"
    },
    videos: {
      title: "Vídeos - Cultos e Ensinamentos | Igreja Comunidade de Fé",
      description: "Assista aos nossos cultos ao vivo, ensinamentos bíblicos e mensagens especiais. Conecte-se conosco através da palavra de Deus.",
      url: `${baseUrl}/videos`,
      keywords: "cultos online, vídeos igreja, ensinamentos bíblicos, live streaming, youtube igreja"
    },
    doacoes: {
      title: "Doações - Apoie nossa Missão | Igreja Comunidade de Fé",
      description: "Contribua com nossa missão de transformar vidas e abençoar nossa comunidade. Sua doação faz a diferença no Reino de Deus.",
      url: `${baseUrl}/doacoes`,
      keywords: "doações igreja, contribuição, dízimo, ofertas, apoio missionário"
    },
    admin: {
      title: "Painel Administrativo - Igreja Comunidade de Fé",
      description: "Acesso restrito para administradores da igreja. Gerencie conteúdo, eventos e configurações do sistema.",
      url: `${baseUrl}/admin`,
    }
  };

  return {
    ...pageMetas[page],
    ...customData
  };
}