# Future India Exim - Documentation & System Architecture

A complete, production-level guide for developers, founders, and stakeholders.

---

## 1. 10-MINUTE UNDERSTANDING (The Mental Model)

### What is this?

**Future India Exim** is a high-performance Digital Marketplace and Export-Import (Exim) platform. It bridges the gap between Indian manufacturers (Spices, Seeds, Grains) and global importers.

### Who is it for?

1. **Importers (International Buyers):** Need high-quality, verified Indian products with transparent origin and certifications.
2. **Exporters (Manufacturers/Suppliers):** Need a professional digital storefront and order management system to reach global markets.
3. **Administrators (Operations):** Need to manage leads (enquiries), verify payments, and oversee order fulfillment.

### The Problem It Solves

Traditional B2B trade is fragmented. This project digitizes:

- **Product Discovery:** Verified technical specs (moisture, curcumin, grade).
- **Communication:** Integrated enquiry system for direct lead generation.
- **Trust:** Built-in payment proof upload and manual verification system.
- **Logistics:** Real-time order status tracking from "Pending" to "Delivered".

### The User Journey (End-to-End Flow)

1. **Browse:** User discovers premium products (e.g., Organic Turmeric) with detailed specs.
2. **Enquire/Buy:** User submits an enquiry for pricing OR adds items to the cart for a structured order.
3. **Order Placement:** User provides shipping details and places a "Pending" order.
4. **Payment:** User completes a bank transfer/LC and **uploads a screenshot of the payment proof**.
5. **Verification:** Admin verifies the proof and updates the status to "Approved".
6. **Fulfillment:** Admin updates the order lifecycle (Packing -> Shipped -> Delivered).

### Key Differentiators

- **B2B Focus:** Not just a store; it handles Bulk Quantities (MOQ), Grade Analysis, and Origin tracking.
- **Manual Verification:** Tailored for high-ticket cross-border trades where automated gateways are often secondary to bank transfers.
- **Rich Interaction:** Framer Motion-powered premium UI for a high-end brand feel.

---

## 2. PROJECT OVERVIEW

- **Project Name:** Future India Exim
- **Purpose:** A B2B Export Management System (EMS) for digital trade.
- **Target Users:** Global B2B Buyers, Domestic Suppliers, Admin Operations.
- **Core Features:**
    - Integrated CRM (Inquiries/Enquiries).
    - Multi-stage Order Management System (OMS).
    - Product Information Management (PIM) for detailed export specs.
    - Payment Verification Portal.
    - Admin Analytics & Reporting Dashboard.
- **Business Logic Summary:** Lead-to-Order conversion with manual financial clearance. All data is persisted centrally to ensure transparency in international shipping.

---

## 3. SYSTEM ARCHITECTURE

The application follows a **Decoupled Monolithic Architecture** with a clear separation of concerns (SOC) between the client and server.

### High-Level Architecture

```ascii
[ Client (Browser) ] <--- HTTP (REST) ---> [ Server (Express.js) ] <---> [ Database (SQLite) ]
        |                                       |                           |
  (React + Tailwind)                      (Business Logic)           (Physical Storage)
        |                                       |
  (State Management)                      (Multer Uploads) <--- (Local Disk Files)
```

### Request Flow

1. **UI Event:** User clicks "Enquire".
2. **Client Processing:** React validates data + shows optimistic UI updates.
3. **API Call:** `POST /api/inquiries` sent via `fetch` to Express.
4. **Server Logic:** Express validates input -> Executes SQL via `better-sqlite3` -> Saves to `database.sqlite`.
5. **Persistence:** Data stored in relational tables.
6. **Response:** Success JSON sent to client; UI updates dashboard.

---

## 4. TECH STACK

| Layer | Technology | Why This Choice? |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Blazing fast HMR and modern component lifecycle. |
| **Styling** | Tailwind CSS 4 | Utility-first approach for rapid, pixel-perfect UI. |
| **Animation** | Framer Motion | Smooth, premium micro-interactions (hover, transitions). |
| **Icons** | Lucide React | Lightweight, consistent vector icons. |
| **Charts** | Recharts | Composable charts for the Admin analytics dashboard. |
| **Backend** | Node.js + Express.js | Low-latency I/O and standard for RESTful services. |
| **Database** | SQLite (better-sqlite3) | Lightweight, zero-config, single-file storage; perfect for initial scaling. |
| **Uploads** | Multer | Standard middleware for handling multipart/form-data (payment proofs). |
| **Router** | React Router 7 | Robust SPA navigation with layout support. |

---

## 5. FOLDER STRUCTURE

