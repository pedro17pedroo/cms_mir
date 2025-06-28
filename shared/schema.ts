import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  buttonText: text("button_text").notNull(),
  buttonLink: text("button_link").notNull(),
  backgroundImage: text("background_image").notNull(),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
});

export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(), // 'vision', 'mission', 'beliefs'
  title: text("title").notNull(),
  content: text("content").notNull(),
  icon: text("icon").notNull(),
});

export const serviceSchedules = pgTable("service_schedules", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  time: text("time").notNull(),
  icon: text("icon").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  isFeatured: boolean("is_featured").default(false),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  content: text("content").notNull(),
  initial: text("initial").notNull(),
});

export const bibleVerse = pgTable("bible_verse", {
  id: serial("id").primaryKey(),
  verse: text("verse").notNull(),
  reference: text("reference").notNull(),
  backgroundImage: text("background_image").notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // e.g., "conference", "worship", "youth"
  registrationLink: text("registration_link"),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  imageUrl: text("image_url").notNull(),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Donations table
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  type: text("type").notNull(), // "one-time" or "recurring"
  frequency: text("frequency"), // "monthly", "weekly", etc.
  campaignId: integer("campaign_id"),
  status: text("status").notNull(), // "pending", "completed", "failed"
  transactionId: text("transaction_id"),
  paymentMethod: text("payment_method"), // "stripe", "paypal"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Donation campaigns table
export const donationCampaigns = pgTable("donation_campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goal: numeric("goal", { precision: 10, scale: 2 }).notNull(),
  raised: numeric("raised", { precision: 10, scale: 2 }).default("0"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  youtubeId: text("youtube_id").notNull(),
  category: text("category").notNull(), // "sermon", "teaching", "testimony"
  speaker: text("speaker"),
  date: text("date").notNull(),
  duration: text("duration"),
  thumbnailUrl: text("thumbnail_url"),
  viewCount: integer("view_count").default(0),
  isLive: boolean("is_live").default(false),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Newsletter subscribers table
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

// Event registrations table
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  numberOfAttendees: integer("number_of_attendees").default(1),
  specialRequests: text("special_requests"),
  registeredAt: timestamp("registered_at").defaultNow(),
});

// Blog comments table
export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  blogPostId: integer("blog_post_id").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pages table for dynamic page management
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(), // JSON structure for page blocks
  isPublished: boolean("is_published").default(false),
  isDefault: boolean("is_default").default(false), // for default pages like Home, About
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Menu items table for dynamic menu management
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  parentId: integer("parent_id"), // for dropdown submenus
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Landing page sections for drag-and-drop management
export const landingPageSections = pgTable("landing_page_sections", {
  id: serial("id").primaryKey(),
  sectionType: text("section_type").notNull(), // hero, announcements, events, sermons, etc.
  title: text("title").notNull(),
  content: text("content").notNull(), // JSON data for section configuration
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reusable blocks library
export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  blockType: text("block_type").notNull(), // header, footer, testimony, gallery, etc.
  content: text("content").notNull(), // JSON structure
  thumbnail: text("thumbnail"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Header configuration
export const headerConfig = pgTable("header_config", {
  id: serial("id").primaryKey(),
  logoUrl: text("logo_url"),
  logoPosition: text("logo_position").default("left"),
  logoSize: text("logo_size").default("medium"),
  backgroundColor: text("background_color").default("#ffffff"),
  textColor: text("text_color").default("#000000"),
  menuStyle: text("menu_style").default("horizontal"),
  socialLinks: text("social_links"), // JSON array
  contactInfo: text("contact_info"), // JSON object
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Footer configuration
export const footerConfig = pgTable("footer_config", {
  id: serial("id").primaryKey(),
  backgroundColor: text("background_color").default("#1a1a1a"),
  textColor: text("text_color").default("#ffffff"),
  columns: text("columns").notNull(), // JSON structure for footer columns
  socialLinks: text("social_links"), // JSON array
  contactInfo: text("contact_info"), // JSON object
  copyrightText: text("copyright_text"),
  newsletterEnabled: boolean("newsletter_enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHeroSlideSchema = createInsertSchema(heroSlides).omit({
  id: true,
});

export const insertAboutContentSchema = createInsertSchema(aboutContent).omit({
  id: true,
});

export const insertServiceScheduleSchema = createInsertSchema(serviceSchedules).omit({
  id: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertBibleVerseSchema = createInsertSchema(bibleVerse).omit({
  id: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentAttendees: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertDonationCampaignSchema = createInsertSchema(donationCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  raised: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  viewCount: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({
  id: true,
  registeredAt: true,
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  createdAt: true,
  isApproved: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export const insertLandingPageSectionSchema = createInsertSchema(landingPageSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentBlockSchema = createInsertSchema(contentBlocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHeaderConfigSchema = createInsertSchema(headerConfig).omit({
  id: true,
  updatedAt: true,
});

export const insertFooterConfigSchema = createInsertSchema(footerConfig).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;

export type AboutContent = typeof aboutContent.$inferSelect;
export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;

export type ServiceSchedule = typeof serviceSchedules.$inferSelect;
export type InsertServiceSchedule = z.infer<typeof insertServiceScheduleSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type BibleVerse = typeof bibleVerse.$inferSelect;
export type InsertBibleVerse = z.infer<typeof insertBibleVerseSchema>;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type DonationCampaign = typeof donationCampaigns.$inferSelect;
export type InsertDonationCampaign = z.infer<typeof insertDonationCampaignSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;

export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type LandingPageSection = typeof landingPageSections.$inferSelect;
export type InsertLandingPageSection = z.infer<typeof insertLandingPageSectionSchema>;

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = z.infer<typeof insertContentBlockSchema>;

export type HeaderConfig = typeof headerConfig.$inferSelect;
export type InsertHeaderConfig = z.infer<typeof insertHeaderConfigSchema>;

export type FooterConfig = typeof footerConfig.$inferSelect;
export type InsertFooterConfig = z.infer<typeof insertFooterConfigSchema>;

// Relations
export const eventsRelations = relations(events, ({ many }) => ({
  registrations: many(eventRegistrations),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  campaign: one(donationCampaigns, {
    fields: [donations.campaignId],
    references: [donationCampaigns.id],
  }),
}));

export const donationCampaignsRelations = relations(donationCampaigns, ({ many }) => ({
  donations: many(donations),
}));

export const blogPostsRelations = relations(blogPosts, ({ many }) => ({
  comments: many(blogComments),
}));

export const blogCommentsRelations = relations(blogComments, ({ one }) => ({
  blogPost: one(blogPosts, {
    fields: [blogComments.blogPostId],
    references: [blogPosts.id],
  }),
}));
