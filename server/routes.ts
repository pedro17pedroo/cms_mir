import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertHeroSlideSchema,
  insertAboutContentSchema,
  insertServiceScheduleSchema,
  insertMessageSchema,
  insertTestimonialSchema,
  insertBibleVerseSchema,
  insertSiteSettingsSchema,
  insertEventSchema,
  insertBlogPostSchema,
  insertDonationSchema,
  insertDonationCampaignSchema,
  insertVideoSchema,
  insertNewsletterSubscriberSchema,
  insertEventRegistrationSchema,
  insertPageSchema,
  insertMenuItemSchema,
  insertLandingPageSectionSchema,
  insertContentBlockSchema,
  insertHeaderConfigSchema,
  insertFooterConfigSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Hero slides routes
  app.get("/api/hero-slides", async (req, res) => {
    const slides = await storage.getHeroSlides();
    res.json(slides);
  });

  app.post("/api/hero-slides", async (req, res) => {
    try {
      const slide = insertHeroSlideSchema.parse(req.body);
      const newSlide = await storage.createHeroSlide(slide);
      res.json(newSlide);
    } catch (error) {
      res.status(400).json({ error: "Invalid slide data" });
    }
  });

  app.put("/api/hero-slides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const slide = insertHeroSlideSchema.partial().parse(req.body);
      const updatedSlide = await storage.updateHeroSlide(id, slide);
      if (!updatedSlide) {
        return res.status(404).json({ error: "Slide not found" });
      }
      res.json(updatedSlide);
    } catch (error) {
      res.status(400).json({ error: "Invalid slide data" });
    }
  });

  app.delete("/api/hero-slides/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteHeroSlide(id);
    if (!deleted) {
      return res.status(404).json({ error: "Slide not found" });
    }
    res.json({ success: true });
  });

  // About content routes
  app.get("/api/about-content", async (req, res) => {
    const content = await storage.getAboutContent();
    res.json(content);
  });

  app.post("/api/about-content", async (req, res) => {
    try {
      const content = insertAboutContentSchema.parse(req.body);
      const newContent = await storage.createAboutContent(content);
      res.json(newContent);
    } catch (error) {
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  app.put("/api/about-content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = insertAboutContentSchema.partial().parse(req.body);
      const updatedContent = await storage.updateAboutContent(id, content);
      if (!updatedContent) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(updatedContent);
    } catch (error) {
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  // Service schedules routes
  app.get("/api/service-schedules", async (req, res) => {
    const schedules = await storage.getServiceSchedules();
    res.json(schedules);
  });

  app.post("/api/service-schedules", async (req, res) => {
    try {
      const schedule = insertServiceScheduleSchema.parse(req.body);
      const newSchedule = await storage.createServiceSchedule(schedule);
      res.json(newSchedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  app.put("/api/service-schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const schedule = insertServiceScheduleSchema.partial().parse(req.body);
      const updatedSchedule = await storage.updateServiceSchedule(id, schedule);
      if (!updatedSchedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }
      res.json(updatedSchedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  // Messages routes
  app.get("/api/messages", async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.get("/api/messages/featured", async (req, res) => {
    const message = await storage.getFeaturedMessage();
    res.json(message);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const message = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(message);
      res.json(newMessage);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.put("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = insertMessageSchema.partial().parse(req.body);
      const updatedMessage = await storage.updateMessage(id, message);
      if (!updatedMessage) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(updatedMessage);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.delete("/api/messages/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteMessage(id);
    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ success: true });
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const testimonial = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(testimonial);
      res.json(newTestimonial);
    } catch (error) {
      res.status(400).json({ error: "Invalid testimonial data" });
    }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = insertTestimonialSchema.partial().parse(req.body);
      const updatedTestimonial = await storage.updateTestimonial(id, testimonial);
      if (!updatedTestimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(updatedTestimonial);
    } catch (error) {
      res.status(400).json({ error: "Invalid testimonial data" });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteTestimonial(id);
    if (!deleted) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json({ success: true });
  });

  // Bible verse routes
  app.get("/api/bible-verse", async (req, res) => {
    const verse = await storage.getBibleVerse();
    res.json(verse);
  });

  app.put("/api/bible-verse", async (req, res) => {
    try {
      const verse = insertBibleVerseSchema.parse(req.body);
      const updatedVerse = await storage.updateBibleVerse(verse);
      res.json(updatedVerse);
    } catch (error) {
      res.status(400).json({ error: "Invalid verse data" });
    }
  });

  // Site settings routes
  app.get("/api/site-settings", async (req, res) => {
    const settings = await storage.getSiteSettings();
    res.json(settings);
  });

  app.get("/api/site-settings/:key", async (req, res) => {
    const setting = await storage.getSiteSetting(req.params.key);
    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }
    res.json(setting);
  });

  app.put("/api/site-settings/:key", async (req, res) => {
    try {
      const { value } = req.body;
      if (typeof value !== 'string') {
        return res.status(400).json({ error: "Value must be a string" });
      }
      const setting = await storage.updateSiteSetting(req.params.key, value);
      res.json(setting);
    } catch (error) {
      res.status(400).json({ error: "Invalid setting data" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const event = await storage.getEvent(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  });

  app.post("/api/events", async (req, res) => {
    try {
      const event = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(event);
      res.json(newEvent);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(id, event);
      if (!updatedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteEvent(id);
    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ success: true });
  });

  // Event registrations routes
  app.get("/api/events/:eventId/registrations", async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const registrations = await storage.getEventRegistrations(eventId);
    res.json(registrations);
  });

  app.post("/api/event-registrations", async (req, res) => {
    try {
      const registration = insertEventRegistrationSchema.parse(req.body);
      const newRegistration = await storage.createEventRegistration(registration);
      res.json(newRegistration);
    } catch (error) {
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  // Blog posts routes
  app.get("/api/blog-posts", async (req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await storage.getBlogPost(id);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  });

  app.get("/api/blog-posts/slug/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const post = insertBlogPostSchema.parse(req.body);
      const newPost = await storage.createBlogPost(post);
      res.json(newPost);
    } catch (error) {
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = insertBlogPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updateBlogPost(id, post);
      if (!updatedPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteBlogPost(id);
    if (!deleted) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json({ success: true });
  });

  // Donations routes
  app.get("/api/donations", async (req, res) => {
    const donations = await storage.getDonations();
    res.json(donations);
  });

  app.get("/api/donations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const donation = await storage.getDonation(id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    res.json(donation);
  });

  app.post("/api/donations", async (req, res) => {
    try {
      const donation = insertDonationSchema.parse(req.body);
      const newDonation = await storage.createDonation(donation);
      res.json(newDonation);
    } catch (error) {
      res.status(400).json({ error: "Invalid donation data" });
    }
  });

  app.patch("/api/donations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: "Status is required" });
      }
      const updatedDonation = await storage.updateDonationStatus(id, status);
      if (!updatedDonation) {
        return res.status(404).json({ error: "Donation not found" });
      }
      res.json(updatedDonation);
    } catch (error) {
      res.status(400).json({ error: "Invalid status data" });
    }
  });

  // Donation campaigns routes
  app.get("/api/donation-campaigns", async (req, res) => {
    const campaigns = await storage.getDonationCampaigns();
    res.json(campaigns);
  });

  app.get("/api/donation-campaigns/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const campaign = await storage.getDonationCampaign(id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.json(campaign);
  });

  app.post("/api/donation-campaigns", async (req, res) => {
    try {
      const campaign = insertDonationCampaignSchema.parse(req.body);
      const newCampaign = await storage.createDonationCampaign(campaign);
      res.json(newCampaign);
    } catch (error) {
      res.status(400).json({ error: "Invalid campaign data" });
    }
  });

  app.put("/api/donation-campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = insertDonationCampaignSchema.partial().parse(req.body);
      const updatedCampaign = await storage.updateDonationCampaign(id, campaign);
      if (!updatedCampaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(updatedCampaign);
    } catch (error) {
      res.status(400).json({ error: "Invalid campaign data" });
    }
  });

  // Videos routes
  app.get("/api/videos", async (req, res) => {
    const videos = await storage.getVideos();
    res.json(videos);
  });

  app.get("/api/videos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const video = await storage.getVideo(id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const video = insertVideoSchema.parse(req.body);
      const newVideo = await storage.createVideo(video);
      res.json(newVideo);
    } catch (error) {
      res.status(400).json({ error: "Invalid video data" });
    }
  });

  app.put("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = insertVideoSchema.partial().parse(req.body);
      const updatedVideo = await storage.updateVideo(id, video);
      if (!updatedVideo) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(updatedVideo);
    } catch (error) {
      res.status(400).json({ error: "Invalid video data" });
    }
  });

  app.delete("/api/videos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteVideo(id);
    if (!deleted) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json({ success: true });
  });

  // Newsletter routes
  app.get("/api/newsletter-subscribers", async (req, res) => {
    const subscribers = await storage.getNewsletterSubscribers();
    res.json(subscribers);
  });

  app.post("/api/newsletter-subscribers", async (req, res) => {
    try {
      const subscriber = insertNewsletterSubscriberSchema.parse(req.body);
      const newSubscriber = await storage.createNewsletterSubscriber(subscriber);
      res.json(newSubscriber);
    } catch (error) {
      res.status(400).json({ error: "Invalid subscriber data" });
    }
  });

  app.post("/api/newsletter-unsubscribe", async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: "Email is required" });
    }
    const unsubscribed = await storage.unsubscribe(email);
    if (!unsubscribed) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    res.json({ success: true });
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate a simple session token (in production, use proper JWT)
      const token = `session_${user.id}_${Date.now()}`;
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: "admin" // Default role for now
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    // In a real app, invalidate the token
    res.json({ success: true });
  });

  // Contact form route
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Name, email, subject and message are required" });
      }

      // In a real app, you would:
      // 1. Save the contact message to database
      // 2. Send email to administrators
      // 3. Send auto-reply to user
      
      // For now, just log the contact attempt
      console.log("Contact form submission:", { name, email, subject, message, phone });
      
      res.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Analytics route for admin dashboard
  app.get("/api/analytics", async (req, res) => {
    try {
      // Get basic statistics
      const [
        totalEvents,
        totalMessages,
        totalTestimonials,
        totalVideos,
        totalSubscribers,
        totalDonations
      ] = await Promise.all([
        storage.getEvents().then(events => events.length),
        storage.getMessages().then(messages => messages.length),
        storage.getTestimonials().then(testimonials => testimonials.length),
        storage.getVideos().then(videos => videos.length),
        storage.getNewsletterSubscribers().then(subs => subs.length),
        storage.getDonations().then(donations => donations.length)
      ]);

      res.json({
        totalEvents,
        totalMessages,
        totalTestimonials,
        totalVideos,
        totalSubscribers,
        totalDonations,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Erro ao carregar analytics" });
    }
  });

  // Pages routes
  app.get("/api/pages", async (req, res) => {
    const pages = await storage.getPages();
    res.json(pages);
  });

  app.post("/api/pages", async (req, res) => {
    try {
      const page = insertPageSchema.parse(req.body);
      const newPage = await storage.createPage(page);
      res.json(newPage);
    } catch (error) {
      res.status(400).json({ error: "Invalid page data" });
    }
  });

  app.put("/api/pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = insertPageSchema.partial().parse(req.body);
      const updatedPage = await storage.updatePage(id, page);
      if (!updatedPage) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(updatedPage);
    } catch (error) {
      res.status(400).json({ error: "Invalid page data" });
    }
  });

  app.delete("/api/pages/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deletePage(id);
    if (!deleted) {
      return res.status(404).json({ error: "Page not found" });
    }
    res.json({ success: true });
  });

  // Menu items routes
  app.get("/api/menu-items", async (req, res) => {
    const menuItems = await storage.getMenuItems();
    res.json(menuItems);
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const menuItem = insertMenuItemSchema.parse(req.body);
      const newMenuItem = await storage.createMenuItem(menuItem);
      res.json(newMenuItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid menu item data" });
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const menuItem = insertMenuItemSchema.partial().parse(req.body);
      const updatedMenuItem = await storage.updateMenuItem(id, menuItem);
      if (!updatedMenuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(updatedMenuItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid menu item data" });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteMenuItem(id);
    if (!deleted) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({ success: true });
  });

  // Landing page sections routes
  app.get("/api/landing-page-sections", async (req, res) => {
    const sections = await storage.getLandingPageSections();
    res.json(sections);
  });

  app.post("/api/landing-page-sections", async (req, res) => {
    try {
      const section = insertLandingPageSectionSchema.parse(req.body);
      const newSection = await storage.createLandingPageSection(section);
      res.json(newSection);
    } catch (error) {
      res.status(400).json({ error: "Invalid section data" });
    }
  });

  app.put("/api/landing-page-sections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const section = insertLandingPageSectionSchema.partial().parse(req.body);
      const updatedSection = await storage.updateLandingPageSection(id, section);
      if (!updatedSection) {
        return res.status(404).json({ error: "Section not found" });
      }
      res.json(updatedSection);
    } catch (error) {
      res.status(400).json({ error: "Invalid section data" });
    }
  });

  app.delete("/api/landing-page-sections/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteLandingPageSection(id);
    if (!deleted) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.json({ success: true });
  });

  // Content blocks routes
  app.get("/api/content-blocks", async (req, res) => {
    const blocks = await storage.getContentBlocks();
    res.json(blocks);
  });

  app.post("/api/content-blocks", async (req, res) => {
    try {
      const block = insertContentBlockSchema.parse(req.body);
      const newBlock = await storage.createContentBlock(block);
      res.json(newBlock);
    } catch (error) {
      res.status(400).json({ error: "Invalid content block data" });
    }
  });

  app.put("/api/content-blocks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const block = insertContentBlockSchema.partial().parse(req.body);
      const updatedBlock = await storage.updateContentBlock(id, block);
      if (!updatedBlock) {
        return res.status(404).json({ error: "Content block not found" });
      }
      res.json(updatedBlock);
    } catch (error) {
      res.status(400).json({ error: "Invalid content block data" });
    }
  });

  app.delete("/api/content-blocks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteContentBlock(id);
    if (!deleted) {
      return res.status(404).json({ error: "Content block not found" });
    }
    res.json({ success: true });
  });

  // Header config routes
  app.get("/api/header-config", async (req, res) => {
    const config = await storage.getHeaderConfig();
    res.json(config || {});
  });

  app.post("/api/header-config", async (req, res) => {
    try {
      const config = insertHeaderConfigSchema.parse(req.body);
      const newConfig = await storage.updateHeaderConfig(config);
      res.json(newConfig);
    } catch (error) {
      res.status(400).json({ error: "Invalid header config data" });
    }
  });

  // Footer config routes
  app.get("/api/footer-config", async (req, res) => {
    const config = await storage.getFooterConfig();
    res.json(config || {});
  });

  app.post("/api/footer-config", async (req, res) => {
    try {
      const config = insertFooterConfigSchema.parse(req.body);
      const newConfig = await storage.updateFooterConfig(config);
      res.json(newConfig);
    } catch (error) {
      res.status(400).json({ error: "Invalid footer config data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
