import { 
  users, heroSlides, aboutContent, serviceSchedules, messages, 
  testimonials, bibleVerse, siteSettings, events, blogPosts, 
  donations, donationCampaigns, videos, newsletterSubscribers, 
  eventRegistrations,
  type User, type InsertUser, type HeroSlide, type InsertHeroSlide,
  type AboutContent, type InsertAboutContent, type ServiceSchedule, type InsertServiceSchedule,
  type Message, type InsertMessage, type Testimonial, type InsertTestimonial,
  type BibleVerse, type InsertBibleVerse, type SiteSettings, type InsertSiteSettings,
  type Event, type InsertEvent, type BlogPost, type InsertBlogPost,
  type Donation, type InsertDonation, type DonationCampaign, type InsertDonationCampaign,
  type Video, type InsertVideo, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type EventRegistration, type InsertEventRegistration
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Hero slides methods
  getHeroSlides(): Promise<HeroSlide[]>;
  createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide>;
  updateHeroSlide(id: number, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined>;
  deleteHeroSlide(id: number): Promise<boolean>;

  // About content methods
  getAboutContent(): Promise<AboutContent[]>;
  createAboutContent(content: InsertAboutContent): Promise<AboutContent>;
  updateAboutContent(id: number, content: Partial<InsertAboutContent>): Promise<AboutContent | undefined>;

  // Service schedules methods
  getServiceSchedules(): Promise<ServiceSchedule[]>;
  createServiceSchedule(schedule: InsertServiceSchedule): Promise<ServiceSchedule>;
  updateServiceSchedule(id: number, schedule: Partial<InsertServiceSchedule>): Promise<ServiceSchedule | undefined>;

  // Messages methods
  getMessages(): Promise<Message[]>;
  getFeaturedMessage(): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, message: Partial<InsertMessage>): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;

  // Testimonials methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Bible verse methods
  getBibleVerse(): Promise<BibleVerse | undefined>;
  updateBibleVerse(verse: InsertBibleVerse): Promise<BibleVerse>;

  // Site settings methods
  getSiteSettings(): Promise<SiteSettings[]>;
  getSiteSetting(key: string): Promise<SiteSettings | undefined>;
  updateSiteSetting(key: string, value: string): Promise<SiteSettings>;

  // Events methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Blog posts methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Donations methods
  getDonations(): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string): Promise<Donation | undefined>;

  // Donation campaigns methods
  getDonationCampaigns(): Promise<DonationCampaign[]>;
  getDonationCampaign(id: number): Promise<DonationCampaign | undefined>;
  createDonationCampaign(campaign: InsertDonationCampaign): Promise<DonationCampaign>;
  updateDonationCampaign(id: number, campaign: Partial<InsertDonationCampaign>): Promise<DonationCampaign | undefined>;
  updateCampaignRaised(id: number, amount: number): Promise<DonationCampaign | undefined>;

  // Videos methods
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;

  // Newsletter methods
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  unsubscribe(email: string): Promise<boolean>;

  // Event registrations methods
  getEventRegistrations(eventId: number): Promise<EventRegistration[]>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getHeroSlides(): Promise<HeroSlide[]> {
    const slides = await db.select().from(heroSlides).orderBy(heroSlides.order);
    return slides;
  }

  async createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide> {
    const [newSlide] = await db
      .insert(heroSlides)
      .values(slide)
      .returning();
    return newSlide;
  }

  async updateHeroSlide(id: number, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined> {
    const [updated] = await db
      .update(heroSlides)
      .set(slide)
      .where(eq(heroSlides.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteHeroSlide(id: number): Promise<boolean> {
    const result = await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAboutContent(): Promise<AboutContent[]> {
    return await db.select().from(aboutContent);
  }

  async createAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const [newContent] = await db
      .insert(aboutContent)
      .values(content)
      .returning();
    return newContent;
  }

  async updateAboutContent(id: number, content: Partial<InsertAboutContent>): Promise<AboutContent | undefined> {
    const [updated] = await db
      .update(aboutContent)
      .set(content)
      .where(eq(aboutContent.id, id))
      .returning();
    return updated || undefined;
  }

  async getServiceSchedules(): Promise<ServiceSchedule[]> {
    return await db.select().from(serviceSchedules);
  }

  async createServiceSchedule(schedule: InsertServiceSchedule): Promise<ServiceSchedule> {
    const [newSchedule] = await db
      .insert(serviceSchedules)
      .values(schedule)
      .returning();
    return newSchedule;
  }

  async updateServiceSchedule(id: number, schedule: Partial<InsertServiceSchedule>): Promise<ServiceSchedule | undefined> {
    const [updated] = await db
      .update(serviceSchedules)
      .set(schedule)
      .where(eq(serviceSchedules.id, id))
      .returning();
    return updated || undefined;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages);
  }

  async getFeaturedMessage(): Promise<Message | undefined> {
    const [featured] = await db.select().from(messages).where(eq(messages.isFeatured, true));
    return featured || undefined;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async updateMessage(id: number, message: Partial<InsertMessage>): Promise<Message | undefined> {
    const [updated] = await db
      .update(messages)
      .set(message)
      .where(eq(messages.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updated] = await db
      .update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getBibleVerse(): Promise<BibleVerse | undefined> {
    const [verse] = await db.select().from(bibleVerse);
    return verse || undefined;
  }

  async updateBibleVerse(verse: InsertBibleVerse): Promise<BibleVerse> {
    // Delete existing and insert new one (since there should be only one)
    await db.delete(bibleVerse);
    const [newVerse] = await db
      .insert(bibleVerse)
      .values(verse)
      .returning();
    return newVerse;
  }

  async getSiteSettings(): Promise<SiteSettings[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSettings | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSettings> {
    const existing = await this.getSiteSetting(key);
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ value })
        .where(eq(siteSettings.key, key))
        .returning();
      return updated;
    } else {
      const [newSetting] = await db
        .insert(siteSettings)
        .values({ key, value })
        .returning();
      return newSetting;
    }
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db
      .insert(events)
      .values({
        ...event,
        currentAttendees: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db
      .update(events)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values({
        ...post,
        viewCount: 0,
        tags: post.tags || [],
        publishedAt: post.isPublished ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations);
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation || undefined;
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [newDonation] = await db
      .insert(donations)
      .values({
        ...donation,
        createdAt: new Date()
      })
      .returning();
    return newDonation;
  }

  async updateDonationStatus(id: number, status: string): Promise<Donation | undefined> {
    const [updated] = await db
      .update(donations)
      .set({ status })
      .where(eq(donations.id, id))
      .returning();
    return updated || undefined;
  }

  async getDonationCampaigns(): Promise<DonationCampaign[]> {
    return await db.select().from(donationCampaigns);
  }

  async getDonationCampaign(id: number): Promise<DonationCampaign | undefined> {
    const [campaign] = await db.select().from(donationCampaigns).where(eq(donationCampaigns.id, id));
    return campaign || undefined;
  }

  async createDonationCampaign(campaign: InsertDonationCampaign): Promise<DonationCampaign> {
    const [newCampaign] = await db
      .insert(donationCampaigns)
      .values({
        ...campaign,
        raised: "0",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newCampaign;
  }

  async updateDonationCampaign(id: number, campaign: Partial<InsertDonationCampaign>): Promise<DonationCampaign | undefined> {
    const [updated] = await db
      .update(donationCampaigns)
      .set({ ...campaign, updatedAt: new Date() })
      .where(eq(donationCampaigns.id, id))
      .returning();
    return updated || undefined;
  }

  async updateCampaignRaised(id: number, amount: number): Promise<DonationCampaign | undefined> {
    const [updated] = await db
      .update(donationCampaigns)
      .set({ raised: amount.toString(), updatedAt: new Date() })
      .where(eq(donationCampaigns.id, id))
      .returning();
    return updated || undefined;
  }

  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos);
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values({
        ...video,
        viewCount: 0,
        createdAt: new Date()
      })
      .returning();
    return newVideo;
  }

  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined> {
    const [updated] = await db
      .update(videos)
      .set(video)
      .where(eq(videos.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db
      .insert(newsletterSubscribers)
      .values({
        ...subscriber,
        isActive: true,
        subscribedAt: new Date()
      })
      .returning();
    return newSubscriber;
  }

  async unsubscribe(email: string): Promise<boolean> {
    const result = await db
      .update(newsletterSubscribers)
      .set({ isActive: false })
      .where(eq(newsletterSubscribers.email, email));
    return (result.rowCount || 0) > 0;
  }

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId));
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const [newRegistration] = await db
      .insert(eventRegistrations)
      .values({
        ...registration,
        registeredAt: new Date()
      })
      .returning();
    return newRegistration;
  }
}

export const storage = new DatabaseStorage();