import { db } from "../server/db.ts";
import { menuItems } from "../shared/schema.ts";

async function updateCompleteMenuStructure() {
  console.log("🧭 Atualizando estrutura completa de menus...");
  
  // Limpar menus existentes
  await db.delete(menuItems);
  
  // Menu conforme mostrado nas imagens
  const menus = [
    // 1. INÍCIO
    { id: 1, title: "Início", url: "/", parentId: null, order: 1, isActive: true, icon: "home" },
    
    // 2. SOBRE (com submenus conforme imagem)
    { id: 2, title: "Sobre", url: "/sobre", parentId: null, order: 2, isActive: true, icon: "info" },
    { id: 3, title: "Ministério", url: "/sobre/ministerio", parentId: 2, order: 1, isActive: true, icon: null },
    { id: 4, title: "No que Cremos", url: "/sobre/cremos", parentId: 2, order: 2, isActive: true, icon: null },
    { id: 5, title: "Presidente do MIR", url: "/sobre/presidente", parentId: 2, order: 3, isActive: true, icon: null },
    
    // 3. SERVIÇOS
    { id: 6, title: "Serviços", url: "/servicos", parentId: null, order: 3, isActive: true, icon: "calendar" },
    
    // 4. ENSINO (com submenus conforme imagem)
    { id: 7, title: "Ensino", url: "/ensino", parentId: null, order: 4, isActive: true, icon: "book" },
    { id: 8, title: "Audio", url: "/ensino/audio", parentId: 7, order: 1, isActive: true, icon: null },
    { id: 9, title: "Video", url: "/ensino/video", parentId: 7, order: 2, isActive: true, icon: null },
    
    // 5. PLATAFORMA DE ENSINO (com submenus conforme imagem)
    { id: 10, title: "Plataforma de ensino", url: "/plataforma-ensino", parentId: null, order: 5, isActive: true, icon: "graduation-cap" },
    { id: 11, title: "Conferencia da Fé", url: "/plataforma-ensino/conferencia-fe", parentId: 10, order: 1, isActive: true, icon: null },
    { id: 12, title: "Escola de Fundação", url: "/plataforma-ensino/escola-fundacao", parentId: 10, order: 2, isActive: true, icon: null },
    { id: 13, title: "Conferencia de Ministros", url: "/plataforma-ensino/conferencia-ministros", parentId: 10, order: 3, isActive: true, icon: null },
    { id: 14, title: "Conferencia de Mulheres", url: "/plataforma-ensino/conferencia-mulheres", parentId: 10, order: 4, isActive: true, icon: null },
    { id: 15, title: "Conferencia dos Jovens", url: "/plataforma-ensino/conferencia-jovens", parentId: 10, order: 5, isActive: true, icon: null },
    { id: 16, title: "Mulheres Transformadas", url: "/plataforma-ensino/mulheres-transformadas", parentId: 10, order: 6, isActive: true, icon: null },
    { id: 17, title: "Reis e Sacerdotes", url: "/plataforma-ensino/reis-sacerdotes", parentId: 10, order: 7, isActive: true, icon: null },
    
    // 6. EVENTOS E BLOGS
    { id: 18, title: "Eventos e Blogs", url: "/eventos-blogs", parentId: null, order: 6, isActive: true, icon: "calendar-days" },
    
    // 7. CONTACTO
    { id: 19, title: "Contacto", url: "/contato", parentId: null, order: 7, isActive: true, icon: "phone" }
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
  
  console.log("✅ Estrutura de menus atualizada conforme as imagens!");
  console.log("📊 Resumo:");
  console.log("- 7 menus principais");
  console.log("- 12 submenus");
  console.log("- 19 itens de menu no total");
  
  // Verificar a estrutura criada
  const result = await db.select().from(menuItems).orderBy(menuItems.order);
  console.log(`\n🔍 Verificação: ${result.length} menus inseridos na base de dados`);
}

updateCompleteMenuStructure().catch(console.error);