/**
 * Full data migration script
 * - Uploads all local gallery images to Cloudinary
 * - Seeds services, categories, and gallery images into MongoDB
 *
 * Usage: node scripts/migrate.mjs
 * Requires .env with MONGODB_URI and Cloudinary credentials.
 */

import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "prime_modulars";
const PUBLIC_DIR = resolve(__dirname, "../public");

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env");
  process.exit(1);
}

/* ── Cloudinary upload disabled — use admin UI instead ──── */
// Images keep their local paths (/assets/gallery/...).
// From the admin panel you can upload replacements to Cloudinary.
async function uploadToCloudinary() {
  return null;
}

/* ── Static source data (mirrors frontend fallbacks) ─────── */

const SERVICES = [
  {
    title: "Modular Kitchen",
    description: "Ergonomic, elegant kitchens tailored to how you cook and live.",
    iconName: "ChefHat",
    localImage: "/assets/gallery/kitchen-01.jpg",
    portfolioCategory: "Kitchens",
    order: 1,
  },
  {
    title: "Wardrobes",
    description: "Space-smart wardrobe solutions with premium laminates.",
    iconName: "DoorOpen",
    localImage: "/assets/gallery/wardrobe-01.jpg",
    portfolioCategory: "Wardrobes",
    order: 2,
  },
  {
    title: "TV Units",
    description: "Statement media walls and floating TV units.",
    iconName: "Tv",
    localImage: "/assets/gallery/tv-unit-01.jpg",
    portfolioCategory: "TV Units",
    order: 3,
  },
  {
    title: "Hall Partition",
    description: "Stylish dividers that add privacy without closing off space.",
    iconName: "Columns3",
    localImage: "/assets/gallery/entryway-01.jpg",
    portfolioCategory: "Entryway",
    order: 4,
  },
  {
    title: "Pooja Units",
    description: "Serene, beautifully detailed prayer spaces.",
    iconName: "Flame",
    localImage: "/assets/gallery/pooja-02.jpg",
    portfolioCategory: "Pooja Units",
    order: 5,
  },
  {
    title: "3D Designing",
    description: "Photorealistic 3D renders that help you visualize your space.",
    iconName: "Box",
    localImage: "/assets/gallery/ceiling-04.jpg",
    portfolioCategory: "All",
    order: 6,
  },
];

const CATEGORIES = [
  "Kitchens", "Living Rooms", "Wardrobes", "Bedrooms",
  "Ceilings", "Pooja Units", "TV Units", "Entryway",
];