```text
Future India Exim/
├── client/                 # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/     # Reusable UI Atoms & Molecules
│   │   │   ├── admin/      # Specialized Admin components
│   │   │   ├── layout/     # Nav, Footer, Hero sections
│   │   │   └── ui/         # Buttons, Inputs, Modals
│   │   ├── context/        # Global State (Cart, Auth)
│   │   ├── pages/          # Main routes (Home, Products, Login)
│   │   │   └── admin/      # Management Views (Dashboard, Reports)
│   │   ├── types/          # TS Interfaces for safe data flow
│   │   ├── App.tsx         # Main Routing Hub
│   │   └── main.tsx        # Entry Mount
├── server/                 # Backend (Express.js)
│   ├── uploads/            # Storage for screenshots/images
│   ├── db.js               # DB Connectivity & Schema Config
│   ├── index.js            # API Endpoint Definitions
│   └── seed.js             # Initial data population
└── vercel.json             # Deployment orchestration
```

### Key Folder Roles

- **`/client/src/context`**: Heart of the frontend logic. Manages shopping cart and user session persistence.
- **`/server/uploads`**: Critical for high-trust operations; stores legal payment documentation.
- **`/client/src/pages/admin`**: Restricted zone for site operators.

---

## 6. FILE-BY-FILE EXPLANATION

### Server Core

- **`server/index.js`**: **The Backend Entry Point.**
  - Initializes Express.
  - Registers all API routes (`/api/auth`, `/api/products`, `/api/orders`).
  - Configure `multer` for secure file uploads.
- **`server/db.js`**: **The Database Layer.**
  - Handles the connection to `database.sqlite`.
  - Defines the `CREATE TABLE` statements for the entire system.
  - Contains "Migrations" logic to sync schema changes without data loss.

### Client Core

- **`client/src/App.tsx`**: **The Application Backbone.**
  - Wraps the app in `BrowserRouter`.
  - Defines public routes (Home, Products) vs protected admin routes.
- **`client/src/context/CartContext.tsx`**: **Shopping Logic.**
  - Controls quantity updates, total calculation, and local storage persistence.
- **`client/src/pages/admin/Dashboard.tsx`**: **Management Center.**
  - Aggregates database counts (Enquiries, Revenue, Growth) into a visual summary.

---

## 7. DATABASE DESIGN (Human Terms)

| Table | Purpose | Important Fields |
| :--- | :--- | :--- |
| **`users`** | Identity Management | `name`, `email`, `role` (user/admin), `company_name`. |
| **`products`** | Inventory Catalog | `moq` (Minimum Order Quantity), `grade`, `origin`, `price`. |
| **`orders`** | Transaction Records | `order_code`, `status`, `total_amount`, `payment_status`. |
| **`order_items`** | Line Items | Links specific products to an order with snapshot prices. |
| **`payments`** | Audit Trail | `screenshot_url`, `transaction_id`, `status` (Pending/Approved). |
| **`inquiries`** | Lead Pipeline | `customer_name`, `country`, `product_interest`, `message`. |

**Relationships:**

- **One-to-Many:** One `User` can have many `Orders`.
- **One-to-Many:** One `Order` has many `OrderItems`.
- **One-to-One:** One `Order` has one `Payment` proof.

---

## 8. API FLOW (Backend Mechanics)

### Example: Order Placement Request Flow

1. **Request:** Client sends `POST /api/orders` with items and shipping details.
2. **Transaction:** Backend starts a SQL Transaction (`db.transaction`).
3. **Step A:** Create `orders` record -> returns `orderId`.
4. **Step B:** Loop through items -> create entries in `order_items`.
5. **Step C:** Clear user's `cart_items` in the DB.
6. **Response:** Return `orderCode` for user confirmation.

### API Groups

- **Auth:** `/api/auth/signup`, `/api/auth/login`.
- **Store:** `/api/products`, `/api/cart`.
- **Operations:** `/api/orders`, `/api/payments/proof`.
- **Admin:** `/api/admin/dashboard`, `/api/admin/reports`, `/api/admin/enquiries`.

---

## 9. USER JOURNEY (Step-by-Step)

1. **Discovery:** User lands on Home, uses smooth scroll to explore the "Spices" category.
2. **Selection:** Clicks "Details" on Black Pepper. Reviews grade (Bold 4.5mm) and origin (Kerala).
3. **Authentication:** Registers if not logged in to save cart items.
4. **Conversion:** Adds 500kg (MOQ) to cart and proceeds to Checkout.
5. **Address:** Signs in and provides global shipping coordinates.
6. **Action Plan:** Receives bank details on the Payment page. Performs external transfer.
7. **Proof:** Returns to site, select "Upload Proof", and submits a photo of the receipt.
8. **Wait:** Monitors status in **"My Account"** dashboard.

---

## 10. ADMIN / CONTROL FLOW

- **Access Level:** Only users with `role = 'admin'` can access `/admin/*` routes.
- **Lead Management:** Admin views `/admin/enquiries`, reviews custom requests, and marks them as "Responded".
- **Financial Audit:** Admin checks `/admin/orders`, clicks an order to see the uploaded receipt screenshot.
- **Logistics Control:** Once payment is verified, Admin updates status: `In Production` -> `Packing` -> `Dispatched`.
- **Analytics:** Admin views `/admin/reports` to see revenue trends and high-demand products.

---

## 11. AUTHENTICATION FLOW

### Register/Login

