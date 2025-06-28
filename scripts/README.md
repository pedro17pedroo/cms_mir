# Database Scripts

Esta pasta contém scripts TypeScript para gerenciar a base de dados do Church CMS.

## Scripts Disponíveis

### 1. `seed.ts` - Seeding Inicial Completo
Popula a base de dados com dados iniciais completos e realistas.

```bash
tsx scripts/seed.ts
```

**O que faz:**
- Limpa todas as tabelas existentes
- Cria um utilizador admin (username: `admin`, password: `admin123`)
- Popula todas as tabelas com dados de exemplo:
  - 3 slides para o carousel principal
  - 3 secções sobre a igreja (visão, missão, crenças)
  - 3 horários de serviços
  - 3 mensagens/sermões
  - 3 testemunhos
  - 1 versículo bíblico destacado
  - 9 configurações do site
  - 3 eventos futuros
  - 2 campanhas de doações
  - 2 doações de exemplo
  - 3 vídeos
  - 2 artigos de blog
  - 5 subscritores da newsletter
  - 2 inscrições em eventos
  - 2 comentários de blog
  - 2 páginas dinâmicas
  - 9 itens de menu
  - 4 secções da landing page
  - 3 blocos de conteúdo
  - Configurações de cabeçalho e rodapé

### 2. `reset-demo-data.ts` - Actualização de Dados Demo
Actualiza apenas o conteúdo principal com dados mais recentes.

```bash
tsx scripts/reset-demo-data.ts
```

**O que faz:**
- Actualiza slides do carousel
- Adiciona novos testemunhos
- Actualiza mensagens recentes
- Adiciona eventos da época actual
- Cria novos artigos de blog
- Actualiza vídeos com conteúdo recente

### 3. `check-database.ts` - Verificação da Base de Dados
Verifica a integridade e status da base de dados.

```bash
tsx scripts/check-database.ts
```

**O que verifica:**
- Contagem de registos em todas as tabelas
- Amostras de dados em tabelas principais
- Configurações essenciais
- Conteúdo activo
- Performance das queries
- Status geral da base de dados

## Estrutura da Base de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas principais:

### Tabelas de Conteúdo
- `hero_slides` - Slides do carousel principal
- `about_content` - Conteúdo sobre a igreja
- `service_schedules` - Horários dos serviços
- `messages` - Mensagens/sermões
- `testimonials` - Testemunhos
- `bible_verse` - Versículo bíblico destacado

### Tabelas de Eventos e Blog
- `events` - Eventos da igreja
- `event_registrations` - Inscrições em eventos
- `blog_posts` - Artigos do blog
- `blog_comments` - Comentários do blog

### Tabelas de Doações
- `donation_campaigns` - Campanhas de doação
- `donations` - Doações individuais

### Tabelas de Multimédia
- `videos` - Vídeos do YouTube
- `newsletter_subscribers` - Subscritores da newsletter

### Tabelas de Configuração
- `site_settings` - Configurações gerais do site
- `header_config` - Configuração do cabeçalho
- `footer_config` - Configuração do rodapé

### Tabelas de Gestão Dinâmica
- `pages` - Páginas dinâmicas
- `menu_items` - Itens do menu
- `landing_page_sections` - Secções da landing page
- `content_blocks` - Biblioteca de blocos de conteúdo

### Tabelas de Sistema
- `users` - Utilizadores do sistema

## Relacionamentos

As tabelas têm relacionamentos definidos:
- Eventos ↔ Inscrições em eventos
- Campanhas de doação ↔ Doações
- Artigos do blog ↔ Comentários

## Dados de Acesso

### Utilizador Admin
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Importante:** Em produção, altere esta password por uma segura.

## Comandos Úteis

```bash
# Executar seeding completo
tsx scripts/seed.ts

# Verificar status da base de dados
tsx scripts/check-database.ts

# Actualizar apenas dados de demonstração
tsx scripts/reset-demo-data.ts

# Push do schema para a base de dados
npm run db:push
```

## Resolução de Problemas

### Base de Dados Vazia
Se a verificação mostrar tabelas vazias:
1. Execute `tsx scripts/seed.ts`
2. Verifique com `tsx scripts/check-database.ts`

### Erro de Conexão
Se houver erros de conexão:
1. Verifique se a variável `DATABASE_URL` está definida
2. Confirme que a base de dados PostgreSQL está ativa

### Performance Lenta
Se as queries estiverem lentas:
1. Verifique a saída do `check-database.ts`
2. Considere adicionar índices se necessário

## Customização

Para personalizar os dados:
1. Edite os valores nos scripts de seeding
2. Execute o script relevante
3. Verifique os resultados

## Backup e Restore

Recomenda-se fazer backup regular dos dados:

```bash
# Backup (exemplo)
pg_dump $DATABASE_URL > backup.sql

# Restore (exemplo)
psql $DATABASE_URL < backup.sql
```