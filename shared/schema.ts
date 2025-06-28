import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
