# Prime Modulars Admin Panel — Architecture & Implementation Plan

## 1. Project Overview

The existing codebase is a **TanStack Start** (React + Vite + SSR) application deployed on Vercel. The admin panel is decoupled from the frontend UI and extends it with MongoDB-backed data persistence, Cloudinary image hosting, JWT-based auth, local image uploads, data caching, and security hardening — all served under the `/modular/admin` route.

---

## 2. Directory Structure

```
src/
├── lib/
│   ├── constants.ts            # Shared constants (TOKEN_KEY)
│   ├── cache.ts                # localStorage cache with TTL + stale fallback
│   ├── security.ts             # Rate limiting, sanitization, CSP headers
│   ├── db.ts                   # MongoDB connection (singleton via getDb())
│   ├── cloudinary.ts           # Cloudinary upload/delete helpers (server-only)
│   ├── admin-auth.ts           # JWT sign/verify + credential validation (server-only)
│   └── server/
│       ├── auth.ts             # ServerFn: login (rate-limited), checkAuth
│       ├── services.ts         # ServerFn: CRUD for services (sanitized, rate-limited)
│       ├── gallery.ts          # ServerFn: CRUD for gallery (sanitized, rate-limited)
│       └── upload.ts           # ServerFn: Cloudinary image upload (rate-limited, size-limited)
├── components/
│   ├── site/                   # Frontend components (unchanged layout)
│   │   ├── Services.tsx        # Fetches from DB via withCache(), falls back to static
│   │   ├── Portfolio.tsx       # Fetches gallery via withCache(), falls back to static
│   │   └── ...                 # Other site components unchanged
│   └── admin/                  # Completely decoupled admin components
│       ├── AdminLayout.tsx     # Standalone sidebar + topbar (no site chrome)
│       ├── AdminDashboard.tsx  # Summary cards + quick actions
│       ├── AdminServices.tsx   # Service CRUD with local file upload → Cloudinary
│       └── AdminGallery.tsx    # Category filter + image grid + Cloudinary upload modal
├── routes/
│   ├── __root.tsx              # Conditionally renders site chrome or admin shell
│   └── modular/
│       └── admin.tsx           # Single route at /modular/admin
│                               # ?view=dashboard | services | gallery
└── scripts/
    └── migrate.mjs             # Data migration script (static → MongoDB)
```

---

## 3. Decoupled Admin Panel

The admin panel is fully decoupled from the frontend UI. The root layout (`__root.tsx`) uses `useMatches()` to detect admin routes and conditionally renders either:

- **Admin mode**: Only `<QueryClientProvider>` wrapping `<Outlet />` — no Navbar, Footer, MobileNav, FloatingCTA, or SplashIntro
- **Site mode**: Full site chrome with all components

This keeps a single build while maintaining complete UI/UX separation. The admin 404 page also renders independently from the site 404.

---

## 4. Database Schema (MongoDB)

