import { db } from "../server/db";
import { 
  heroSlides, aboutContent, serviceSchedules, messages, 
  testimonials, bibleVerse, siteSettings, events, blogPosts, 
  videos, newsletterSubscribers
} from "../shared/schema";

async function resetDemoData() {
  console.log("🔄 Resetting demo data...");

  try {
    // Update existing hero slides with new content
    console.log("🖼️ Updating hero slides...");
    await db.delete(heroSlides);
    await db.insert(heroSlides).values([
      {
        title: "Juntos Somos Igreja",
        description: "Faça parte da nossa família espiritual e viva uma experiência transformadora com Cristo.",
        buttonText: "Junte-se a Nós",
        buttonLink: "/sobre",
        backgroundImage: "/images/hero-new-1.jpg",
        isActive: true,
        order: 1
      },
      {
        title: "Conferência de Avivamento",
        description: "Prepare-se para uma experiência única de avivamento e renovação espiritual em julho de 2025.",
        buttonText: "Inscreva-se",
        buttonLink: "/eventos",
        backgroundImage: "/images/hero-new-2.jpg",
        isActive: true,
        order: 2
      }
    ]);

    // Add current testimonials
    console.log("💭 Adding fresh testimonials...");
    await db.delete(testimonials);
    await db.insert(testimonials).values([
      {
        name: "Carlos Ferreira",
        location: "Coimbra, Portugal",
        content: "Depois de anos de busca, encontrei nesta igreja a paz que tanto procurava. A comunidade é acolhedora e os ensinamentos são transformadores.",
        initial: "C"
      },
      {
        name: "Sofia Mendes",
        location: "Aveiro, Portugal",
        content: "O ministério de jovens mudou completamente a minha perspetiva de vida. Aqui encontrei propósito e direção para o meu futuro.",
        initial: "S"
      },
      {
        name: "Miguel Santos",
        location: "Faro, Portugal",
        content: "As orações e o apoio desta igreja foram fundamentais durante momentos difíceis. Verdadeiramente uma família em Cristo.",
        initial: "M"
      },
      {
        name: "Rita Oliveira",
        location: "Évora, Portugal",
        content: "Participar dos estudos bíblicos aqui abriu-me os olhos para verdades que nunca tinha compreendido antes. Cresci muito espiritualmente.",
        initial: "R"
      }
    ]);

    // Update recent messages
    console.log("📢 Updating recent messages...");
    await db.delete(messages);
    await db.insert(messages).values([
      {
        title: "A Graça Transformadora",
        description: "Uma mensagem poderosa sobre como a graça de Deus tem o poder de transformar completamente nossas vidas.",
        imageUrl: "/images/message-grace.jpg",
        category: "Sermão",
        date: "2025-06-28",
        isFeatured: true
      },
      {
        title: "Propósito e Chamado",
        description: "Descubra o propósito único que Deus tem para sua vida e como viver segundo Seu chamado.",
        imageUrl: "/images/message-purpose.jpg",
        category: "Série",
        date: "2025-06-25",
        isFeatured: false
      },
      {
        title: "Fé em Tempos Difíceis",
        description: "Como manter a fé e a esperança mesmo quando as circunstâncias parecem adversas.",
        imageUrl: "/images/message-faith.jpg",
        category: "Ensino",
        date: "2025-06-22",
        isFeatured: false
      },
      {
        title: "O Poder da Comunhão",
        description: "A importância da vida em comunidade e como nos edificamos mutuamente na fé.",
        imageUrl: "/images/message-community.jpg",
        category: "Testemunho",
        date: "2025-06-20",
        isFeatured: false
      }
    ]);

    // Update current events for the season
    console.log("📅 Updating upcoming events...");
    await db.delete(events);
    await db.insert(events).values([
      {
        title: "Conferência Profética 2025",
        description: "Três dias de conferência com ministros internacionais, foco em profecia e avivamento para os últimos tempos.",
        date: "2025-07-18",
        time: "19:00",
        location: "Centro de Convenções de Lisboa",
        imageUrl: "/images/event-prophetic.jpg",
        category: "Conferência",
        registrationLink: "/eventos/conferencia-profetica",
        maxAttendees: 800,
        currentAttendees: 247
      },
      {
        title: "Acampamento de Verão",
        description: "Semana de acampamento para famílias com atividades, ensinos e muito companheirismo cristão.",
        date: "2025-08-10",
        time: "09:00",
        location: "Camping Cristão - Serra da Estrela",
        imageUrl: "/images/event-camp.jpg",
        category: "Retiro",
        registrationLink: "/eventos/acampamento-verao",
        maxAttendees: 150,
        currentAttendees: 89
      },
      {
        title: "Noite de Adoração",
        description: "Uma noite especial dedicada à adoração e louvor, com músicos convidados de várias igrejas.",
        date: "2025-07-05",
        time: "20:00",
        location: "Auditório da Igreja",
        imageUrl: "/images/event-worship.jpg",
        category: "Adoração",
        registrationLink: "/eventos/noite-adoracao",
        maxAttendees: 300,
        currentAttendees: 156
      },
      {
        title: "Missão Urbana",
        description: "Ação evangelística nas ruas de Lisboa, distribuindo alimentos e compartilhando o amor de Cristo.",
        date: "2025-07-12",
        time: "15:00",
        location: "Centro de Lisboa",
        imageUrl: "/images/event-mission.jpg",
        category: "Missão",
        registrationLink: "/eventos/missao-urbana",
        maxAttendees: 80,
        currentAttendees: 34
      }
    ]);

    // Add fresh blog posts
    console.log("📝 Adding recent blog posts...");
    await db.delete(blogPosts);
    await db.insert(blogPosts).values([
      {
        title: "Preparando-se para o Avivamento",
        slug: "preparando-se-avivamento-2025",
        content: `
        <h2>Sinais dos Tempos</h2>
        <p>Estamos vivendo tempos únicos na história da humanidade. Deus está preparando um grande avivamento mundial.</p>
        
        <h3>Como se Preparar</h3>
        <ul>
          <li>Intensificar a vida de oração</li>
          <li>Jejuar com propósito</li>
          <li>Estudar a Palavra com maior profundidade</li>
          <li>Santificar o coração</li>
          <li>Buscar dons espirituais</li>
        </ul>
        
        <blockquote>
          "Se o meu povo, que se chama pelo meu nome, se humilhar, e orar, e buscar a minha face, e se converter dos seus maus caminhos, então eu ouvirei dos céus, e perdoarei os seus pecados, e sararei a sua terra." - 2 Crônicas 7:14
        </blockquote>
        
        <p>Este é o tempo de nos prepararmos. O Senhor está procurando vasos limpos e disponíveis para usar neste último avivamento.</p>
        `,
        excerpt: "Como a igreja deve se preparar para o grande avivamento que está por vir.",
        author: "Pastor João Silva",
        category: "Profecia",
        tags: ["avivamento", "oração", "santificação", "últimos tempos"],
        imageUrl: "/images/blog-revival.jpg",
        isPublished: true,
        publishedAt: new Date("2025-06-27T08:00:00Z"),
        viewCount: 892
      },
      {
        title: "O Ministério da Intercessão",
        slug: "ministerio-intercessao",
        content: `
        <h2>Chamados para Interceder</h2>
        <p>A intercessão é um dos ministérios mais poderosos da igreja. É através dela que batalhas espirituais são travadas e vitórias são conquistadas.</p>
        
        <h3>Características do Intercessor</h3>
        <ol>
          <li><strong>Coração compassivo</strong> - Sente a dor dos outros como própria</li>
          <li><strong>Vida de santidade</strong> - Busca constantemente a pureza diante de Deus</li>
          <li><strong>Perseverança</strong> - Não desiste até ver a resposta</li>
          <li><strong>Discernimento espiritual</strong> - Entende os tempos e as estratégias do inimigo</li>
        </ol>
        
        <h3>Áreas de Intercessão</h3>
        <ul>
          <li>Pela igreja local e liderança</li>
          <li>Pelas nações e governos</li>
          <li>Pelos perdidos e evangelização</li>
          <li>Pela família e próximos</li>
          <li>Por Israel e Jerusalém</li>
        </ul>
        
        <p>Se Deus tem tocado seu coração para o ministério da intercessão, não hesite em responder a este chamado. O mundo precisa de intercessores nestes últimos dias.</p>
        `,
        excerpt: "Compreenda o chamado e a importância do ministério da intercessão na igreja.",
        author: "Pastora Maria Costa",
        category: "Ministério",
        tags: ["intercessão", "oração", "ministério", "batalha espiritual"],
        imageUrl: "/images/blog-intercession.jpg",
        isPublished: true,
        publishedAt: new Date("2025-06-24T10:30:00Z"),
        viewCount: 634
      },
      {
        title: "Vivendo em Santidade",
        slug: "vivendo-santidade",
        content: `
        <h2>O Chamado à Santidade</h2>
        <p>"Sede santos, porque eu sou santo" - esta não é apenas uma sugestão, mas um mandamento divino para todos os que desejam andar com Deus.</p>
        
        <h3>O Que é Santidade?</h3>
        <p>Santidade não é perfeição moral baseada em esforço próprio, mas uma vida separada para Deus, transformada pelo Espírito Santo.</p>
        
        <h3>Práticas que Cultivam a Santidade</h3>
        <ul>
          <li><strong>Oração diária</strong> - Comunhão constante com Deus</li>
          <li><strong>Leitura bíblica</strong> - Renovação da mente pela Palavra</li>
          <li><strong>Jejum</strong> - Disciplina do corpo e busca espiritual</li>
          <li><strong>Adoração</strong> - Reconhecimento da grandeza de Deus</li>
          <li><strong>Confissão</strong> - Arrependimento sincero dos pecados</li>
        </ul>
        
        <h3>Desafios da Santidade</h3>
        <p>Viver em santidade num mundo corrupto não é fácil, mas é possível através do poder do Espírito Santo que habita em nós.</p>
        
        <p>Lembre-se: a santidade não é um destino, mas uma jornada diária de entrega e transformação.</p>
        `,
        excerpt: "Entenda o verdadeiro significado da santidade e como viver uma vida separada para Deus.",
        author: "Pastor António Reis",
        category: "Vida Cristã",
        tags: ["santidade", "vida cristã", "transformação", "disciplina"],
        imageUrl: "/images/blog-holiness.jpg",
        isPublished: true,
        publishedAt: new Date("2025-06-21T14:00:00Z"),
        viewCount: 475
      }
    ]);

    // Update videos with recent content
    console.log("🎥 Updating recent videos...");
    await db.delete(videos);
    await db.insert(videos).values([
      {
        title: "LIVE: Vigília de Oração - Preparação para o Avivamento",
        description: "Noite especial de oração e intercessão preparando nossos corações para o avivamento que está por vir.",
        youtubeId: "dQw4w9WgXcQ",
        category: "Live",
        speaker: "Equipe de Intercessão",
        date: "2025-06-28",
        duration: "180:00",
        thumbnailUrl: "/images/video-vigil.jpg",
        viewCount: 1847,
        isLive: false
      },
      {
        title: "Culto de Domingo - A Graça Transformadora",
        description: "Mensagem impactante sobre como a graça de Deus tem poder para transformar qualquer situação.",
        youtubeId: "dQw4w9WgXcQ",
        category: "Culto",
        speaker: "Pastor João Silva",
        date: "2025-06-28",
        duration: "52:30",
        thumbnailUrl: "/images/video-grace.jpg",
        viewCount: 2156,
        isLive: false
      },
      {
        title: "Série: Profetas do Antigo Testamento - Episódio 3",
        description: "Estudo profundo sobre a vida e ministério do profeta Elias e suas lições para hoje.",
        youtubeId: "dQw4w9WgXcQ",
        category: "Estudo",
        speaker: "Pastora Maria Costa",
        date: "2025-06-26",
        duration: "41:15",
        thumbnailUrl: "/images/video-elijah.jpg",
        viewCount: 987,
        isLive: false
      },
      {
        title: "Conferência de Jovens 2025 - Sessão 1",
        description: "Primeira sessão da conferência de jovens com o tema 'Geração de Avivamento'.",
        youtubeId: "dQw4w9WgXcQ",
        category: "Conferência",
        speaker: "Pastor Daniel Martins",
        date: "2025-06-22",
        duration: "68:45",
        thumbnailUrl: "/images/video-youth-conf.jpg",
        viewCount: 1432,
        isLive: false
      },
      {
        title: "Transmissão AO VIVO - Culto de Domingo",
        description: "Acompanhe nosso culto dominical ao vivo com louvor, adoração e a Palavra de Deus.",
        youtubeId: "live_current",
        category: "Live",
        speaker: "Equipe Pastoral",
        date: "2025-06-30",
        duration: "120:00",
        thumbnailUrl: "/images/video-live-sunday.jpg",
        viewCount: 0,
        isLive: true,
        scheduledAt: new Date("2025-06-30T10:00:00Z")
      }
    ]);

    console.log("✅ Demo data reset completed successfully!");
    console.log("📊 Updated content:");
    console.log("- 2 New hero slides");
    console.log("- 4 Fresh testimonials");
    console.log("- 4 Recent messages");
    console.log("- 4 Upcoming events");
    console.log("- 3 New blog posts");
    console.log("- 5 Recent videos (1 live)");

  } catch (error) {
    console.error("❌ Error during demo data reset:", error);
    throw error;
  }
}

// Run the reset function
resetDemoData()
  .then(() => {
    console.log("🎉 Demo data reset completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Demo data reset failed:", error);
    process.exit(1);
  });

export default resetDemoData;