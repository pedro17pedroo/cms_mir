CREATE TABLE "content_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"block_type" text NOT NULL,
	"content" text NOT NULL,
	"thumbnail" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "footer_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"background_color" text DEFAULT '#1a1a1a',
	"text_color" text DEFAULT '#ffffff',
	"columns" text NOT NULL,
	"social_links" text,
	"contact_info" text,
	"copyright_text" text,
	"newsletter_enabled" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "header_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"logo_url" text,
	"logo_position" text DEFAULT 'left',
	"logo_size" text DEFAULT 'medium',
	"background_color" text DEFAULT '#ffffff',
	"text_color" text DEFAULT '#000000',
	"menu_style" text DEFAULT 'horizontal',
	"social_links" text,
	"contact_info" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "landing_page_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_type" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"parent_id" integer,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"icon" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"is_published" boolean DEFAULT false,
	"is_default" boolean DEFAULT false,
	"meta_title" text,
	"meta_description" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
