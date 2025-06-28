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
  insertSiteSettingsSchema
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

  const httpServer = createServer(app);
  return httpServer;
}
