import { db } from "../server/db";
import { 
  users, heroSlides, aboutContent, serviceSchedules, messages, 
  testimonials, bibleVerse, siteSettings, events, blogPosts, 
  donations, donationCampaigns, videos, newsletterSubscribers, 
  eventRegistrations, blogComments, pages, menuItems, landingPageSections,
  contentBlocks, headerConfig, footerConfig
} from "../shared/schema";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await db.delete(blogComments);
    await db.delete(eventRegistrations);
    await db.delete(donations);
    await db.delete(donationCampaigns);
    await db.delete(newsletterSubscribers);
    await db.delete(videos);
    await db.delete(blogPosts);
    await db.delete(events);
    await db.delete(testimonials);
    await db.delete(messages);
    await db.delete(serviceSchedules);
    await db.delete(aboutContent);
    await db.delete(heroSlides);
    await db.delete(bibleVerse);
    await db.delete(siteSettings);
    await db.delete(footerConfig);
    await db.delete(headerConfig);
    await db.delete(contentBlocks);
    await db.delete(landingPageSections);
    await db.delete(menuItems);
    await db.delete(pages);
    await db.delete(users);

    // 1. Create Admin User
    console.log("👤 Creating admin user...");
    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: "admin123" // In production, this should be properly hashed
    }).returning();

    // 2. Create Hero Slides
    console.log("🖼️ Creating hero slides...");
    await db.insert(heroSlides).values([
      {
        title: "Bem-vindos à Nossa Igreja",
        description: "Junte-se à nossa comunidade de fé e descobra o amor de Deus em cada momento da sua vida.",
        buttonText: "Conheça Mais",
        buttonLink: "/sobre",
        backgroundImage: "/images/hero-1.jpg",
        isActive: true,
        order: 1
      },
      {
        title: "Culto de Domingo",
        description: "Venha adorar connosco todos os domingos às 10h. Juntos somos mais fortes na fé.",
        buttonText: "Ver Horários",
        buttonLink: "/servicos",
        backgroundImage: "/images/hero-2.jpg",
        isActive: true,
        order: 2
      },
      {
        title: "Transmissão Ao Vivo",
        description: "Assista aos nossos cultos online e participe da nossa comunidade virtual.",
        buttonText: "Assistir Agora",
        buttonLink: "/live",
        backgroundImage: "/images/hero-3.jpg",
        isActive: true,
        order: 3
      }
    ]);

    // 3. Create About Content
    console.log("📖 Creating about content...");
    await db.insert(aboutContent).values([
      {
        section: "vision",
        title: "Nossa Visão",
        content: "Ser uma igreja que transforma vidas através do amor de Cristo, impactando nossa comunidade e o mundo com o Evangelho.",
        icon: "eye"
      },
      {
        section: "mission",
        title: "Nossa Missão",
        content: "Fazer discípulos de Jesus Cristo, equipando os santos para o ministério e edificando o corpo de Cristo.",
        icon: "heart"
      },
      {
        section: "beliefs",
        title: "Nossas Crenças",
        content: "Cremos na Bíblia como Palavra de Deus, na Trindade, na salvação pela graça através da fé em Jesus Cristo.",
        icon: "book"
      }
    ]);

    // 4. Create Service Schedules
    console.log("⏰ Creating service schedules...");
    await db.insert(serviceSchedules).values([
      {
        day: "Domingo",
        title: "Culto Principal",
        description: "Adoração, pregação da Palavra e comunhão",
        time: "10:00",
        icon: "church"
      },
      {
        day: "Quarta-feira",
        title: "Estudo Bíblico",
        description: "Aprofundamento na Palavra de Deus",
        time: "19:30",
        icon: "book-open"
      },
      {
        day: "Sexta-feira",
        title: "Vigília de Oração",
        description: "Tempo de oração e intercessão",
        time: "20:00",
        icon: "hands"
      }
    ]);

    // 5. Create Messages
    console.log("📢 Creating messages...");
    await db.insert(messages).values([
      {
        title: "O Poder da Oração",
        description: "Descubra como a oração pode transformar sua vida e fortalecer sua fé.",
        imageUrl: "/images/message-1.jpg",
        category: "Ensino",
        date: "2025-06-25",
        isFeatured: true
      },
      {
        title: "Vivendo em Comunidade",
        description: "A importância da vida comunitária na jornada cristã.",
        imageUrl: "/images/message-2.jpg",
        category: "Série",
        date: "2025-06-22",
        isFeatured: false
      },
      {
        title: "Fé e Esperança",
        description: "Mantendo a fé mesmo nos momentos mais difíceis.",
        imageUrl: "/images/message-3.jpg",
        category: "Testemunho",
        date: "2025-06-18",
        isFeatured: false
      }
    ]);

    // 6. Create Testimonials
    console.log("💭 Creating testimonials...");
    await db.insert(testimonials).values([
      {
        name: "Maria Silva",
        location: "Lisboa, Portugal",
        content: "Esta igreja mudou completamente a minha vida. Encontrei aqui uma família espiritual que me acolheu com amor.",
        initial: "M"
      },
      {
        name: "João Santos",
        location: "Porto, Portugal",
        content: "Através dos ensinamentos aqui recebidos, consegui superar momentos difíceis e encontrar paz verdadeira.",
        initial: "J"
      },
      {
        name: "Ana Costa",
        location: "Braga, Portugal",
        content: "O amor de Cristo que sinto nesta comunidade é indescritível. Sou grata por fazer parte desta família.",
        initial: "A"
      }
    ]);

    // 7. Create Bible Verse
    console.log("📜 Creating bible verse...");
    await db.insert(bibleVerse).values({
      verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
      reference: "João 3:16",
      backgroundImage: "/images/bible-bg.jpg"
    });

    // 8. Create Site Settings
    console.log("⚙️ Creating site settings...");
    await db.insert(siteSettings).values([
      { key: "site_title", value: "Igreja Movimento de Intercessão e Restauração" },
      { key: "site_description", value: "Uma igreja que transforma vidas através do amor de Cristo" },
      { key: "contact_email", value: "contato@mir-igreja.pt" },
      { key: "contact_phone", value: "+351 123 456 789" },
      { key: "church_address", value: "Rua da Fé, 123, Lisboa, Portugal" },
      { key: "facebook_url", value: "https://facebook.com/mir.igreja" },
      { key: "instagram_url", value: "https://instagram.com/mir.igreja" },
      { key: "youtube_url", value: "https://youtube.com/c/MIRIgreja" },
      { key: "whatsapp_number", value: "+351123456789" }
    ]);

    // 9. Create Events
    console.log("📅 Creating events...");
    await db.insert(events).values([
      {
        title: "Conferência de Avivamento 2025",
        description: "Uma conferência especial com pregadores internacionais para avivar nossa fé.",
        date: "2025-07-15",
        time: "19:00",
        location: "Auditório Principal",
        imageUrl: "/images/event-1.jpg",
        category: "Conferência",
        registrationLink: "/eventos/conferencia-avivamento",
        maxAttendees: 500,
        currentAttendees: 0
      },
      {
        title: "Retiro de Jovens",
        description: "Fim de semana especial para jovens com dinâmicas, oração e comunhão.",
        date: "2025-07-22",
        time: "16:00",
        location: "Centro de Retiros - Sintra",
        imageUrl: "/images/event-2.jpg",
        category: "Jovens",
        registrationLink: "/eventos/retiro-jovens",
        maxAttendees: 100,
        currentAttendees: 0
      },
      {
        title: "Batismo nas Águas",
        description: "Cerimónia especial de batismo para novos convertidos.",
        date: "2025-08-05",
        time: "15:00",
        location: "Praia de Cascais",
        imageUrl: "/images/event-3.jpg",
        category: "Batismo",
        registrationLink: "/eventos/batismo",
        maxAttendees: 50,
        currentAttendees: 0
      }
    ]);

    // 10. Create Donation Campaigns
    console.log("💰 Creating donation campaigns...");
    await db.insert(donationCampaigns).values([
      {
        title: "Construção do Novo Templo",
        description: "Ajude-nos a construir um novo espaço para adoração e comunhão da nossa igreja.",
        goal: "150000.00",
        raised: "45000.00",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        imageUrl: "/images/campaign-1.jpg",
        isActive: true
      },
      {
        title: "Missões Internacionais",
        description: "Apoie nossas missões em África e Ásia para levar o Evangelho aos povos não alcançados.",
        goal: "25000.00",
        raised: "8500.00",
        startDate: "2025-06-01",
        endDate: "2025-11-30",
        imageUrl: "/images/campaign-2.jpg",
        isActive: true
      }
    ]);

    // 11. Create Sample Donations
    console.log("💝 Creating sample donations...");
    await db.insert(donations).values([
      {
        donorName: "José António",
        donorEmail: "jose@email.com",
        amount: "100.00",
        currency: "EUR",
        type: "one-time",
        campaignId: 1,
        status: "completed",
        transactionId: "tx_001",
        paymentMethod: "stripe"
      },
      {
        donorName: "Isabel Ferreira",
        donorEmail: "isabel@email.com",
        amount: "50.00",
        currency: "EUR",
        type: "recurring",
        frequency: "monthly",
        campaignId: 2,
        status: "completed",
        transactionId: "tx_002",
        paymentMethod: "paypal"
      }
    ]);

    // 12. Create Videos
    console.log("🎥 Creating videos...");
    await db.insert(videos).values([
      {
        title: "Culto de Domingo - O Amor de Deus",
        description: "Mensagem poderosa sobre o amor incondicional de Deus por nós.",
        youtubeId: "dQw4w9WgXcQ",
        category: "Culto",
        speaker: "Pastor João Silva",
        date: "2025-06-28",
        duration: "45:30",
        thumbnailUrl: "/images/video-1.jpg",
        viewCount: 1250,
        isLive: false
      },
      {
        title: "Estudo Bíblico - Livro de Efésios",
        description: "Aprofundamento no livro de Efésios, capítulo 2.",
        youtubeId: "dQw4w9WgXcQ",
        category: "Estudo",
        speaker: "Pastor Maria Costa",
        date: "2025-06-26",
        duration: "35:15",
        thumbnailUrl: "/images/video-2.jpg",
        viewCount: 890,
        isLive: false
      },
      {
        title: "LIVE - Vigília de Oração",
        description: "Transmissão ao vivo da vigília de oração desta sexta-feira.",
        youtubeId: "live123",
        category: "Live",
        speaker: "Equipe Pastoral",
        date: "2025-06-28",
        duration: "120:00",
        thumbnailUrl: "/images/video-live.jpg",
        viewCount: 324,
        isLive: true,
        scheduledAt: new Date("2025-06-28T20:00:00Z")
      }
    ]);

    // 13. Create Blog Posts
    console.log("📝 Creating blog posts...");
    await db.insert(blogPosts).values([
      {
        title: "A Importância da Oração Diária",
        slug: "importancia-oracao-diaria",
        content: `
        <h2>A Oração Como Base da Vida Cristã</h2>
        <p>A oração é a comunicação direta entre nós e Deus. É através dela que fortalecemos nossa fé e encontramos direção para nossa vida.</p>
        
        <h3>Como Estabelecer uma Rotina de Oração</h3>
        <ul>
          <li>Escolha um horário fixo todos os dias</li>
          <li>Encontre um local tranquilo</li>
          <li>Comece com gratidão</li>
          <li>Apresente seus pedidos</li>
          <li>Termine com adoração</li>
        </ul>
        
        <p>Lembre-se: a oração não é apenas pedir, mas também ouvir o que Deus tem para nos dizer.</p>
        `,
        excerpt: "Descubra como estabelecer uma vida de oração consistente e transformadora.",
        author: "Pastor João Silva",
        category: "Espiritualidade",
        tags: ["oração", "fé", "vida cristã"],
        imageUrl: "/images/blog-1.jpg",
        isPublished: true,
        publishedAt: new Date("2025-06-25T10:00:00Z"),
        viewCount: 456
      },
      {
        title: "Servindo na Igreja Local",
        slug: "servindo-igreja-local",
        content: `
        <h2>O Privilégio de Servir</h2>
        <p>Servir na igreja não é apenas uma responsabilidade, mas um privilégio que Deus nos concede para sermos parte da Sua obra.</p>
        
        <h3>Áreas de Ministério</h3>
        <p>Nossa igreja oferece diversas oportunidades de serviço:</p>
        <ul>
          <li>Louvor e adoração</li>
          <li>Ministério infantil</li>
          <li>Grupos de jovens</li>
          <li>Ação social</li>
          <li>Recepção e hospitalidade</li>
        </ul>
        
        <p>Encontre seu lugar no Reino de Deus e faça a diferença na vida de outras pessoas.</p>
        `,
        excerpt: "Explore as diferentes formas de servir e fazer a diferença na sua igreja local.",
        author: "Pastora Maria Costa",
        category: "Ministério",
        tags: ["serviço", "ministério", "igreja"],
        imageUrl: "/images/blog-2.jpg",
        isPublished: true,
        publishedAt: new Date("2025-06-20T14:30:00Z"),
        viewCount: 289
      }
    ]);

    // 14. Create Newsletter Subscribers
    console.log("📧 Creating newsletter subscribers...");
    await db.insert(newsletterSubscribers).values([
      { email: "joao@email.com", name: "João Silva", isActive: true },
      { email: "maria@email.com", name: "Maria Costa", isActive: true },
      { email: "ana@email.com", name: "Ana Santos", isActive: true },
      { email: "pedro@email.com", name: "Pedro Oliveira", isActive: true },
      { email: "sofia@email.com", name: "Sofia Ferreira", isActive: true }
    ]);

    // 15. Create Event Registrations
    console.log("📝 Creating event registrations...");
    await db.insert(eventRegistrations).values([
      {
        eventId: 1,
        name: "Carlos Mendes",
        email: "carlos@email.com",
        phone: "+351987654321",
        numberOfAttendees: 2,
        specialRequests: "Acesso para cadeira de rodas"
      },
      {
        eventId: 2,
        name: "Beatriz Costa",
        email: "beatriz@email.com",
        phone: "+351123456789",
        numberOfAttendees: 1,
        specialRequests: null
      }
    ]);

    // 16. Create Blog Comments
    console.log("💬 Creating blog comments...");
    await db.insert(blogComments).values([
      {
        blogPostId: 1,
        authorName: "Teresa Silva",
        authorEmail: "teresa@email.com",
        content: "Excelente artigo! A oração realmente transformou a minha vida.",
        isApproved: true
      },
      {
        blogPostId: 1,
        authorName: "Ricardo Santos",
        authorEmail: "ricardo@email.com",
        content: "Muito edificante. Obrigado por partilhar estas reflexões.",
        isApproved: true
      }
    ]);

    // 17. Create Pages
    console.log("📄 Creating pages...");
    await db.insert(pages).values([
      {
        title: "Início",
        slug: "inicio",
        content: JSON.stringify({
          sections: [
            { type: "hero", config: { showCarousel: true } },
            { type: "about", config: { showVision: true, showMission: true } },
            { type: "services", config: { showSchedule: true } },
            { type: "testimonials", config: { showAll: false, limit: 3 } }
          ]
        }),
        isPublished: true,
        isDefault: true,
        metaTitle: "Igreja MIR - Movimento de Intercessão e Restauração",
        metaDescription: "Bem-vindos à Igreja MIR. Uma comunidade de fé que transforma vidas através do amor de Cristo.",
        order: 1
      },
      {
        title: "Sobre Nós",
        slug: "sobre",
        content: JSON.stringify({
          sections: [
            { type: "vision", config: {} },
            { type: "mission", config: {} },
            { type: "beliefs", config: {} },
            { type: "staff", config: { showAll: true } }
          ]
        }),
        isPublished: true,
        isDefault: true,
        metaTitle: "Sobre Nós - Igreja MIR",
        metaDescription: "Conheça nossa visão, missão e crenças. Saiba mais sobre nossa história e equipe pastoral.",
        order: 2
      }
    ]);

    // 18. Create Menu Items
    console.log("🧭 Creating menu items...");
    await db.insert(menuItems).values([
      { title: "Início", url: "/", parentId: null, order: 1, isActive: true, icon: "home" },
      { title: "Sobre", url: "/sobre", parentId: null, order: 2, isActive: true, icon: "info" },
      { title: "Nossa História", url: "/sobre/historia", parentId: 2, order: 1, isActive: true },
      { title: "Equipe Pastoral", url: "/sobre/equipe", parentId: 2, order: 2, isActive: true },
      { title: "Serviços", url: "/servicos", parentId: null, order: 3, isActive: true, icon: "calendar" },
      { title: "Ensinos", url: "/ensinos", parentId: null, order: 4, isActive: true, icon: "book" },
      { title: "Eventos", url: "/eventos", parentId: null, order: 5, isActive: true, icon: "calendar-days" },
      { title: "Blog", url: "/blog", parentId: null, order: 6, isActive: true, icon: "pen-tool" },
      { title: "Contato", url: "/contato", parentId: null, order: 7, isActive: true, icon: "phone" }
    ]);

    // 19. Create Landing Page Sections
    console.log("🏗️ Creating landing page sections...");
    await db.insert(landingPageSections).values([
      {
        sectionType: "hero",
        title: "Seção Principal",
        content: JSON.stringify({
          showCarousel: true,
          autoplay: true,
          interval: 5000
        }),
        order: 1,
        isActive: true
      },
      {
        sectionType: "about",
        title: "Sobre Nós",
        content: JSON.stringify({
          showVision: true,
          showMission: true,
          showBeliefs: true,
          layout: "cards"
        }),
        order: 2,
        isActive: true
      },
      {
        sectionType: "services",
        title: "Nossos Serviços",
        content: JSON.stringify({
          showSchedule: true,
          highlightNext: true
        }),
        order: 3,
        isActive: true
      },
      {
        sectionType: "testimonials",
        title: "Testemunhos",
        content: JSON.stringify({
          limit: 3,
          showNavigation: true,
          autoplay: false
        }),
        order: 4,
        isActive: true
      }
    ]);

    // 20. Create Content Blocks
    console.log("🧱 Creating content blocks...");
    await db.insert(contentBlocks).values([
      {
        name: "Cabeçalho Padrão",
        blockType: "header",
        content: JSON.stringify({
          logo: "/images/logo.png",
          navigation: true,
          social: true,
          contact: true
        }),
        thumbnail: "/images/blocks/header-default.png",
        isActive: true
      },
      {
        name: "Rodapé Completo",
        blockType: "footer",
        content: JSON.stringify({
          columns: 4,
          newsletter: true,
          social: true,
          copyright: true
        }),
        thumbnail: "/images/blocks/footer-complete.png",
        isActive: true
      },
      {
        name: "Card de Testemunho",
        blockType: "testimony",
        content: JSON.stringify({
          showAvatar: true,
          showLocation: true,
          layout: "card"
        }),
        thumbnail: "/images/blocks/testimony-card.png",
        isActive: true
      }
    ]);

    // 21. Create Header Config
    console.log("🎨 Creating header configuration...");
    await db.insert(headerConfig).values({
      logoUrl: "/images/logo.png",
      logoPosition: "left",
      logoSize: "medium",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      menuStyle: "horizontal",
      socialLinks: JSON.stringify([
        { platform: "facebook", url: "https://facebook.com/mir.igreja" },
        { platform: "instagram", url: "https://instagram.com/mir.igreja" },
        { platform: "youtube", url: "https://youtube.com/c/MIRIgreja" }
      ]),
      contactInfo: JSON.stringify({
        phone: "+351 123 456 789",
        email: "contato@mir-igreja.pt",
        address: "Rua da Fé, 123, Lisboa"
      })
    });

    // 22. Create Footer Config
    console.log("🦶 Creating footer configuration...");
    await db.insert(footerConfig).values({
      backgroundColor: "#1a1a1a",
      textColor: "#ffffff",
      columns: JSON.stringify([
        {
          title: "Igreja MIR",
          items: [
            { text: "Sobre Nós", link: "/sobre" },
            { text: "Nossa História", link: "/sobre/historia" },
            { text: "Ministérios", link: "/ministerios" }
          ]
        },
        {
          title: "Serviços",
          items: [
            { text: "Horários", link: "/servicos" },
            { text: "Eventos", link: "/eventos" },
            { text: "Transmissão Ao Vivo", link: "/live" }
          ]
        },
        {
          title: "Recursos",
          items: [
            { text: "Blog", link: "/blog" },
            { text: "Ensinos", link: "/ensinos" },
            { text: "Biblioteca", link: "/biblioteca" }
          ]
        },
        {
          title: "Contato",
          items: [
            { text: "Localização", link: "/contato" },
            { text: "Telefone: +351 123 456 789", link: "tel:+351123456789" },
            { text: "Email: contato@mir-igreja.pt", link: "mailto:contato@mir-igreja.pt" }
          ]
        }
      ]),
      socialLinks: JSON.stringify([
        { platform: "facebook", url: "https://facebook.com/mir.igreja", icon: "facebook" },
        { platform: "instagram", url: "https://instagram.com/mir.igreja", icon: "instagram" },
        { platform: "youtube", url: "https://youtube.com/c/MIRIgreja", icon: "youtube" },
        { platform: "whatsapp", url: "https://wa.me/351123456789", icon: "message-circle" }
      ]),
      contactInfo: JSON.stringify({
        address: "Rua da Fé, 123, 1000-001 Lisboa, Portugal",
        phone: "+351 123 456 789",
        email: "contato@mir-igreja.pt",
        hours: "Seg-Sex: 9h-17h | Dom: 8h-13h"
      }),
      copyrightText: "© 2025 Igreja MIR. Todos os direitos reservados.",
      newsletterEnabled: true
    });

    console.log("✅ Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log("- 1 Admin user created");
    console.log("- 3 Hero slides created");
    console.log("- 3 About content sections created");
    console.log("- 3 Service schedules created");
    console.log("- 3 Messages created");
    console.log("- 3 Testimonials created");
    console.log("- 1 Bible verse created");
    console.log("- 9 Site settings created");
    console.log("- 3 Events created");
    console.log("- 2 Donation campaigns created");
    console.log("- 2 Sample donations created");
    console.log("- 3 Videos created");
    console.log("- 2 Blog posts created");
    console.log("- 5 Newsletter subscribers created");
    console.log("- 2 Event registrations created");
    console.log("- 2 Blog comments created");
    console.log("- 2 Pages created");
    console.log("- 9 Menu items created");
    console.log("- 4 Landing page sections created");
    console.log("- 3 Content blocks created");
    console.log("- 1 Header configuration created");
    console.log("- 1 Footer configuration created");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("🎉 Seeding process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });

export default seed;