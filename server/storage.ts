import { 
  users, type User, type InsertUser,
  heroSlides, type HeroSlide, type InsertHeroSlide,
  aboutContent, type AboutContent, type InsertAboutContent,
  serviceSchedules, type ServiceSchedule, type InsertServiceSchedule,
  messages, type Message, type InsertMessage,
  testimonials, type Testimonial, type InsertTestimonial,
  bibleVerse, type BibleVerse, type InsertBibleVerse,
  siteSettings, type SiteSettings, type InsertSiteSettings
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private heroSlides: Map<number, HeroSlide>;
  private aboutContent: Map<number, AboutContent>;
  private serviceSchedules: Map<number, ServiceSchedule>;
  private messages: Map<number, Message>;
  private testimonials: Map<number, Testimonial>;
  private bibleVerse: BibleVerse | undefined;
  private siteSettings: Map<string, SiteSettings>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.heroSlides = new Map();
    this.aboutContent = new Map();
    this.serviceSchedules = new Map();
    this.messages = new Map();
    this.testimonials = new Map();
    this.siteSettings = new Map();
    this.currentId = 1;
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default hero slide
    this.heroSlides.set(1, {
      id: 1,
      title: "Vivendo com Fé: Um Caminho para a Esperança",
      description: "Reflexões sobre como fortalecer a fé em tempos desafiadores e encontrar esperança no dia a dia através da palavra de Deus.",
      buttonText: "Ver Transmissão",
      buttonLink: "#",
      backgroundImage: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080",
      isActive: true,
      order: 1
    });

    // Initialize about content
    this.aboutContent.set(1, {
      id: 1,
      section: "vision",
      title: "Nossa Visão",
      content: "Nossa visão é ver vidas transformadas pelo poder de Jesus Cristo, formando-se discípulos comprometidos que vivem e espalham o amor de Deus em suas famílias, comunidades e em todo o mundo.",
      icon: "fas fa-eye"
    });

    this.aboutContent.set(2, {
      id: 2,
      section: "mission",
      title: "Nossa Missão",
      content: "Somos chamados a proclamar o Evangelho de Jesus Cristo, fazer discípulos e equipar a igreja para uma vida de fé, oração e serviço, promovendo uma comunidade acolhedora e guiada pelo Espírito Santo.",
      icon: "fas fa-flag"
    });

    this.aboutContent.set(3, {
      id: 3,
      section: "beliefs",
      title: "O que Cremos",
      content: "Cremos na Trindade, na salvação pela graça através da fé em Jesus Cristo, no poder do Espírito Santo para transformar vidas e na autoridade da Bíblia como a Palavra de Deus para nossa fé e prática.",
      icon: "fas fa-users"
    });

    // Initialize service schedules
    this.serviceSchedules.set(1, {
      id: 1,
      day: "Domingo",
      title: "Culto de Adoração e Palavra",
      description: "Culto de Adoração e Palavra",
      time: "07:30 até 09:20, 09:40 até 11:30",
      icon: "fas fa-church"
    });

    this.serviceSchedules.set(2, {
      id: 2,
      day: "Quarta-feira",
      title: "Culto de Ensino da Palavra",
      description: "Culto de Ensino da Palavra",
      time: "17:30 até 19:30",
      icon: "fas fa-book"
    });

    this.serviceSchedules.set(3, {
      id: 3,
      day: "Sábado",
      title: "Encontros de Oração",
      description: "Encontros de Oração",
      time: "07:30 até 09:00",
      icon: "fas fa-praying-hands"
    });

    // Initialize testimonials
    this.testimonials.set(1, {
      id: 1,
      name: "Ana Souza",
      location: "Viana, Luanda",
      content: "Participar das reuniões e cultos na nossa igreja renovou a minha fé e me deu forças para enfrentar os desafios do dia a dia. A comunhão com outros membros é uma verdadeira bênção.",
      initial: "A"
    });

    this.testimonials.set(2, {
      id: 2,
      name: "Carlos Mendes",
      location: "Lubango, Huíla",
      content: "A experiência na igreja tem sido transformadora para mim e minha família. A palavra de Deus aqui é transmitida com amor, e a comunidade é acolhedora e sempre disposta a ajudar.",
      initial: "C"
    });

    // Initialize bible verse
    this.bibleVerse = {
      id: 1,
      verse: "Busquem o Senhor e a sua força; procurem sempre a sua face!",
      reference: "1 CRÔNICAS 16:11",
      backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080"
    };

    this.currentId = 10;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Hero slides methods
  async getHeroSlides(): Promise<HeroSlide[]> {
    return Array.from(this.heroSlides.values()).sort((a, b) => a.order - b.order);
  }

  async createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide> {
    const id = this.currentId++;
    const newSlide: HeroSlide = { ...slide, id };
    this.heroSlides.set(id, newSlide);
    return newSlide;
  }

  async updateHeroSlide(id: number, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined> {
    const existing = this.heroSlides.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...slide };
    this.heroSlides.set(id, updated);
    return updated;
  }

  async deleteHeroSlide(id: number): Promise<boolean> {
    return this.heroSlides.delete(id);
  }

  // About content methods
  async getAboutContent(): Promise<AboutContent[]> {
    return Array.from(this.aboutContent.values());
  }

  async createAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const id = this.currentId++;
    const newContent: AboutContent = { ...content, id };
    this.aboutContent.set(id, newContent);
    return newContent;
  }

  async updateAboutContent(id: number, content: Partial<InsertAboutContent>): Promise<AboutContent | undefined> {
    const existing = this.aboutContent.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...content };
    this.aboutContent.set(id, updated);
    return updated;
  }

  // Service schedules methods
  async getServiceSchedules(): Promise<ServiceSchedule[]> {
    return Array.from(this.serviceSchedules.values());
  }

  async createServiceSchedule(schedule: InsertServiceSchedule): Promise<ServiceSchedule> {
    const id = this.currentId++;
    const newSchedule: ServiceSchedule = { ...schedule, id };
    this.serviceSchedules.set(id, newSchedule);
    return newSchedule;
  }

  async updateServiceSchedule(id: number, schedule: Partial<InsertServiceSchedule>): Promise<ServiceSchedule | undefined> {
    const existing = this.serviceSchedules.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...schedule };
    this.serviceSchedules.set(id, updated);
    return updated;
  }

  // Messages methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getFeaturedMessage(): Promise<Message | undefined> {
    return Array.from(this.messages.values()).find(message => message.isFeatured);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const newMessage: Message = { ...message, id };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async updateMessage(id: number, message: Partial<InsertMessage>): Promise<Message | undefined> {
    const existing = this.messages.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...message };
    this.messages.set(id, updated);
    return updated;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Testimonials methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId++;
    const newTestimonial: Testimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const existing = this.testimonials.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...testimonial };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Bible verse methods
  async getBibleVerse(): Promise<BibleVerse | undefined> {
    return this.bibleVerse;
  }

  async updateBibleVerse(verse: InsertBibleVerse): Promise<BibleVerse> {
    this.bibleVerse = { ...verse, id: 1 };
    return this.bibleVerse;
  }

  // Site settings methods
  async getSiteSettings(): Promise<SiteSettings[]> {
    return Array.from(this.siteSettings.values());
  }

  async getSiteSetting(key: string): Promise<SiteSettings | undefined> {
    return this.siteSettings.get(key);
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSettings> {
    const existing = this.siteSettings.get(key);
    const setting: SiteSettings = existing ? { ...existing, value } : { id: this.currentId++, key, value };
    this.siteSettings.set(key, setting);
    return setting;
  }
}

export const storage = new MemStorage();
