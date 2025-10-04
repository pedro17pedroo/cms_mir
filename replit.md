# Church CMS

## Overview

This project is a comprehensive Church Content Management System (CMS) designed to manage all website content, sessions, and integrations for a church. It features a public-facing frontend for visitors and a full-featured admin panel for content management. The system supports dynamic page building, extensive content management, event and blog systems, and financial management, aiming to provide a professional-grade platform exceeding typical CMS functionalities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application is built with a full-stack architecture:

-   **Frontend**: React 18 with TypeScript (Vite, shadcn/ui, Tailwind CSS, Wouter, TanStack Query, React Hook Form, Zod, Framer Motion).
-   **Backend**: Express.js server with TypeScript.
-   **Database**: PostgreSQL with Drizzle ORM.

**Key Architectural Decisions:**

-   **UI/UX**: Modular React components, Tailwind CSS with a custom church theme (gold, purple, orange), shadcn/ui for consistent design, Framer Motion for animations, and a mobile-first responsive design.
-   **Backend API**: RESTful endpoints, Drizzle ORM for type-safe database operations, centralized error handling, and shared TypeScript schemas.
-   **Content Management**: Robust CRUD operations for various content types including users, hero slides, about content, service schedules, messages, testimonials, Bible verses, and site settings.
-   **Dynamic Content**: Features dynamic page management with a visual page builder (similar to Elementor), a dynamic menu system, a landing page manager with drag-and-drop sections, and a content block library.
-   **Specialized Managers**: Includes dedicated managers for social media, streaming, newsletters, donations, events, and blogs within the admin panel.
-   **Database Schema**: Comprises 22 tables to manage entities such as pages, menu items, landing page sections, content blocks, header/footer configurations, and more.
-   **Visual Editor**: Advanced drag-and-drop visual editor with widget categories, a professional color picker, rich text editing, page templates, responsive device previews, and advanced styling controls.

## Replit Environment Setup

This project is configured to run in Replit with the following setup:

-   **Database**: PostgreSQL database provisioned via Replit (DATABASE_URL environment variable)
-   **Port Configuration**: Server runs on port 5000 (both frontend and backend on same port)
-   **Development Server**: Vite dev server with HMR configured for Replit proxy (`allowedHosts: true`)
-   **Deployment**: Configured for autoscale deployment with build and start scripts
-   **Workflow**: "Start application" runs `npm run dev` on port 5000

### Initial Setup Commands

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Seed database with initial data
npx tsx scripts/seed.ts
```

### Admin Access
- **Username**: admin
- **Password**: admin123

## External Dependencies

-   **@neondatabase/serverless**: Serverless PostgreSQL database connection.
-   **Drizzle ORM**: Type-safe database operations and migrations.
-   **TanStack Query**: Server state management and caching.
-   **shadcn/ui**: Pre-built accessible UI components.
-   **Framer Motion**: Animation library for enhanced user experience.
-   **React Hook Form**: Form state management and validation.
-   **Zod**: Runtime type validation and schema parsing.
-   **Stripe**: Payment gateway integration for donations.
-   **Cloudinary**: Media management for file uploads, image optimization, and CDN delivery.
-   **YouTube API**: Integration for live video data retrieval and channel integration.