import { db } from "../server/db.ts";
import { menuItems } from "../shared/schema.ts";

async function updateCompleteMenuStructure() {
  console.log("🧭 Atualizando estrutura completa de menus...");
  
  // Limpar menus existentes
  await db.delete(menuItems);
  
  // Menu principal e submenus completos
  const menus = [
    // 1. INÍCIO
    { id: 1, title: "Início", url: "/", parentId: null, order: 1, isActive: true, icon: "home" },
    
    // 2. SOBRE (com submenus)
    { id: 2, title: "Sobre", url: "/sobre", parentId: null, order: 2, isActive: true, icon: "info" },
    { id: 3, title: "Nossa História", url: "/sobre/historia", parentId: 2, order: 1, isActive: true, icon: null },
    { id: 4, title: "Visão e Missão", url: "/sobre/visao", parentId: 2, order: 2, isActive: true, icon: null },
    { id: 5, title: "Crenças", url: "/sobre/crencas", parentId: 2, order: 3, isActive: true, icon: null },
    { id: 6, title: "Pastor", url: "/sobre/pastor", parentId: 2, order: 4, isActive: true, icon: null },
    { id: 7, title: "Equipe Pastoral", url: "/sobre/equipe", parentId: 2, order: 5, isActive: true, icon: null },
    { id: 8, title: "Liderança", url: "/sobre/lideranca", parentId: 2, order: 6, isActive: true, icon: null },
    
    // 3. MINISTÉRIOS (com submenus)
    { id: 9, title: "Ministérios", url: "/ministerios", parentId: null, order: 3, isActive: true, icon: "users" },
    { id: 10, title: "Ministério Infantil", url: "/ministerios/infantil", parentId: 9, order: 1, isActive: true, icon: null },
    { id: 11, title: "Ministério de Jovens", url: "/ministerios/jovens", parentId: 9, order: 2, isActive: true, icon: null },
    { id: 12, title: "Ministério de Casais", url: "/ministerios/casais", parentId: 9, order: 3, isActive: true, icon: null },
    { id: 13, title: "Ministério de Mulheres", url: "/ministerios/mulheres", parentId: 9, order: 4, isActive: true, icon: null },
    { id: 14, title: "Ministério de Homens", url: "/ministerios/homens", parentId: 9, order: 5, isActive: true, icon: null },
    { id: 15, title: "Ministério de Louvor", url: "/ministerios/louvor", parentId: 9, order: 6, isActive: true, icon: null },
    { id: 16, title: "Ministério de Oração", url: "/ministerios/oracao", parentId: 9, order: 7, isActive: true, icon: null },
    { id: 17, title: "Ministério de Visitação", url: "/ministerios/visitacao", parentId: 9, order: 8, isActive: true, icon: null },
    
    // 4. CULTOS E SERVIÇOS (com submenus)
    { id: 18, title: "Cultos", url: "/cultos", parentId: null, order: 4, isActive: true, icon: "calendar" },
    { id: 19, title: "Horários de Cultos", url: "/cultos/horarios", parentId: 18, order: 1, isActive: true, icon: null },
    { id: 20, title: "Culto Dominical", url: "/cultos/dominical", parentId: 18, order: 2, isActive: true, icon: null },
    { id: 21, title: "Culto de Oração", url: "/cultos/oracao", parentId: 18, order: 3, isActive: true, icon: null },
    { id: 22, title: "Estudo Bíblico", url: "/cultos/estudo-biblico", parentId: 18, order: 4, isActive: true, icon: null },
    { id: 23, title: "Culto de Jovens", url: "/cultos/jovens", parentId: 18, order: 5, isActive: true, icon: null },
    { id: 24, title: "Escola Dominical", url: "/cultos/escola-dominical", parentId: 18, order: 6, isActive: true, icon: null },
    
    // 5. ENSINOS (com submenus)
    { id: 25, title: "Ensinos", url: "/ensinos", parentId: null, order: 5, isActive: true, icon: "book" },
    { id: 26, title: "Sermões", url: "/ensinos/sermoes", parentId: 25, order: 1, isActive: true, icon: null },
    { id: 27, title: "Estudos Bíblicos", url: "/ensinos/estudos", parentId: 25, order: 2, isActive: true, icon: null },
    { id: 28, title: "Devocionais", url: "/ensinos/devocionais", parentId: 25, order: 3, isActive: true, icon: null },
    { id: 29, title: "Biblioteca", url: "/ensinos/biblioteca", parentId: 25, order: 4, isActive: true, icon: null },
    { id: 30, title: "Plano de Leitura", url: "/ensinos/leitura", parentId: 25, order: 5, isActive: true, icon: null },
    
    // 6. EVENTOS (com submenus)
    { id: 31, title: "Eventos", url: "/eventos", parentId: null, order: 6, isActive: true, icon: "calendar-days" },
    { id: 32, title: "Próximos Eventos", url: "/eventos/proximos", parentId: 31, order: 1, isActive: true, icon: null },
    { id: 33, title: "Congressos", url: "/eventos/congressos", parentId: 31, order: 2, isActive: true, icon: null },
    { id: 34, title: "Conferências", url: "/eventos/conferencias", parentId: 31, order: 3, isActive: true, icon: null },
    { id: 35, title: "Retiros", url: "/eventos/retiros", parentId: 31, order: 4, isActive: true, icon: null },
    { id: 36, title: "Eventos Especiais", url: "/eventos/especiais", parentId: 31, order: 5, isActive: true, icon: null },
    { id: 37, title: "Calendário", url: "/eventos/calendario", parentId: 31, order: 6, isActive: true, icon: null },
    
    // 7. MEDIA (com submenus)
    { id: 38, title: "Mídia", url: "/media", parentId: null, order: 7, isActive: true, icon: "play-circle" },
    { id: 39, title: "Transmissões ao Vivo", url: "/media/ao-vivo", parentId: 38, order: 1, isActive: true, icon: null },
    { id: 40, title: "Vídeos", url: "/media/videos", parentId: 38, order: 2, isActive: true, icon: null },
    { id: 41, title: "Áudios", url: "/media/audios", parentId: 38, order: 3, isActive: true, icon: null },
    { id: 42, title: "Fotos", url: "/media/fotos", parentId: 38, order: 4, isActive: true, icon: null },
    { id: 43, title: "Podcasts", url: "/media/podcasts", parentId: 38, order: 5, isActive: true, icon: null },
    
    // 8. CONTRIBUIÇÕES (com submenus)
    { id: 44, title: "Contribuições", url: "/contribuicoes", parentId: null, order: 8, isActive: true, icon: "heart" },
    { id: 45, title: "Dízimos e Ofertas", url: "/contribuicoes/dizimos", parentId: 44, order: 1, isActive: true, icon: null },
    { id: 46, title: "Campanhas", url: "/contribuicoes/campanhas", parentId: 44, order: 2, isActive: true, icon: null },
    { id: 47, title: "Missões", url: "/contribuicoes/missoes", parentId: 44, order: 3, isActive: true, icon: null },
    { id: 48, title: "Projetos Sociais", url: "/contribuicoes/projetos", parentId: 44, order: 4, isActive: true, icon: null },
    { id: 49, title: "Como Contribuir", url: "/contribuicoes/como", parentId: 44, order: 5, isActive: true, icon: null },
    
    // 9. COMUNIDADE (com submenus)
    { id: 50, title: "Comunidade", url: "/comunidade", parentId: null, order: 9, isActive: true, icon: "users-2" },
    { id: 51, title: "Células", url: "/comunidade/celulas", parentId: 50, order: 1, isActive: true, icon: null },
    { id: 52, title: "Grupos de Oração", url: "/comunidade/grupos-oracao", parentId: 50, order: 2, isActive: true, icon: null },
    { id: 53, title: "Grupos de Estudo", url: "/comunidade/grupos-estudo", parentId: 50, order: 3, isActive: true, icon: null },
    { id: 54, title: "Voluntariado", url: "/comunidade/voluntariado", parentId: 50, order: 4, isActive: true, icon: null },
    { id: 55, title: "Testemunhos", url: "/comunidade/testemunhos", parentId: 50, order: 5, isActive: true, icon: null },
    { id: 56, title: "Pedidos de Oração", url: "/comunidade/pedidos-oracao", parentId: 50, order: 6, isActive: true, icon: null },
    
    // 10. BLOG
    { id: 57, title: "Blog", url: "/blog", parentId: null, order: 10, isActive: true, icon: "pen-tool" },
    
    // 11. CONTATO (com submenus)
    { id: 58, title: "Contato", url: "/contato", parentId: null, order: 11, isActive: true, icon: "phone" },
    { id: 59, title: "Localização", url: "/contato/localizacao", parentId: 58, order: 1, isActive: true, icon: null },
    { id: 60, title: "Formulário", url: "/contato/formulario", parentId: 58, order: 2, isActive: true, icon: null },
    { id: 61, title: "Informações", url: "/contato/informacoes", parentId: 58, order: 3, isActive: true, icon: null },
    { id: 62, title: "Redes Sociais", url: "/contato/redes-sociais", parentId: 58, order: 4, isActive: true, icon: null }
  ];
  
  console.log(`📝 Inserindo ${menus.length} itens de menu...`);
  
  for (const menu of menus) {
    await db.insert(menuItems).values({
      id: menu.id,
      title: menu.title,
      url: menu.url,
      parentId: menu.parentId,
      order: menu.order,
      isActive: menu.isActive,
      icon: menu.icon
    });
  }
  
  console.log("✅ Estrutura completa de menus atualizada com sucesso!");
  console.log("📊 Resumo:");
  console.log("- 11 menus principais");
  console.log("- 51 submenus");
  console.log("- 62 itens de menu no total");
  
  // Verificar a estrutura criada
  const result = await db.select().from(menuItems).orderBy(menuItems.order);
  console.log(`\n🔍 Verificação: ${result.length} menus inseridos na base de dados`);
}

updateCompleteMenuStructure().catch(console.error);