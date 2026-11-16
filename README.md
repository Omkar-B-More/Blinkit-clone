# Blinkit 10-Minute Quick-Commerce Web Application ⚡

A high-performance replica of **Blinkit** (India's leading 10-minute grocery and instant e-commerce platform), built with Next.js App Router, Tailwind CSS, Clerk Phone Authentication, and a real-time Redis database backend.

---

## 🚀 Key Features

### 1. Clerk Phone Number Authentication
- Indian mobile number login (`+91 98765 43210`).
- 6-digit OTP verification with instant 1-click Demo Fill (`OTP: 482910`).
- Profile management synced directly with Redis (`phone`, `orderCount`, `totalSpent`, `addresses`).

### 2. Diverse Groceries & Product Catalog
- **Categories**:
  - 🥛 **Milk & Dairy**: Amul Taaza, Mother Dairy Toned, Nandini GoodLife Cow Milk (*Out of Stock demonstration*), Amul Butter, Country Delight Paneer, Epigamia Greek Yogurt.
  - 🍿 **Snacks & Munchies**: Lay's India's Magic Masala, Kurkure Masala Munch, Haldiram's Aloo Bhujia, Doritos, Act II Golden Popcorn.
  - 🌾 **Atta, Rice & Dal (Staples)**: Aashirvaad 5kg Shudh Chakki Atta, Fortune Sunflower Oil, Tata Salt, Daawat Rozana Basmati, Tata Sampann Toor Dal.
  - 🥦 **Fresh Farm Produce**: Tomatoes, Nashik Onions, Mountain Potatoes, Fresh Coriander, Robusta Bananas.
  - 💊 **Emergency & Pharma**: Dettol Antiseptic, Crocin Advance 650mg, Band-Aids, Volini Spray, Digene Liquid.
  - ⚡ **Electronics & Daily Tech**: Apple 20W USB-C Adapter, boAt Bassheads Earphones, Portronics 65W Fast Cable, Duracell Batteries, Anker Slim Power Bank (*Out of Stock demonstration*).
  - 🖨️ **Blinkit Print Store (10m)**: Urgent PDF/Doc printouts, B&W (₹3/pg), HD Color (₹10/pg), and Spiral Binding delivered in confidential tamper-evident envelopes.
  - 🪙 **Gold & Festive Vault**: MMTC-PAMP 24K 999.9 pure gold coins and silver coins delivered in 10 minutes with OTP verification.

### 3. Dedicated "Explore Details" for Every Product
- Each product features an explicit **"Explore Details"** button.
- Comprehensive modal displaying:
  - Exact weight and volume (`500 ml`, `1 kg`, `200 g`, `100 g`, `5 kg`).
  - Pricing breakdown (Rate in ₹, struck-through MRP, savings amount, and discount %).
  - Real-time dark store stock status (`Sector 29 Dark Store Hub`).
  - Shelf life, ingredients, nutritional highlights, and 100% Veg indicators.
  - **Out-of-Stock handling**: Disabled action with "Notify When In Stock" alert.

### 4. Real-Time 10-Minute Order Tracking & Rider ETA
- Live countdown timer (`09:45`, `08:12` ... `00:00`).
- Live order lifecycle simulation:
  1. **Order Placed**: Sent to Dark Store via Redis.
  2. **Packing**: Micro-warehouse picker bagging items with tamper-proof security tape.
  3. **Rider Assigned**: Rider details (Name, photo, rating ★4.9, Hero Electric vehicle registration).
  4. **Out for Delivery**: Interactive animated route simulation showing scooter traveling from dark store to customer doorstep.
  5. **Doorstep Handover OTP**: 4-digit code (e.g. `8492`) required for physical handover.

### 5. Redis Database Architecture
Data is stored using standard Redis primitives:
- `user:{userId}` (Hash): User ID, phone, name, email, order count, total spent, saved addresses.
- `phone:{phone}` (String): Reverse index mapping phone numbers to user IDs.
- `order:{orderId}` (String/JSON): Full order summary, items, bill breakdown, delivery address, OTP, rider profile.
- `user:{userId}:orders` (List): LPUSH list of user's past and active orders.
- `store:orders:queue` (List): Shared global order queue connecting customer orders to the upcoming **Store Ops Dashboard**.

---

## ⚡ What Blinkit is Currently Pioneering (2024–2026)

1. **Blinkit Print Store (10-Minute Document Delivery)**:
   - Built directly into this app under the **Print Store** button!
   - Upload PDF/resumes/contracts, select B&W or Color, add spiral binding, delivered in 10 minutes in a sealed confidential envelope.
2. **Doorstep Returns & Instant Size Exchanges**:
   - Rather than 3–5 day e-commerce returns, Blinkit riders bring replacement shoe/apparel sizes directly to the door.
3. **High-Value Quick Commerce**:
   - 10-minute delivery of iPhones, PlayStation consoles, and certified 24K gold coins for Indian festivals (Dhanteras, Akshaya Tritiya, Diwali).
4. **Monsoon / Weather Surge & Load Balancing**:
   - Dynamic protection surcharge (₹15) and sealed waterproof packaging during rains.
5. **Recipe-to-Cart Quick Bundles**:
   - 1-click add for combos like *Desi Chai & Snacks Kit* or *Midnight Cravings Kit*.

---

## 🛠️ Running the Application

The application is already running in background mode at **`http://localhost:3000`**.

To run manually or in dev mode:
```bash
cd "C:\Users\acer\.gemini\antigravity\scratch\blinkit-app"

# Install dependencies (already installed)
npm install

# Start development server
npm run dev

# Or build & start production server
npm run build
npm start
```

### Redis Connection:
- The app automatically connects to `REDIS_URL` or `localhost:6379`.
- If no Redis server is booted, the app runs on a built-in embedded Redis engine with file persistence (`.redis_mock_db.json`) ensuring 100% zero-configuration uptime!
- To run a local Redis container:
  ```bash
  docker run -d -p 6379:6379 --name blinkit-redis redis:alpine
  ```
