console.log("🚀 THIS IS SERVER.JS");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

let db;

app.get("/", (req, res) => {
  res.send("TechNest API is running");
});

app.get("/test", (req, res) => {
  res.send("THIS IS MY CURRENT SERVER");
});

async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    // await client.connect();
    db = client.db("TechNest");
    console.log("Connected to MongoDB");
    return client;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", db: db ? "connected" : "disconnected" });
});

// --- Products ---
app.get("/api/products", async (req, res) => {
  try {
    const { category, sort, deals, limit } = req.query;
    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (deals === "true") filter.originalPrice = { $exists: true, $ne: null };

    let cursor = db.collection("products").find(filter);

    if (sort === "price-low") cursor = cursor.sort({ price: 1 });
    else if (sort === "price-high") cursor = cursor.sort({ price: -1 });
    else if (sort === "rating") cursor = cursor.sort({ rating: -1 });
    else if (sort === "newest") cursor = cursor.sort({ _id: -1 });
    else cursor = cursor.sort({ reviews: -1 });

    if (limit) cursor = cursor.limit(parseInt(limit));

    const products = await cursor.toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/products/:slug", async (req, res) => {
  try {
    const product = await db
      .collection("products")
      .findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Create Product ---
app.post("/api/products", async (req, res) => {
  try {
    const product = {
      ...req.body,
      createdAt: new Date(),
    };
    if (!product.slug) {
      product.slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    const result = await db.collection("products").insertOne(product);
    res.status(201).json({ _id: result.insertedId, ...product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Update Product ---
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const updates = { ...req.body, updatedAt: new Date() };
    delete updates._id;

    const result = await db
      .collection("products")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: "after" },
      );

    if (!result || !result.value) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Categories ---
app.get("/api/categories", async (_req, res) => {
  try {
    const categories = await db.collection("categories").find().toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/categories/:slug", async (req, res) => {
  try {
    const category = await db
      .collection("categories")
      .findOne({ slug: req.params.slug });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    const products = await db
      .collection("products")
      .find({ category: req.params.slug })
      .toArray();
    res.json({ ...category, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Brands ---
app.get("/api/brands", async (_req, res) => {
  try {
    const brands = await db.collection("brands").find().toArray();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Testimonials ---
app.get("/api/testimonials", async (_req, res) => {
  try {
    const testimonials = await db.collection("testimonials").find().toArray();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Features ---
app.get("/api/features", async (_req, res) => {
  try {
    const features = await db.collection("features").find().toArray();
    res.json(features);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Orders ---
app.post("/api/orders", async (req, res) => {
  try {
    const order = { ...req.body, createdAt: new Date(), status: "Processing" };
    const result = await db.collection("orders").insertOne(order);
    res.status(201).json({ _id: result.insertedId, ...order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const orders = await db
      .collection("orders")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Seed data endpoint (dev only) ---
app.post("/api/seed", async (_req, res) => {
  console.log("===== NEW SEED ROUTE =====");
  try {
    const collections = [
      "products",
      "categories",
      "brands",
      "testimonials",
      "features",
    ];
    for (const name of collections) {
      await db
        .collection(name)
        .drop()
        .catch(() => {});
    }

    await db.collection("categories").insertMany([
      {
        name: "Smartphones",
        slug: "smartphones",
        image: "https://i.ibb.co.com/gLt20yfF/phn1.webp",
        productCount: 124,
      },
      {
        name: "Laptops",
        slug: "laptops",
        image: "https://i.ibb.co.com/w2c3kg3/lap1.jpg",
        productCount: 89,
      },
      {
        name: "Headphones",
        slug: "headphones",
        image: "https://i.ibb.co.com/7NL0xj81/1.jpg",
        productCount: 67,
      },
      {
        name: "Wearables",
        slug: "wearables",
        image: "https://i.ibb.co.com/Fqsx14kb/2.jpg",
        productCount: 45,
      },
      {
        name: "Tablets",
        slug: "tablets",
        image: "https://i.ibb.co.com/KjwyLdtV/3.webp",
        productCount: 53,
      },
      {
        name: "Cameras",
        slug: "cameras",
        image: "https://i.ibb.co.com/Qv9Tv0rP/4.jpg",
        productCount: 38,
      },
      {
        name: "Audio",
        slug: "audio",
        image: "https://i.ibb.co.com/8gvjnj89/5.jpg",
        productCount: 72,
      },
      {
        name: "Gaming",
        slug: "gaming",
        image: "https://i.ibb.co.com/pjfkMd5p/6.jpg",
        productCount: 91,
      },
    ]);

    await db.collection("products").insertMany([
      {
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        price: 1199,
        originalPrice: 1299,
        image: "https://i.ibb.co.com/Q3wNFj4M/ipn1.jpg",
        category: "smartphones",
        brand: "Apple",
        rating: 4.8,
        reviews: 2341,
        badge: "Best Seller",
        description:
          "The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.",
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        price: 1099,
        originalPrice: 1299,
        image: "https://i.ibb.co.com/v4vp0kkX/phn2.webp",
        category: "smartphones",
        brand: "Samsung",
        rating: 4.7,
        reviews: 1893,
        badge: "Sale",
        description:
          "Galaxy AI is here. Search like never before, instantly translate calls and texts, and so much more.",
      },
      {
        name: 'MacBook Pro 16" M3 Max',
        slug: "macbook-pro-16-m3-max",
        price: 2499,
        originalPrice: null,
        image: "https://i.ibb.co.com/5NSCNYG/phn3.jpg",
        category: "laptops",
        brand: "Apple",
        rating: 4.9,
        reviews: 987,
        badge: "New",
        description:
          "The most advanced Mac laptops ever with M3 Max chip for unprecedented performance.",
      },
      {
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        price: 349,
        originalPrice: 399,
        image: "https://i.ibb.co.com/TDCbckxj/phn4.jpg",
        category: "headphones",
        brand: "Sony",
        rating: 4.8,
        reviews: 3456,
        badge: "Top Rated",
        description:
          "Industry-leading noise cancellation with Auto NC Optimizer and crystal-clear hands-free calling.",
      },
      {
        name: "Apple Watch Series 9",
        slug: "apple-watch-series-9",
        price: 399,
        originalPrice: null,
        image: "https://i.ibb.co.com/qMQk3sB6/phn5.webp",
        category: "wearables",
        brand: "Apple",
        rating: 4.7,
        reviews: 2100,
        badge: null,
        description:
          "Smarter, brighter, mightier. S9 chip enables Double Tap and a brighter display.",
      },
      {
        name: 'iPad Pro 12.9" M2',
        slug: "ipad-pro-129-m2",
        price: 1099,
        originalPrice: 1199,
        image: "https://i.ibb.co.com/nN7KXyh2/phn6.webp",
        category: "tablets",
        brand: "Apple",
        rating: 4.8,
        reviews: 1567,
        badge: "Sale",
        description:
          "The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and all-day battery life.",
      },
      {
        name: "Sony Alpha A7 IV",
        slug: "sony-alpha-a7-iv",
        price: 2498,
        originalPrice: null,
        image: "https://i.ibb.co.com/2j9NBrFk/sony-a7iv.jpg",
        category: "cameras",
        brand: "Sony",
        rating: 4.9,
        reviews: 678,
        badge: "Pro Choice",
        description:
          "Full-frame mirrorless camera with 33MP sensor, advanced autofocus, and 4K 60p video.",
      },
      {
        name: "AirPods Pro 2",
        slug: "airpods-pro-2",
        price: 249,
        originalPrice: null,
        image: "https://i.ibb.co.com/0yRS05tK/pod1.jpg",
        category: "audio",
        brand: "Apple",
        rating: 4.8,
        reviews: 5678,
        badge: "Best Seller",
        description:
          "Adaptive Audio, Personalized Spatial Audio, and USB-C charging. Pure magic.",
      },
      {
        name: "PlayStation 5",
        slug: "playstation-5",
        price: 499,
        originalPrice: null,
        image: "https://i.ibb.co.com/CsbgqqGB/phn7.jpg",
        category: "gaming",
        brand: "Sony",
        rating: 4.8,
        reviews: 4523,
        badge: "Popular",
        description:
          "Experience lightning-fast loading with an ultra-high speed SSD and immersive 3D audio.",
      },
      {
        name: "Dell XPS 15",
        slug: "dell-xps-15",
        price: 1799,
        originalPrice: 1999,
        image: "https://i.ibb.co.com/kgLkq4bc/phn8.jpg",
        category: "laptops",
        brand: "Dell",
        rating: 4.6,
        reviews: 890,
        badge: "Sale",
        description:
          'Stunning 15.6" OLED display, Intel Core i9, 32GB RAM, and NVIDIA RTX graphics.',
      },
      {
        name: "Samsung Galaxy Watch 6",
        slug: "samsung-galaxy-watch-6",
        price: 299,
        originalPrice: 329,
        image: "https://i.ibb.co.com/whr4fQkP/phn9.jpg",
        category: "wearables",
        brand: "Samsung",
        rating: 4.5,
        reviews: 1230,
        badge: null,
        description:
          "Advanced health monitoring with sleep coaching, body composition analysis, and sapphire crystal glass.",
      },
      {
        name: "JBL Charge 5",
        slug: "jbl-charge-5",
        price: 179,
        originalPrice: null,
        image: "https://i.ibb.co.com/tMTHGHJn/phn10.jpg",
        category: "audio",
        brand: "JBL",
        rating: 4.7,
        reviews: 3210,
        badge: null,
        description:
          "Portable Bluetooth speaker with powerful sound, IP67 waterproof, and 20 hours of playtime.",
      },
    ]);

    await db.collection("brands").insertMany([
      {
        name: "Apple",
        slug: "apple",
        logo: "https://i.ibb.co.com/mFrFtRKM/11.jpg",
      },
      {
        name: "Samsung",
        slug: "samsung",
        logo: "https://i.ibb.co.com/6GKw80Y/12.jpg",
      },
      {
        name: "Sony",
        slug: "sony",
        logo: "https://i.ibb.co.com/cdmXtH1/14.jpg",
      },
      {
        name: "Google",
        slug: "google",
        logo: "https://i.ibb.co.com/TDY9H84T/google.avif",
      },
      {
        name: "Dell",
        slug: "dell",
        logo: "https://i.ibb.co.com/VWP4Gpv5/dell.jpg",
      },
      {
        name: "JBL",
        slug: "jbl",
        logo: "https://i.ibb.co.com/YTKM6rDR/jbl.jpg",
      },
      {
        name: "Logitech",
        slug: "logitech",
        logo: "https://i.ibb.co.com/Mk11pQXq/ogi.webp",
      },
      {
        name: "Microsoft",
        slug: "microsoft",
        logo: "https://i.ibb.co.com/Dfj87cYD/images-q-tbn-ANd9-Gc-Rik-GFJR-a0827-Pjl-HAYz5-Afmo-7-FYLw2-JY-2w07-Vf-IYA-s-10.png",
      },
    ]);

    await db.collection("testimonials").insertMany([
      {
        name: "Sarah Johnson",
        role: "Tech Enthusiast",
        rating: 5,
        text: "TechNest has completely changed how I shop for electronics. The product quality is unmatched, and the delivery is always lightning fast.",
      },
      {
        name: "Michael Chen",
        role: "Professional Photographer",
        rating: 5,
        text: "As a photographer, I rely on TechNest for all my camera gear. Their prices are competitive and the customer support is exceptional.",
      },
      {
        name: "Emily Rodriguez",
        role: "Software Developer",
        rating: 5,
        text: "I bought my MacBook Pro from TechNest and the experience was seamless. Great prices, fast shipping, and excellent after-sales support.",
      },
    ]);

    await db.collection("features").insertMany([
      {
        icon: "truck",
        title: "Free Shipping",
        description:
          "Free shipping on orders over $50. Fast and reliable delivery to your doorstep.",
      },
      {
        icon: "shield",
        title: "2-Year Warranty",
        description:
          "Every product comes with a comprehensive 2-year warranty for your peace of mind.",
      },
      {
        icon: "headset",
        title: "24/7 Support",
        description:
          "Round-the-clock customer support to help you with any questions or concerns.",
      },
      {
        icon: "refresh",
        title: "Easy Returns",
        description:
          "Not satisfied? Return any product within 30 days for a full refund, no questions asked.",
      },
    ]);

    res.json({ message: "Database seeded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at ${PORT}`);
  });
});
