import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("dashboard.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    customer_email TEXT,
    amount REAL,
    currency TEXT,
    payment_method TEXT,
    device_type TEXT,
    browser TEXT,
    country TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    original_name TEXT,
    size INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default settings
const seedSettings = [
  { key: 'original_price', value: '197' },
  { key: 'sale_price', value: '5' },
  { key: 'is_discount_active', value: 'true' },
  { key: 'language', value: 'en' },
  { key: 'stripe_publishable_key', value: '' },
  { key: 'stripe_secret_key', value: '' },
  { key: 'paypal_client_id', value: '' },
  { key: 'paypal_secret', value: '' },
  { key: 'paysera_project_id', value: '' },
  { key: 'paysera_password', value: '' },
  { key: 'payment_mode', value: 'sandbox' }
];

seedSettings.forEach(s => {
  const exists = db.prepare("SELECT * FROM settings WHERE key = ?").get(s.key);
  if (!exists) {
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run(s.key, s.value);
  } else if (s.key === 'sale_price' && exists.value === '47') {
    // Force update from old default to new requested default
    db.prepare("UPDATE settings SET value = ? WHERE key = ?").run(s.value, s.key);
  }
});

// Seed admin if not exists
const adminExists = db.prepare("SELECT * FROM admins WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin", "admin123");
}

// Seed some mock data if empty
const salesCount = db.prepare("SELECT COUNT(*) as count FROM sales").get() as { count: number };
if (salesCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO sales (customer_name, customer_email, amount, currency, payment_method, device_type, browser, country, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const countries = ["USA", "UK", "Canada", "Germany", "France", "Australia"];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  const devices = ["Mobile", "Desktop"];
  const methods = ["Stripe", "PayPal"];

  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    insert.run(
      `Customer ${i}`,
      `customer${i}@example.com`,
      47.00,
      "USD",
      methods[Math.floor(Math.random() * methods.length)],
      devices[Math.floor(Math.random() * devices.length)],
      browsers[Math.floor(Math.random() * browsers.length)],
      countries[Math.floor(Math.random() * countries.length)],
      date.toISOString()
    );
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM admins WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, token: "mock-jwt-token" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.get("/api/analytics", (req, res) => {
    const totalSales = db.prepare("SELECT SUM(amount) as total FROM sales").get() as { total: number };
    const customerCount = db.prepare("SELECT COUNT(DISTINCT customer_email) as count FROM sales").get() as { count: number };
    const salesByDay = db.prepare(`
      SELECT date(created_at) as date, SUM(amount) as amount 
      FROM sales 
      GROUP BY date 
      ORDER BY date ASC
    `).all();
    
    const deviceSplit = db.prepare("SELECT device_type as name, COUNT(*) as value FROM sales GROUP BY device_type").all();
    const paymentSplit = db.prepare("SELECT payment_method as name, COUNT(*) as value FROM sales GROUP BY payment_method").all();
    const topCountries = db.prepare("SELECT country as name, COUNT(*) as value FROM sales GROUP BY country ORDER BY value DESC LIMIT 5").all();

    res.json({
      metrics: {
        totalRevenue: totalSales.total || 0,
        totalCustomers: customerCount.count || 0,
        aov: totalSales.total / (db.prepare("SELECT COUNT(*) as count FROM sales").get() as any).count || 0,
        mrr: (totalSales.total / 30) * 30 // Mock MRR calculation
      },
      charts: {
        salesByDay,
        deviceSplit,
        paymentSplit,
        topCountries
      }
    });
  });

  app.get("/api/customers", (req, res) => {
    const customers = db.prepare("SELECT * FROM sales ORDER BY created_at DESC").all();
    res.json(customers);
  });

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const updates = req.body;
    const updateStmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        updateStmt.run(key, String(value));
      }
    });
    transaction(updates);
    res.json({ success: true });
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products ORDER BY uploaded_at DESC").all();
    res.json(products);
  });

  // Payment Endpoints
  app.post("/api/checkout/stripe", async (req, res) => {
    try {
      const { email, name } = req.body;
      const stripeSecret = db.prepare("SELECT value FROM settings WHERE key = 'stripe_secret_key'").get() as any;
      const salePrice = db.prepare("SELECT value FROM settings WHERE key = 'sale_price'").get() as any;
      
      if (!stripeSecret?.value) {
        return res.status(400).json({ error: "Stripe is not configured" });
      }

      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeSecret.value);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Little Genius Spark Bundle",
              },
              unit_amount: Math.round(parseFloat(salePrice.value) * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: email,
        success_url: `${req.headers.origin}/download?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/checkout/success", (req, res) => {
    const { name, email, amount, method, country } = req.body;
    db.prepare(`
      INSERT INTO sales (customer_name, customer_email, amount, currency, payment_method, country)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, email, amount, "USD", method, country || "Unknown");
    res.json({ success: true });
  });

  // Simple mock file upload
  app.post("/api/products/upload", (req, res) => {
    const { filename, size } = req.body;
    db.prepare("INSERT INTO products (filename, original_name, size) VALUES (?, ?, ?)")
      .run(filename, filename, size);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
