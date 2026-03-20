# Future India Exim - Full System Blueprint

A complete, production-level deep dive into the architecture, logic, and data flow of the project.

---

## 1. 10-MINUTE SYSTEM UNDERSTANDING

### Project Essence
**Future India Exim** is a high-end Digital Trade Platform designed for B2B export operations. It serves as a digital gateway connecting Indian manufacturers with international buyers, specifically focusing on commodities like Spices, Seeds, and Grains.

### Who it is for?
- **Global Importers:** Seeking high-grade Indian products with transparent certifications.
- **Indian Exporters:** Needing a premium storefront to manage bulk orders and leads.
- **Operations Managers:** Needing an "Intelligence Hub" (Admin) to monitor trade streams and revenue.

### Problem it Solves
International B2B trade is historically offline and lacks transparency. This system solves:
- **Lead Attrition:** Captures interest via an integrated Enquiry system.
- **Order Chaos:** Organizes multi-stage B2B orders with clear status updates.
- **Trust Gap:** Provides a structured way to upload and verify cross-border payment proofs.

### End-to-End User Journey
1. **Discovery:** User explores the high-end product catalog (premium UI).
2. **Interaction:** User either places a Product Enquiry (Lead) or adds items to a Shopping Cart.
3. **Checkout:** User signs in and provides shipping logistics data.
4. **Action:** An order is created as "Pending". User performs a bank transfer and uploads a screenshot of the receipt.
5. **Fulfillment:** Admin verifies the proof -> Approves Payment -> Dispatches Cargo -> Updates status to "Delivered".

---

## 2. FULL SYSTEM ARCHITECTURE

The system is built as a **Decoupled Monolith**, where the Frontend and Backend communicate over a pure REST API.

### The Request Cycle
```ascii
[ User (Action) ] 
      ↓
[ Frontend (React SPA) ] --(JSON Request)--> [ Backend (Express API) ]
      ↓                                             ↓
[ State Updates ] <---(JSON Response)--- [ DB Queries (SQLite) ]
```

- **Frontend:** Handles presentation, optimistic UI updates, and client-side routing.
- **Backend:** Handles authentication, schema validation, file uploads (Multer), and SQL orchestration.
- **Database:** A relational SQLite engine for atomicity (ensuring orders and items stay in sync).

---

## 3. FRONTEND DEEP EXPLANATION

### Technical Structure
- **Framework:** React 19 + TypeScript (for type-safe data flow).
- **Styling:** Tailwind CSS 4.0 using the "Glassmorphism" design system.
- **State Management:** **React Context API**. Separate providers for `Auth`, `Cart`, `Language`, and `Modals`.
- **API Client:** Standard `fetch` API wrapped in a centralized `getApiUrl` helper.

### Key Pages & Files
- **`App.tsx`**: The Master Router. Defines public routes vs. `ProtectedAdmin` layouts.
- **`CartProvider.tsx`**: State Engine. Logic for syncing local guest carts with database-backed user carts.
- **`Home.tsx`**: High-conversion landing page with Framer Motion animations.
- **`Products.tsx`**: Grid view with sophisticated filtering by category and origin.
- **`admin/Dashboard.tsx`**: The "Intelligence Hub". Aggregates data from `/api/admin/dashboard`.

### Important System Logic
- **File: `components/ui/EnquiryModal.tsx`**: Captures user leads. It calls `POST /api/inquiries`.
- **File: `pages/Payment.tsx`**: The focal point of the business model. Handles file selection and `POST /api/payments/proof` (multipart/form-data).

---

## 4. BACKEND DEEP EXPLANATION

The backend follows a **Unified Entry Blueprint**, keeping all routes and logic within a centralized hub for maximum execution speed and zero-latency internal communication.

### Logical Layers (Inside `index.js`)
1. **Middleware Layer:** Configures CORS, JSON parsing, and Static file serving for `/uploads`.
2. **Persistence Layer (`db.js`):** Initializes the SQLite connection and handles manual "Migrations" to ensure table health.
3. **Core API Routes:**
   - **Auth Controller:** Simple password-based hashing and role assignment.
   - **Product Controller:** Serving the product catalog and certifications.
   - **Transaction Engine:** Handles the complex logic of placing an order (Post Order -> Insert Items -> Clear Cart).
   - **Management Layer:** Secured routes for Admin-only stats and revenue reporting.

### Key Backend Files
- **`index.js`**: Defines the entire API surface. It answers "Why does this endpoint exist?" for every operation.
- **`db.js`**: Relational mapping. Contains the master schema and initial "Seed" data for the warehouse.
- **`server/package.json`**: Lists dependencies like `better-sqlite3` and `multer`.

---

## 5. DATABASE DEEP EXPLANATION (Story of Data)

### `users` (Identity Hub)
- **Story:** Every person in the system starts here.
- **Fields:** `email` (unique), `password`, `role` (defines if they see the store or the hub), `company_name` (B2B context).

### `products` (The Warehouse)
- **Story:** Stores the digital specs of trade cargo.
- **Fields:** `moq` (Minimum order to prevent small-retail noise), `grade` (A1/Premium), `origin` (Kerala/Gujarat).

