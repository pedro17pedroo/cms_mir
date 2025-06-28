import { db } from "../server/db";
import { menuItems } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateMenuStructure() {
  console.log("🔄 Atualizando estrutura do menu...");

  try {
    // Limpar menus existentes
    await db.delete(menuItems);
    console.log("✅ Menus antigos removidos");

    // Inserir estrutura atual do menu baseada no header.tsx
    const menuStructure = [
      // Menu principal: Início
      {
        title: "Início",
        url: "/",
        parentId: null,
        order: 1,
        isActive: true,
        icon: "home"
      },
      
      // Menu principal: Sobre (dropdown parent)
      {
        title: "Sobre",
        url: "#",
        parentId: null,
        order: 2,
        isActive: true,
        icon: "info"
      },
      
      // Menu principal: Serviços
      {
        title: "Serviços",
        url: "/services",
        parentId: null,
        order: 3,
        isActive: true,
        icon: "calendar"
      },
      
      // Menu principal: Ensinos
      {
        title: "Ensinos",
        url: "/teachings",
        parentId: null,
        order: 4,
        isActive: true,
        icon: "book"
      },
      
      // Menu principal: Eventos
      {
        title: "Eventos",
        url: "/events",
        parentId: null,
        order: 5,
        isActive: true,
        icon: "calendar-days"
      },
      
      // Menu principal: Blog
      {
        title: "Blog",
        url: "/blog",
        parentId: null,
        order: 6,
        isActive: true,
        icon: "newspaper"
      },
      
      // Menu principal: Contacto
      {
        title: "Contacto",
        url: "/contact",
        parentId: null,
        order: 7,
        isActive: true,
        icon: "mail"
      }
    ];

    // Inserir menus principais
    const insertedMenus = [];
    for (const menu of menuStructure) {
      const [inserted] = await db.insert(menuItems).values(menu).returning();
      insertedMenus.push(inserted);
      console.log(`✅ Menu criado: ${inserted.title}`);
    }

    // Encontrar o ID do menu "Sobre" para adicionar submenus
    const sobreMenu = insertedMenus.find(m => m.title === "Sobre");
    
    if (sobreMenu) {
      // Inserir submenus do "Sobre"
      const subMenus = [
        {
          title: "Ministério",
          url: "/about",
          parentId: sobreMenu.id,
          order: 1,
          isActive: true,
          icon: "users"
        },
        {
          title: "No que Cremos",
          url: "/about#beliefs",
          parentId: sobreMenu.id,
          order: 2,
          isActive: true,
          icon: "heart"
        },
        {
          title: "Presidente do MIR",
          url: "/about#leadership",
          parentId: sobreMenu.id,
          order: 3,
          isActive: true,
          icon: "user"
        }
      ];

      for (const subMenu of subMenus) {
        const [inserted] = await db.insert(menuItems).values(subMenu).returning();
        console.log(`  ↳ Submenu criado: ${inserted.title}`);
      }
    }

    // Verificar estrutura final
    console.log("\n📋 Estrutura final do menu:");
    const allMenus = await db.select().from(menuItems).orderBy(menuItems.order);
    
    const parentMenus = allMenus.filter(m => !m.parentId);
    for (const parent of parentMenus) {
      const children = allMenus.filter(m => m.parentId === parent.id);
      console.log(`📁 ${parent.title} (${parent.url})`);
      for (const child of children) {
        console.log(`   ↳ ${child.title} (${child.url})`);
      }
    }

    console.log("\n🎉 Estrutura do menu atualizada com sucesso!");
    console.log(`📊 Total: ${allMenus.length} itens de menu`);

  } catch (error) {
    console.error("❌ Erro ao atualizar estrutura do menu:", error);
    throw error;
  }
}

// Executar a atualização
updateMenuStructure()
  .then(() => {
    console.log("🏁 Atualização da estrutura do menu concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Falha na atualização da estrutura do menu:", error);
    process.exit(1);
  });

export default updateMenuStructure;