- **Method:** Simple Password-based auth (upgradeable to JWT/Bcrypt).
- **Session:** User state is held in React Context and synchronized with DB.
- **Roles:**
  - `user`: Standard customer access.
  - `admin`: Full system access, including financial records and user blocking.

---

## 12. ORDER & BUSINESS LOGIC

### Status Lifecycle

`Pending` -> `Payment Proof Uploaded` -> `Paid (Approved)` -> `Shipped` -> `Completed`

### Critical Edge Cases

- **MOQ Enforcement:** UI prevents adding items below the Minimum Order Quantity.
- **Multiple Statuses:** Payment status is tracked separate from Shipping status (e.g., an order can be "Paid" but "Pending Dispatch").
- **Proof Re-upload:** Users can re-upload payment proof if the previously uploaded screenshot was rejected by the admin.

---

## 13. HOW TO RUN THE PROJECT

### Local Development

1. **Clone Repository:** Download the source.
2. **Install Dependencies:**
    ```bash
    npm run install:all
    ```
3. **Setup Environment:** Create `.env` in `/server` folder (see Section 14).
4. **Run System:**
    ```bash
    npm run dev
    ```
    - Server: `http://localhost:5001`
    - Client: `http://localhost:5173`

### Production Deployment (Vercel)

The project is pre-configured for Vercel with a Root `vercel.json`.

- **Frontend Build:** `npm run build` inside `client/`.
- **Backend Deployment:** Deployed as a serverless function via the root configuration.

---

## 14. ENVIRONMENT VARIABLES

**Server (`/server/.env`):**

- `PORT`: (Default: `5001`) Port for the API server.
- `JWT_SECRET`: (Optional) For secure token generation.

**Client (`/client/.env`):**

- `VITE_API_URL`: (Default: `http://localhost:5001`) Base URL for the backend.

---

## 15. DEPLOYMENT GUIDE

- **Hosting:** Vercel (Front + Back) or DigitalOcean/AWS (VPS).
- **Database Persistence:** On Vercel, the SQLite file will reset on every build. For persistent storage in production, migrate the `db.js` connection string to a hosted SQL service (PostgreSQL/MySQL).
- **Common Mistakes:**
  - Forgetting to create the `/server/uploads` folder on traditional VPS (Server script auto-creates it, but permissions might vary).
  - Mismatched `VITE_API_URL` during client build.

---

## 16. TROUBLESHOOTING

| Issue | Potential Cause | Fix |
| :--- | :--- | :--- |
| **"Failed to Fetch"** | Backend server is not running. | Run `npm run dev:server`. |
| **Image not showing** | Static route not registered. | Ensure `app.use('/uploads', express.static(...))` is in `index.js`. |
| **Admin Login Denied** | Role not set to 'admin' in DB. | Manually update user table: `UPDATE users SET role='admin' WHERE email='...'`. |
| **Vite Build Errors** | TypeScript type mismatches. | Run `npm run build` in `client` to identify specific syntax flaws. |

---

## 17. DESIGN SYSTEM & AESTHETICS

The project uses a **Tailwind CSS 4.0** theme structure for high-end B2B styling.

### Primary Color Palette (HSL based)

- **Primary:** `hsl(162, 100%, 10%)` — Deep Forest Green (Luxury/Export feel).
- **Accent:** `hsl(42, 63%, 48%)` — Rich Amber (Quality/Golden spice feel).
- **Foreground:** `hsl(160, 20%, 10%)` — Soft Black for high-end typography.

### Layout Utilities

- **`glass-card`**: A `backdrop-blur-lg` based container for a modern "Apple-style" dashboard.
- **`admin-card`**: Large border-radius (`2rem`) for a soft, premium backend feel.
- **Typography:** Serif headings (`Times New Roman`) paired with Sans-serif body (`Inter`) for a "Financial Journal" aesthetic.

---

## 18. ADVANCED DESIGN INSIGHTS

### Rationale: Why this Architecture?

- **Unified Logic:** By keeping the API and Database simple (SQLite) in the MVP phase, we reduce "DevOps overhead" and focus on product-market fit.
- **The "B2B Lead" Hook:** The system prioritizes "Enquiries" over direct "Sales" because high-volume export deals always involve negotiation.
- **Zero-Latency Database:** SQLite provides near-instant local reads/writes, which is ideal for CMS-heavy applications.

### Tradeoffs & Limitations

- **Horizontal Scaling:** Currently, the server is stateful due to local SQLite and Multer storage.
- **Syncing:** Multiple instances of the server would create separate DB files unless migrated to a centralized SQL server.
- **In-Memory State:** Authentication and sessions are managed purely via React context and DB lookups; high traffic might require Redis.

### Scaling Strategy

1. **Stage 1 (Current):** Single VPS, SQLite, Local uploads.
2. **Stage 2 (Growth):** PostgreSQL, AWS S3 for payments, JWT for session persistence.
3. **Stage 3 (Scale):** Microservices for Logistics Tracking and Inventory Sync.

---

### FINAL GOAL ACHIEVED:

Someone reading this should:

- Understand the system in **10 minutes**.
- Start working in **30 minutes**.
- Debug in **1 hour**.
