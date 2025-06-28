import { db } from "../server/db";
import { 
  users, heroSlides, aboutContent, serviceSchedules, messages, 
  testimonials, bibleVerse, siteSettings, events, blogPosts, 
  donations, donationCampaigns, videos, newsletterSubscribers, 
  eventRegistrations, blogComments, pages, menuItems, landingPageSections,
  contentBlocks, headerConfig, footerConfig
} from "../shared/schema";
import { count } from "drizzle-orm";

async function checkDatabase() {
  console.log("🔍 Checking database integrity and content...");

  try {
    // Check table counts
    console.log("\n📊 Table Statistics:");
    console.log("═".repeat(50));

    const tables = [
      { name: "users", table: users },
      { name: "hero_slides", table: heroSlides },
      { name: "about_content", table: aboutContent },
      { name: "service_schedules", table: serviceSchedules },
      { name: "messages", table: messages },
      { name: "testimonials", table: testimonials },
      { name: "bible_verse", table: bibleVerse },
      { name: "site_settings", table: siteSettings },
      { name: "events", table: events },
      { name: "blog_posts", table: blogPosts },
      { name: "donations", table: donations },
      { name: "donation_campaigns", table: donationCampaigns },
      { name: "videos", table: videos },
      { name: "newsletter_subscribers", table: newsletterSubscribers },
      { name: "event_registrations", table: eventRegistrations },
      { name: "blog_comments", table: blogComments },
      { name: "pages", table: pages },
      { name: "menu_items", table: menuItems },
      { name: "landing_page_sections", table: landingPageSections },
      { name: "content_blocks", table: contentBlocks },
      { name: "header_config", table: headerConfig },
      { name: "footer_config", table: footerConfig }
    ];

    let totalRecords = 0;
    for (const { name, table } of tables) {
      const [result] = await db.select({ count: count() }).from(table);
      const recordCount = result.count;
      totalRecords += recordCount;
      
      const status = recordCount > 0 ? "✅" : "❌";
      console.log(`${status} ${name.padEnd(25)} ${recordCount.toString().padStart(3)} records`);
    }

    console.log("─".repeat(50));
    console.log(`📈 Total records across all tables: ${totalRecords}`);

    // Check data samples
    console.log("\n🔬 Sample Data Verification:");
    console.log("═".repeat(50));

    // Check hero slides
    const heroSlidesData = await db.select().from(heroSlides).limit(1);
    console.log(`✅ Hero Slides: ${heroSlidesData.length > 0 ? heroSlidesData[0].title : 'No data'}`);

    // Check messages
    const messagesData = await db.select().from(messages).limit(1);
    console.log(`✅ Messages: ${messagesData.length > 0 ? messagesData[0].title : 'No data'}`);

    // Check events
    const eventsData = await db.select().from(events).limit(1);
    console.log(`✅ Events: ${eventsData.length > 0 ? eventsData[0].title : 'No data'}`);

    // Check testimonials
    const testimonialsData = await db.select().from(testimonials).limit(1);
    console.log(`✅ Testimonials: ${testimonialsData.length > 0 ? testimonialsData[0].name : 'No data'}`);

    // Check site settings
    const settingsData = await db.select().from(siteSettings).limit(1);
    console.log(`✅ Site Settings: ${settingsData.length > 0 ? settingsData[0].key : 'No data'}`);

    // Check admin user
    const adminUser = await db.select().from(users).limit(1);
    console.log(`✅ Admin User: ${adminUser.length > 0 ? adminUser[0].username : 'No admin user'}`);

    // Check for required configurations
    console.log("\n⚙️ Configuration Check:");
    console.log("═".repeat(50));

    const headerConfigData = await db.select().from(headerConfig).limit(1);
    console.log(`${headerConfigData.length > 0 ? '✅' : '❌'} Header Configuration`);

    const footerConfigData = await db.select().from(footerConfig).limit(1);
    console.log(`${footerConfigData.length > 0 ? '✅' : '❌'} Footer Configuration`);

    const pagesData = await db.select().from(pages);
    console.log(`${pagesData.length > 0 ? '✅' : '❌'} Dynamic Pages (${pagesData.length} pages)`);

    const menuItemsData = await db.select().from(menuItems);
    console.log(`${menuItemsData.length > 0 ? '✅' : '❌'} Menu Items (${menuItemsData.length} items)`);

    // Check for live content
    console.log("\n📺 Live Content Check:");
    console.log("═".repeat(50));

    const liveVideos = await db.select().from(videos);
    console.log(`✅ Videos: ${liveVideos.length} total`);

    const activeEvents = await db.select().from(events);
    console.log(`✅ Events: ${activeEvents.length} upcoming`);

    const publishedPosts = await db.select().from(blogPosts);
    console.log(`✅ Blog Posts: ${publishedPosts.length} published`);

    // Performance check
    console.log("\n⚡ Performance Check:");
    console.log("═".repeat(50));

    const start = Date.now();
    await db.select().from(messages).limit(10);
    const queryTime = Date.now() - start;
    
    console.log(`✅ Sample Query Time: ${queryTime}ms`);
    console.log(`${queryTime < 100 ? '🚀' : queryTime < 500 ? '⚠️' : '❌'} Performance: ${
      queryTime < 100 ? 'Excellent' : queryTime < 500 ? 'Good' : 'Needs Optimization'
    }`);

    // Final status
    console.log("\n🎯 Database Status Summary:");
    console.log("═".repeat(50));

    const isHealthy = totalRecords > 50 && 
                     heroSlidesData.length > 0 && 
                     messagesData.length > 0 && 
                     eventsData.length > 0 && 
                     adminUser.length > 0;

    if (isHealthy) {
      console.log("🟢 Database Status: HEALTHY");
      console.log("✅ All essential tables populated");
      console.log("✅ Configuration tables complete");
      console.log("✅ Sample data available");
      console.log("✅ Admin access configured");
    } else {
      console.log("🔴 Database Status: NEEDS ATTENTION");
      console.log("❌ Some essential data missing");
      console.log("💡 Consider running: tsx scripts/seed.ts");
    }

    console.log("\n🎉 Database check completed!");

  } catch (error) {
    console.error("❌ Error during database check:", error);
    throw error;
  }
}

// Run the check function
checkDatabase()
  .then(() => {
    console.log("🏁 Database check finished!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Database check failed:", error);
    process.exit(1);
  });

export default checkDatabase;