### Collection: `services`
```json
{
  "_id": "ObjectId",
  "title": "Modular Kitchen",
  "description": "Ergonomic, elegant kitchens...",
  "iconName": "ChefHat",
  "mainImage": "https://res.cloudinary.com/...",
  "mainImagePublicId": "prime-modulars/services/abc123",
  "portfolioCategory": "Kitchens",
  "order": 1,
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### Collection: `gallery_images`
```json
{
  "_id": "ObjectId",
  "src": "https://res.cloudinary.com/...",
  "publicId": "prime-modulars/gallery/kitchens/abc123",
  "category": "Kitchens",
  "caption": "Contemporary Open Kitchen — Tadepalli Residence",
  "serviceId": "ObjectId (optional link)",
  "order": 0,
  "createdAt": "ISO-8601"
}
```

### Collection: `gallery_categories`
```json
{
  "_id": "ObjectId",
  "name": "Kitchens",
  "description": "Modular kitchen designs",
  "imageCount": 12,
  "createdAt": "ISO-8601"
}
```

---

## 5. Cloudinary Integration

### Upload Flow (Local File → Cloudinary)
1. Admin selects a local file in the browser
2. File read as **base64 data URL** via `FileReader`
3. Base64 sent to `uploadImage` ServerFn with auth token
4. Server verifies auth, checks rate limit, validates size (max 10MB)
5. Constructs SHA-1 signature using API Secret → POST to Cloudinary
6. `{ secure_url, public_id }` returned and stored in form state

### Deletion Flow
- `deleteFromCloudinary(publicId)` with signed POST to `/image/destroy`
- Best-effort: proceeds even if Cloudinary call fails

### Folder Organization
- `prime-modulars/services/` — main service images
- `prime-modulars/gallery/{category}/` — gallery images by category

---

## 6. Authentication Architecture

### Token-Based Auth (localStorage)
- **Login**: `adminLogin` validates credentials against env vars → returns JWT
- **Storage**: Token in `localStorage` under key `admin_token`
- **Verification**: Each protected ServerFn includes `{ token }` in payload → `verifyToken()` decodes
- **Rate limiting**: Login endpoint limited to 5 requests/minute per email
- **Logout**: Clear `localStorage` → full page reload

### Environment Variables
```
ADMIN_EMAIL=admin@primemodulars.com
ADMIN_PASSWORD=Admin@123
JWT_SECRET=...
```

---

## 7. Security Measures

| Layer | Implementation | File |
|---|---|---|
| **Rate Limiting** | In-memory map with window + max-requests per key | `security.ts` |
| **Input Sanitization** | Strip `<>`, `javascript:`, event handlers via `sanitizeString` / `sanitizeObject` | `security.ts` |
| **Auth Verification** | JWT decoded on every mutating ServerFn call | `services.ts`, `gallery.ts`, `upload.ts` |
| **Upload Size Limit** | 10MB max file size check | `upload.ts`, `gallery.ts` |
| **Login Throttling** | 5 req/min per email address | `auth.ts` |
| **CSRF Protection** | `createCsrfMiddleware` in `start.ts` | `start.ts` |
| **Security Headers** | CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Permissions-Policy | `security.ts` |
| **Field Allowlisting** | `sanitizeObject` only persists allowed fields | `services.ts`, `gallery.ts` |

---

## 8. Caching & High Availability

### Client-Side Caching (`src/lib/cache.ts`)
- **`withCache<T>(key, fetcher, ttl)`**: First checks localStorage cache; if hit and not expired, returns cached data. Otherwise calls `fetcher()`, caches result, and returns it.
- **Stale fallback**: If `fetcher()` throws (e.g., DB down), returns any previously cached data even if expired, ensuring images and text remain visible.
- **TTL**: 5 minutes for services and gallery data; configurable per key.

### Components Using Cache
- **Services.tsx**: `withCache("services", () => getServices(), 5 * 60 * 1000)` — falls back to static `FALLBACK_SERVICES` array
- **Portfolio.tsx**: `withCache("gallery_images", () => getGalleryImages({}), 5 * 60 * 1000)` — falls back to static `GALLERY` array from `site.ts`
- **Cloudinary URLs**: All images served from `res.cloudinary.com` CDN; browser's native HTTP cache provides additional resilience

---

## 9. Data Migration

### Script: `scripts/migrate.mjs`
```
node scripts/migrate.mjs
```
- Reads `.env` for `MONGODB_URI`
- Migrates 6 default services with upsert (update existing, insert new)
- Creates 8 gallery categories (skips duplicates)
- Migrates ~40 gallery images from static data (skips duplicates by `src`)
- Updates `imageCount` on all categories
- Requires `dotenv` and `mongodb` packages

---

## 10. Local Image Upload (Main Image)

### AdminServices.tsx — File Upload Flow
1. Click the dashed upload area → `fileRef.current.click()`
2. `onChange` reads file as base64 via `FileReader`
3. Calls `uploadImage` ServerFn with `{ token, base64, folder: "services" }`
4. Server uploads to Cloudinary → returns `{ secure_url, public_id }`
5. Form state updated with URL + public ID
6. Preview shown immediately in the upload area
7. URL field is populated but hidden from direct editing

---

## 11. Secure Routing

| URL Pattern | Component | Access |
|---|---|---|
| `/modular/admin` | `AdminPage` (login → dashboard) | Public (login form) |
| `/modular/admin?view=dashboard` | `AdminDashboard` | Authenticated |
| `/modular/admin?view=services` | `AdminServices` | Authenticated |
| `/modular/admin?view=gallery` | `AdminGallery` | Authenticated |
| `/portfolio#Kitchens` | `Portfolio` (filtered) | Public |

Service selection uses `navigate({ to: "/portfolio", hash: category })` → hash-change listener in Portfolio filters by category.

---

## 12. Environment Variables (`.env`)

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=prime_modulars
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_SECRET=...
ADMIN_EMAIL=admin@primemodulars.com
ADMIN_PASSWORD=Admin@123
```

---

## 13. Build & Deploy

- **Build**: `vite build` — bundles client and SSR server
- **Route Discovery**: Auto-generated via TanStack Router plugin
- **Deployment (Vercel)**: Server functions compiled into Nitro serverless bundle via `api/index.js`
- **Migration**: Run `node scripts/migrate.mjs` with `.env` configured before first deploy