const GALLERY_ITEMS = [
  { src: "/assets/gallery/kitchen-01.jpg", category: "Kitchens", caption: "Contemporary Open Kitchen — Tadepalli Residence" },
  { src: "/assets/gallery/kitchen-02.jpg", category: "Kitchens", caption: "White & Black Modular Kitchen — Guntur Villa" },
  { src: "/assets/gallery/kitchen-03.jpg", category: "Kitchens", caption: "Modern Island Kitchen — Mangalagiri Flat" },
  { src: "/assets/gallery/kitchen-04.jpg", category: "Kitchens", caption: "Luxury Kitchen with Brass Hardware" },
  { src: "/assets/gallery/kitchen-05.jpg", category: "Kitchens", caption: "Sleek Grey Kitchen — Vijayawada Home" },
  { src: "/assets/gallery/kitchen-06.jpg", category: "Kitchens", caption: "Full-Height Modular Kitchen — Tadepalli" },
  { src: "/assets/gallery/living-01.jpg", category: "Living Rooms", caption: "Luxe Living Room with Partition — Guntur Duplex" },
  { src: "/assets/gallery/living-02.jpg", category: "Living Rooms", caption: "Boucle Sofa Living — Tadepalli Residence" },
  { src: "/assets/gallery/living-03.jpg", category: "Living Rooms", caption: "Contemporary Living with Wood Ceiling" },
  { src: "/assets/gallery/living-04.jpg", category: "Living Rooms", caption: "Modern Lounge — Mangalagiri Apartment" },
  { src: "/assets/gallery/living-05.jpg", category: "Living Rooms", caption: "Open Plan Living & Dining" },
  { src: "/assets/gallery/living-06.jpg", category: "Living Rooms", caption: "Elegant Living Room with TV Wall" },
  { src: "/assets/gallery/living-07.jpg", category: "Living Rooms", caption: "Grand Living — Tadepalli Villa" },
  { src: "/assets/gallery/living-08.jpg", category: "Living Rooms", caption: "Neutral Luxury Living Room" },
  { src: "/assets/gallery/living-09.jpg", category: "Living Rooms", caption: "Contemporary Living with Lift Lobby" },
  { src: "/assets/gallery/living-10.jpg", category: "Living Rooms", caption: "Open Concept Living Room — Guntur" },
  { src: "/assets/gallery/wardrobe-01.jpg", category: "Wardrobes", caption: "Walk-in Wardrobe — Master Bedroom" },
  { src: "/assets/gallery/wardrobe-02.jpg", category: "Wardrobes", caption: "Sliding Mirror Wardrobe — Tadepalli" },
  { src: "/assets/gallery/wardrobe-03.jpg", category: "Wardrobes", caption: "Full-Height Wardrobe — Premium Finish" },
  { src: "/assets/gallery/wardrobe-04.jpg", category: "Wardrobes", caption: "Custom Wardrobe with Dressing Area" },
  { src: "/assets/gallery/wardrobe-05.jpg", category: "Wardrobes", caption: "Modular Wardrobe — Guntur Villa" },
  { src: "/assets/gallery/bedroom-01.jpg", category: "Bedrooms", caption: "Master Bedroom — Tadepalli Residence" },
  { src: "/assets/gallery/bedroom-02.jpg", category: "Bedrooms", caption: "Luxury Bedroom with Panelled Headboard" },
  { src: "/assets/gallery/bedroom-03.jpg", category: "Bedrooms", caption: "Cozy Bedroom with Cove Lighting" },
  { src: "/assets/gallery/bedroom-04.jpg", category: "Bedrooms", caption: "Contemporary Bedroom — Guntur Flat" },
  { src: "/assets/gallery/bedroom-05.jpg", category: "Bedrooms", caption: "Premium Bedroom Suite — Vijayawada" },
  { src: "/assets/gallery/bedroom-06.jpg", category: "Bedrooms", caption: "Bedroom with Teak Headboard Wall" },
  { src: "/assets/gallery/bedroom-07.jpg", category: "Bedrooms", caption: "Kids' Bedroom — Tadepalli Home" },
  { src: "/assets/gallery/bedroom-08.jpg", category: "Bedrooms", caption: "Neutral Bedroom — Mangalagiri Apt" },
  { src: "/assets/gallery/ceiling-01.jpg", category: "Ceilings", caption: "Layered False Ceiling with Cove Lighting" },
  { src: "/assets/gallery/ceiling-02.jpg", category: "Ceilings", caption: "Wooden Tray Ceiling — Dining Area" },
  { src: "/assets/gallery/ceiling-03.jpg", category: "Ceilings", caption: "False Ceiling with Pendant Lights" },
  { src: "/assets/gallery/ceiling-04.jpg", category: "Ceilings", caption: "Grand Ceiling Design — Tadepalli Villa" },
  { src: "/assets/gallery/pooja-01.jpg", category: "Pooja Units", caption: "Custom Teak Pooja Unit — Vijayawada" },
  { src: "/assets/gallery/pooja-02.jpg", category: "Pooja Units", caption: "Mandir with Marble Inlay — Guntur Home" },
  { src: "/assets/gallery/tv-unit-01.jpg", category: "TV Units", caption: "Floating TV Unit — Contemporary Living" },
  { src: "/assets/gallery/tv-unit-02.jpg", category: "TV Units", caption: "Full-Wall Media Unit — Tadepalli Residence" },
  { src: "/assets/gallery/entryway-01.jpg", category: "Entryway", caption: "Decorative Wood Partition — Foyer" },
  { src: "/assets/gallery/entryway-02.jpg", category: "Entryway", caption: "Statement Entryway — Guntur Duplex" },
  { src: "/assets/gallery/entryway-03.jpg", category: "Entryway", caption: "Geometric Partition — Staircase Lobby" },
  { src: "/assets/gallery/dining-01.jpg", category: "Living Rooms", caption: "Dining Area with Pichwai Mural — Tadepalli" },
  { src: "/assets/gallery/dining-02.jpg", category: "Living Rooms", caption: "Elegant Dining Space — Guntur Villa" },
];

