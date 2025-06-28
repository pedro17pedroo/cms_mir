# Church CMS

## Overview

This is a comprehensive Church Content Management System (CMS) built with modern web technologies. The application is designed to manage all website content, sessions, and integrations for a church website. It features a public-facing frontend for visitors and a full-featured admin panel for content management.

## System Architecture

The application follows a full-stack architecture with:

- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components organized by functionality
- **Styling**: Tailwind CSS with custom church theme colors (gold, purple, orange)
- **UI Components**: shadcn/ui component library for consistent design
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

### Backend Architecture
- **API Structure**: RESTful endpoints organized by resource type
- **Database Layer**: Drizzle ORM with PostgreSQL for data persistence
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with Vite integration

### Database Schema
The application manages several core entities:
- **Users**: Admin authentication and user management
- **Hero Slides**: Homepage carousel content
- **About Content**: Church vision, mission, and beliefs
- **Service Schedules**: Worship service times and details
- **Messages**: Sermons and teachings with featured content
- **Testimonials**: Member testimonies and experiences
- **Bible Verse**: Daily/featured scripture content
- **Site Settings**: Global website configuration

## Data Flow

1. **Public Pages**: Static content served with dynamic data fetched from API endpoints
2. **Admin Interface**: CRUD operations for all content types through protected admin routes
3. **Real-time Updates**: TanStack Query provides optimistic updates and cache invalidation
4. **Form Handling**: Validated submissions with immediate feedback and error handling

## External Dependencies

- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Drizzle ORM**: Type-safe database operations and migrations
- **TanStack Query**: Server state management and caching
- **shadcn/ui**: Pre-built accessible UI components
- **Framer Motion**: Animation library for enhanced user experience
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema parsing

## Deployment Strategy

The application is configured for modern deployment platforms:

- **Build Process**: Vite handles frontend bundling, esbuild compiles the server
- **Environment**: Environment variables for database configuration
- **Database**: Drizzle migrations for schema management
- **Development**: Integrated development server with hot reload
- **Production**: Static asset serving with Express.js API routes

## Changelog
- June 28, 2025. Initial setup
- June 28, 2025. Implemented complete PRD requirements:
  - Added newsletter subscription system with email collection
  - Integrated social media components (Facebook, Instagram, YouTube, WhatsApp)
  - Created event registration system with RSVP functionality
  - Added authentication system for admin access
  - Implemented comprehensive routing for all pages
  - Enhanced event management with calendar functionality
  - Added social media sharing capabilities
  - Created responsive design with church theme colors (purple, gold, orange)
  - Migrated from memory storage to PostgreSQL database
  - Implemented live streaming component with YouTube integration
  - Added SEO optimization with meta tags and structured data
  - Created blog commenting system with moderation
  - Enhanced admin panel with advanced content management dashboard
  - Added comprehensive analytics dashboard with real-time metrics
  - Implemented advanced live streaming with interactive chat
  - Created unified content manager for all website sections
  - Added real-time data updates and caching throughout the system
- June 28, 2025. Completed PRD implementation and migration:
  - Created all missing pages: About, Services, Teachings, Contact
  - Implemented complete admin panel with specialized managers:
    - Social Media Manager (Facebook, Instagram, YouTube, WhatsApp integration)
    - Streaming Manager (Live streaming control, scheduling, analytics)
    - Newsletter Manager (Email campaigns, subscriber management, analytics)
    - Donation Manager (Campaign creation, donation tracking, financial analytics)
  - Added real-time analytics dashboard with authentic data integration
  - Enhanced all admin components with comprehensive CRUD operations
  - Integrated contact form with backend processing
  - Updated navigation and routing for all new pages
  - All PRD requirements successfully implemented and functional
- June 28, 2025. Implemented updated PRD advanced requirements:
  - Dynamic Page Management: Created complete page editor with visual builder
  - Dynamic Menu System: Full menu creation, editing, activation/deactivation with submenu support
  - Landing Page Manager: Drag-and-drop section ordering with configurable content blocks
  - Content Blocks Library: Reusable component system with thumbnails and customization
  - Header Customizer: Real-time header configuration with logo, colors, and layout options
  - Footer Configuration: Editable footer sections and contact information
  - Added 6 new database tables: pages, menuItems, landingPageSections, contentBlocks, headerConfig, footerConfig
  - Enhanced admin panel with 5 new specialized managers
  - All new PRD requirements from updated document successfully implemented

## User Preferences

Preferred communication style: Simple, everyday language.