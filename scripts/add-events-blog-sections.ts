#!/usr/bin/env tsx

import { db } from "../server/db.js";
import { landingPageSections } from "../shared/schema.js";

async function addEventsBlogSections() {
  console.log("📅 Adicionando seções de eventos e blog à landing page...");

  try {
    // Verificar se as seções já existem
    const existingSections = await db.select().from(landingPageSections);
    const eventSectionExists = existingSections.some(s => s.sectionType === "events");
    const blogSectionExists = existingSections.some(s => s.sectionType === "blog");

    // Encontrar a próxima ordem disponível
    const maxOrder = Math.max(...existingSections.map(s => s.order || 0), 0);

    const newSections = [];

    // Adicionar seção de eventos se não existir
    if (!eventSectionExists) {
      newSections.push({
        sectionType: "events",
        title: "Próximos Eventos",
        content: JSON.stringify({
          showUpcoming: true,
          maxEvents: 3,
          showRegistrationLink: true,
          backgroundColor: "#FFF7ED", // orange-50
          layout: "cards"
        }),
        order: maxOrder + 1,
        isActive: true
      });
      console.log("✅ Seção de eventos será adicionada");
    } else {
      console.log("ℹ️ Seção de eventos já existe");
    }

    // Adicionar seção de blog se não existir
    if (!blogSectionExists) {
      newSections.push({
        sectionType: "blog",
        title: "Últimas Publicações",
        content: JSON.stringify({
          showRecent: true,
          maxPosts: 3,
          showCategories: true,
          backgroundColor: "#FAF5FF", // purple-50
          layout: "cards"
        }),
        order: maxOrder + (eventSectionExists ? 1 : 2),
        isActive: true
      });
      console.log("✅ Seção de blog será adicionada");
    } else {
      console.log("ℹ️ Seção de blog já existe");
    }

    // Inserir novas seções
    if (newSections.length > 0) {
      await db.insert(landingPageSections).values(newSections);
      console.log(`🎉 ${newSections.length} seção(ões) adicionada(s) com sucesso!`);
      
      // Mostrar resumo das seções
      newSections.forEach(section => {
        console.log(`   - ${section.title} (${section.sectionType}) - Ordem: ${section.order}`);
      });
    } else {
      console.log("✨ Todas as seções já estão configuradas!");
    }

    console.log("\n📋 Resumo das seções atuais na landing page:");
    const allSections = await db.select().from(landingPageSections);
    const sortedSections = allSections
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    sortedSections.forEach((section, index) => {
      const status = section.isActive ? "🟢 Ativa" : "🔴 Inativa";
      console.log(`   ${index + 1}. ${section.title} (${section.sectionType}) - ${status}`);
    });

  } catch (error) {
    console.error("❌ Erro ao adicionar seções:", error);
    throw error;
  }
}

// Executar o script
addEventsBlogSections()
  .then(() => {
    console.log("\n🎯 Script executado com sucesso!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Falha ao executar script:", error);
    process.exit(1);
  });