### `orders` & `order_items` (Business Continuity)
- **Story:** When a user commits, an `order` is born. `order_items` captures exactly what they bought and at what price (snapshot) at that moment.
- **Fields:** `order_code` (EXIM-XXXX), `status` (The lifecycle tracker), `total_amount`.

### `payments` (Financial Trust)
- **Story:** Bridging the gap between the user's bank and the admin's ledger.
- **Fields:** `screenshot_url` (Proof), `status` (Pending Verification -> Approved).

### `inquiries` (Lead Pipeline)
- **Story:** For users not yet ready to buy, but wanting prices.
- **Fields:** `food_item` (Subject of interest), `message`, `country` (Market research data).

---

## 6. DATA FLOW (END-TO-END)

### The Cart Logic Flow
1. **Action:** User clicks "Add to Cart".
2. **Frontend:** React Context updates `items` array locally (Optimistic).
3. **API:** If logged in, sends `POST /api/cart/add`.
4. **Backend:** Checks if item exists in DB -> Increments quantity OR Inserts new row.
5. **Sync:** Frontend re-fetches or updates to match DB state.

### The Checkout & Payment Flow
1. **Order:** User submits `POST /api/orders`. Backend creates the record and items in one transaction.
2. **Payment Page:** User sees bank details and the "Upload Proof" button.
3. **Upload:** `POST /api/payments/proof` sends the image buffer to the server.
4. **Storage:** Server saves file to `/uploads` and records the path in the `payments` table.
5. **Status:** Order flips to `Pending Verification`.

---

## 7. AUTHENTICATION & ACCESS

- **Registration:** Creates a new `user` row with `role = 'user'`.
- **Login:** Compares identifier/password. Returns a `user` object.
- **Role-Based Access (RBAC):**
  - **Frontend:** `ProtectedAdmin` component checks `user.role === 'admin'`. If not, redirects to login.
  - **Backend:** Admin endpoints (/api/admin/*) are logically separated and checked against the role in the database action.

---

## 8. BUSINESS LOGIC LIFECYCLE

### Order Status Flow
1. **`Pending`**: Order created, awaiting payment.
2. **`Pending Verification`**: Payment proof uploaded, awaiting Admin review.
3. **`Approved`**: Payment verified. Order ready for processing.
4. **`Packing / Shipped / Delivered`**: Operational updates by Admin.

---

## 9. FOLDER STRUCTURE (WITH MEANING)

```text
Future India Exim/
├── client/                     # (React Application) - The Public & Admin UI
│   ├── src/
│   │   ├── config/             # Environment & Dynamic API URL logic
│   │   ├── context/            # Business State (Why: Decouple logic from UI)
│   │   ├── pages/admin/        # Management restricted views
│   │   └── types/              # TS Definitions (Why: Prevent runtime crashes)
├── server/                     # (Express Application) - The Engine
│   ├── uploads/                # Legal documents (Payment receipts)
│   ├── index.js                # API Hub (Why: Centralized logic handling)
│   └── db.js                   # Persistence Schema (Why: Core data integrity)
└── vercel.json                 # Deployment Rules (Why: Orchestrate Front vs Back)
```

---

## 10. HOW TO RUN

### Local Dev
1. **Root:** `npm install`
2. **Install All:** `npm run install:all`
3. **Run Both:** `npm run dev`
   - Access Store: `localhost:5173`
   - Access Admin: `localhost:5173/admin/login`

### Production
1. **Build:** `npm run build` in `client/`.
2. **Env:** Set `VITE_API_URL` to production backend domain.
3. **Serve:** Run `npm start` in `server/`.

---

## 11. ENV VARIABLES

- **`VITE_API_URL`**: Essential for the frontend to find the backend (e.g., `https://api.futureexim.com`).
- **`PORT`**: Backend listening port (Default: 5001).
- **`DATABASE_URL`**: (Optional) For migrating to cloud SQL.

---

## 12. TROUBLESHOOTING

- **Empty Dashboard:** Ensure `server/index.js` is running. Check browser console for "CORS" errors.
- **Upload Failures:** Ensure `server/uploads` folder has write permissions on the host system.
- **Cart Resetting:** If not logged in, cart uses `localStorage`. Clearing browser cache will reset it.

---

## 13. DESIGN DECISIONS & TRADE-OFFS

### Why SQLite (Better-SQLite3)?
**Decision:** Single-file relational storage.
**Trade-off:** Not ideal for horizontally scaling across 10 servers, but provides **insane speed** and **zero latency** for our current single-node VPS deployment.

### Unified Backend logic
**Decision:** Keeping logic in `index.js` instead of splitting into 50 files.
**Rationale:** For an MVP, this reduces "jump-to-definition" fatigue and keeps the logic flow visible to a single developer.

### "Glassmorphism" Design
**Decision:** High-end translucent UI.
**Rationale:** B2B Exim is high-ticket. The UI must look like "Banking Grade" technology to build immediate trust with international buyers.

---

### FINAL GOAL:
This blueprint allows a new developer to start contributing to the specific layer (CSS, API, or DB) without needing a walkthrough from the previous developer.