/* ── Run migration ──────────────────────────────────────── */

async function migrate() {
  console.log("🚀 Starting full data migration...\n");

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB_NAME);

  const servicesCol = db.collection("services");
  const categoriesCol = db.collection("gallery_categories");
  const imagesCol = db.collection("gallery_images");

  // Clear existing data so re-runs are clean
  await servicesCol.deleteMany({});
  await categoriesCol.deleteMany({});
  await imagesCol.deleteMany({});
  console.log("   🧹 Cleared existing collections\n");

  // 1. Migrate Services (with Cloudinary upload for main image)
  console.log("📦 Migrating services...");
  let svcCount = 0;
  for (const svc of SERVICES) {
    let mainImage = svc.localImage;
    let publicId = "";

    const cloudResult = await uploadToCloudinary(svc.localImage, "services");
    if (cloudResult) {
      mainImage = cloudResult.url;
      publicId = cloudResult.publicId;
    }

    const doc = {
      title: svc.title,
      description: svc.description,
      iconName: svc.iconName,
      mainImage,
      mainImagePublicId: publicId,
      portfolioCategory: svc.portfolioCategory,
      order: svc.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = await servicesCol.findOne({ title: svc.title });
    if (existing) {
      await servicesCol.updateOne({ _id: existing._id }, { $set: doc });
      console.log(`   🔄 Updated: ${svc.title}`);
    } else {
      await servicesCol.insertOne(doc);
      console.log(`   ✅ Inserted: ${svc.title}`);
    }
    svcCount++;
  }

  // 2. Migrate Categories
  console.log("\n📂 Migrating gallery categories...");
  let catCount = 0;
  for (const name of CATEGORIES) {
    const existing = await categoriesCol.findOne({ name });
    if (!existing) {
      await categoriesCol.insertOne({
        name,
        description: `${name} gallery images`,
        imageCount: 0,
        createdAt: new Date().toISOString(),
      });
      console.log(`   ✅ Created category: ${name}`);
    } else {
      console.log(`   🔄 Skipped (exists): ${name}`);
    }
    catCount++;
  }

  // 3. Migrate Gallery Images (upload each to Cloudinary)
  console.log("\n🖼️ Migrating gallery images...");
  let imgCount = 0;
  let cloudUploaded = 0;

  for (const img of GALLERY_ITEMS) {
    const existing = await imagesCol.findOne({ src: img.src });
    if (existing) {
      console.log(`   🔄 Skipped (exists): ${img.caption}`);
      continue;
    }

    let finalSrc = img.src;
    let finalPublicId = "";

    const cloudResult = await uploadToCloudinary(img.src, `gallery/${img.category}`);
    if (cloudResult) {
      finalSrc = cloudResult.url;
      finalPublicId = cloudResult.publicId;
      cloudUploaded++;
    }

    await imagesCol.insertOne({
      src: finalSrc,
      publicId: finalPublicId,
      category: img.category,
      caption: img.caption,
      order: 0,
      createdAt: new Date().toISOString(),
    });
    imgCount++;
  }

  // 4. Update category image counts
  console.log("\n📊 Updating category image counts...");
  for (const name of CATEGORIES) {
    const count = await imagesCol.countDocuments({ category: name });
    await categoriesCol.updateOne({ name }, { $set: { imageCount: count } });
    console.log(`   📐 ${name}: ${count} images`);
  }

  await client.close();

  console.log("\n✅ Migration complete!");
  console.log(`   Services:        ${svcCount}`);
  console.log(`   Categories:      ${catCount}`);
  console.log(`   Gallery Images:  ${imgCount}`);
  console.log(`   Cloudinary URLs: ${cloudUploaded}`);
}

migrate().catch((err) => {
  console.error("\n❌ Migration failed:", err);
  process.exit(1);
});
