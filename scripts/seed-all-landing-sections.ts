#!/usr/bin/env tsx

import { db } from "../server/db.js";
import { landingPageSections } from "../shared/schema.js";
import { eq } from "drizzle-orm";

async function seedAllLandingSections() {
  console.log("🚀 Adicionando todas as 12 seções de landing page...");

  try {
    // Verificar seções existentes
    const existingSections = await db.select().from(landingPageSections);
    console.log(`📊 Encontradas ${existingSections.length} seções existentes`);

    // Definir todas as 12 seções disponíveis
    const allSections = [
      {
        sectionType: "hero",
        title: "Seção Principal",
        content: JSON.stringify({
          showSlides: true,
          autoPlay: true,
          backgroundColor: "#8B5CF6", // purple-500
          textColor: "#FFFFFF"
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
          backgroundColor: "#FFFFFF",
          textColor: "#1F2937" // gray-800
        }),
        order: 2,
        isActive: true
      },
      {
        sectionType: "services",
        title: "Horários dos Cultos",
        content: JSON.stringify({
          showSchedules: true,
          showLocation: true,
          backgroundColor: "#FEF3C7", // amber-100
          textColor: "#92400E" // amber-800
        }),
        order: 3,
        isActive: true
      },
      {
        sectionType: "messages",
        title: "Mensagens do Pastor",
        content: JSON.stringify({
          showFeatured: true,
          maxMessages: 3,
          showAudio: true,
          backgroundColor: "#F3F4F6", // gray-100
          textColor: "#374151" // gray-700
        }),
        order: 4,
        isActive: false
      },
      {
        sectionType: "events",
        title: "Próximos Eventos",
        content: JSON.stringify({
          showUpcoming: true,
          maxEvents: 3,
          showRegistrationLink: true,
          backgroundColor: "#FFF7ED", // orange-50
          textColor: "#9A3412" // orange-800
        }),
        order: 5,
        isActive: true
      },
      {
        sectionType: "blog",
        title: "Últimas Publicações",
        content: JSON.stringify({
          showRecent: true,
          maxPosts: 3,
          showCategories: true,
          backgroundColor: "#FAF5FF", // purple-50
          textColor: "#581C87" // purple-800
        }),
        order: 6,
        isActive: true
      },
      {
        sectionType: "testimonials",
        title: "Testemunhos",
        content: JSON.stringify({
          showAll: true,
          autoRotate: true,
          backgroundColor: "#ECFDF5", // green-50
          textColor: "#14532D" // green-800
        }),
        order: 7,
        isActive: true
      },
      {
        sectionType: "bible-verse",
        title: "Versículo do Dia",
        content: JSON.stringify({
          showDaily: true,
          showReference: true,
          backgroundColor: "#FEF2F2", // red-50
          textColor: "#7F1D1D" // red-800
        }),
        order: 8,
        isActive: false
      },
      {
        sectionType: "live-streaming",
        title: "Transmissão ao Vivo",
        content: JSON.stringify({
          showPlayer: true,
          showSchedule: true,
          backgroundColor: "#EFF6FF", // blue-50
          textColor: "#1E3A8A" // blue-800
        }),
        order: 9,
        isActive: false
      },
      {
        sectionType: "social-media",
        title: "Redes Sociais",
        content: JSON.stringify({
          showFacebook: true,
          showInstagram: true,
          showYouTube: true,
          showWhatsApp: true,
          backgroundColor: "#F8FAFC", // slate-50
          textColor: "#0F172A" // slate-900
        }),
        order: 10,
        isActive: false
      },
      {
        sectionType: "newsletter",
        title: "Newsletter",
        content: JSON.stringify({
          showSubscription: true,
          showBenefits: true,
          backgroundColor: "#FEFCE8", // yellow-50
          textColor: "#713F12" // yellow-800
        }),
        order: 11,
        isActive: false
      },
      {
        sectionType: "custom",
        title: "Seção Personalizada",
        content: JSON.stringify({
          customHTML: "<p>Conteúdo personalizado aqui</p>",
          backgroundColor: "#F1F5F9", // slate-100
          textColor: "#334155" // slate-700
        }),
        order: 12,
        isActive: false
      }
    ];

    // Processar cada seção
    const sectionsToCreate = [];
    const sectionsUpdated = [];

    for (const sectionData of allSections) {
      const existing = existingSections.find(s => s.sectionType === sectionData.sectionType);
      
      if (existing) {
        // Atualizar seção existente se necessário (manter ativa se já estiver ativa)
        if (existing.title !== sectionData.title || existing.order !== sectionData.order) {
          await db
            .update(landingPageSections)
            .set({
              title: sectionData.title,
              content: sectionData.content,
              order: existing.order || sectionData.order // Manter ordem existente
            })
            .where(eq(landingPageSections.id, existing.id));
          
          sectionsUpdated.push(`${sectionData.title} (${sectionData.sectionType})`);
        }
      } else {
        // Adicionar nova seção
        sectionsToCreate.push(sectionData);
      }
    }

    // Criar novas seções
    if (sectionsToCreate.length > 0) {
      await db.insert(landingPageSections).values(sectionsToCreate);
      console.log(`✅ ${sectionsToCreate.length} nova(s) seção(ões) criada(s):`);
      sectionsToCreate.forEach(section => {
        const status = section.isActive ? "🟢 Ativa" : "🔴 Inativa";
        console.log(`   - ${section.title} (${section.sectionType}) - ${status}`);
      });
    }

    // Mostrar seções atualizadas
    if (sectionsUpdated.length > 0) {
      console.log(`🔄 ${sectionsUpdated.length} seção(ões) atualizada(s):`);
      sectionsUpdated.forEach(section => {
        console.log(`   - ${section}`);
      });
    }

    if (sectionsToCreate.length === 0 && sectionsUpdated.length === 0) {
      console.log("ℹ️ Todas as seções já estão configuradas corretamente!");
    }

    // Mostrar resumo final completo
    console.log("\n📋 **RESUMO COMPLETO DAS 12 SEÇÕES DE LANDING PAGE:**");
    console.log("─".repeat(70));

    const finalSections = await db.select().from(landingPageSections);
    const sortedSections = finalSections
      .sort((a, b) => (a.order || 999) - (b.order || 999));

    sortedSections.forEach((section, index) => {
      const status = section.isActive ? "🟢 ATIVA" : "🔴 INATIVA";
      const orderDisplay = section.order || "∞";
      console.log(`${(index + 1).toString().padStart(2)}. [${orderDisplay.toString().padStart(2)}] ${section.title.padEnd(25)} (${section.sectionType.padEnd(15)}) - ${status}`);
    });

    console.log("─".repeat(70));
    console.log(`📊 Total: ${sortedSections.length} seções | Ativas: ${sortedSections.filter(s => s.isActive).length} | Inativas: ${sortedSections.filter(s => !s.isActive).length}`);
    
    console.log("\n💡 **INSTRUÇÕES PARA USO:**");
    console.log("1. Acesse o painel admin → Landing Page");
    console.log("2. Use drag-and-drop para reordenar as seções");
    console.log("3. Clique no switch para ativar/desativar seções");
    console.log("4. Edite o conteúdo JSON de cada seção conforme necessário");
    console.log("5. As alterações aparecerão automaticamente na página inicial");

  } catch (error) {
    console.error("❌ Erro ao processar seções:", error);
    throw error;
  }
}

// Executar o script
seedAllLandingSections()
  .then(() => {
    console.log("\n🎉 Script executado com sucesso! Todas as 12 seções estão disponíveis.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Falha ao executar script:", error);
    process.exit(1);
  });