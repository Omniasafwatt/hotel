# GrandeBeach Khairan — Frontend

A full-featured, bilingual (Arabic + English) luxury chalet booking platform for **GrandeBeach Al Khairan, Kuwait**.  
Built with **React 19 + TypeScript + Vite + Redux Toolkit + Tailwind CSS v4**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Variables](#environment-variables)
5. [Getting Started](#getting-started)
6. [Available Scripts](#available-scripts)
7. [Pages & Routes](#pages--routes)
8. [State Management (Redux)](#state-management-redux)
9. [API Integration](#api-integration)
10. [Authentication & Token Refresh](#authentication--token-refresh)
11. [Internationalization (i18n)](#internationalization-i18n)
12. [Loyalty Program](#loyalty-program)
13. [Verification Flow](#verification-flow)
14. [Reviews System](#reviews-system)
15. [Admin Panel](#admin-panel)
16. [Deployment (Vercel)](#deployment-vercel)
17. [Key Constants](#key-constants)
18. [Folder Reference](#folder-reference)

---

## Project Overview

GrandeBeach Khairan is a resort property that offers luxury chalets in three tiers:

| Tier | API value | Description |
|---|---|---|
| Standard | `Standard` | Base-tier chalets |
| Superior | `Superior` | Mid-tier chalets |
| VIP | `VIP` | Top-tier chalets |

Guests can browse chalets, submit booking requests, verify their identity (ID card + selfie + digital signature), leave reviews, and track loyalty points — all in Arabic or English.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| State management | Redux Toolkit 2 + React-Redux 9 |
| Routing | React Router DOM v7 |
| Forms | React Hook Form 7 + Zod 4 (schema validation) |
| Animations | Framer Motion 12 + AOS (scroll animations) |
| Translations | i18next 26 + react-i18next 17 |
| Notifications | react-hot-toast |
| Icons | lucide-react + react-icons |
| Date utilities | date-fns 4 |
| HTTP | Native `fetch` (no Axios) |

---

## Project Structure

```
grande-frontend/
├── public/
│   └── IMG_8916.MP4          # Hero background video
├── src/
│   ├── main.tsx              # App entry — mounts React + Redux + i18n
│   ├── App.tsx               # Router, protected routes, background token refresh
│   ├── App.css / index.css   # Global styles + Tailwind imports
│   │
│   ├── types/
│   │   └── index.ts          # All shared TypeScript types (User, Chalet, Booking…)
│   │
│   ├── utils/
│   │   ├── constants.ts      # WhatsApp number, tax rate, loyalty tiers, etc.
│   │   ├── cn.ts             # Tailwind class merger utility
│   │   └── pricing.ts        # Price calculation logic (nights, discounts, loyalty)
│   │
│   ├── data/
│   │   └── chaletImages.ts   # Maps chalet name → local asset images
│   │
│   ├── i18n/
│   │   ├── index.ts          # i18next setup, language detection
│   │   └── locales/
│   │       ├── en.ts         # All English strings
│   │       └── ar.ts         # All Arabic strings (RTL)
│   │
│   ├── hooks/
│   │   ├── useAppDispatch.ts        # Typed Redux dispatch hook
│   │   ├── useAppSelector.ts        # Typed Redux selector hook
│   │   └── useNotificationPoller.ts # Polls for new notifications every 30s
│   │
│   ├── store/
│   │   ├── index.ts                 # Root Redux store
│   │   └── slices/
│   │       ├── authSlice.ts         # Auth state, login, register, refresh token
│   │       ├── chaletsSlice.ts      # Chalets list, filters, single chalet
│   │       ├── bookingSlice.ts      # Booking flow, my bookings, cancel
│   │       ├── addonsSlice.ts       # Add-ons / extra services
│   │       ├── notificationSlice.ts # In-app notifications
│   │       ├── uiSlice.ts           # UI state (sidebar, modals, language)
│   │       └── adminSlice.ts        # Admin-only data (all bookings, all users)
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx           # Styled button (variant, size, isLoading)
│   │   │   ├── Input.tsx            # Labelled input with error display
│   │   │   ├── Badge.tsx            # Small coloured label
│   │   │   ├── Card.tsx             # White box container
│   │   │   ├── Modal.tsx            # Overlay popup
│   │   │   ├── Spinner.tsx          # Loading spinner
│   │   │   └── NotificationBell.tsx # Bell icon with count badge
│   │   ├── layout/
│   │   │   ├── Layout.tsx           # Public page wrapper (Header + outlet + Footer)
│   │   │   ├── Header.tsx           # Nav bar, language toggle, auth buttons
│   │   │   ├── Footer.tsx           # Footer links and social icons
│   │   │   └── AdminLayout.tsx      # Admin sidebar + outlet
│   │   ├── chalets/
│   │   │   ├── ChaletCard.tsx       # Card shown in the chalets grid
│   │   │   ├── ChaletFilter.tsx     # Filter sidebar (type, price, guests, dates)
│   │   │   └── AvailabilityCalendar.tsx  # Blocked dates calendar
│   │   ├── booking/
│   │   │   ├── BookingCalendar.tsx  # Date picker for new bookings
│   │   │   ├── PricingSummary.tsx   # Price breakdown component
│   │   │   └── RequestModal.tsx     # "Request Now" popup on chalet detail
│   │   └── payment/
│   │       └── PaymentMethod.tsx    # Payment options UI
│   │
│   └── pages/
│       ├── Home.tsx             # Landing page
│       ├── Chalets.tsx          # Chalets grid + filters
│       ├── ChaletDetail.tsx     # Single chalet — photos, amenities, booking card
│       ├── Booking.tsx          # Select dates & guests
│       ├── Checkout.tsx         # Review & confirm booking
│       ├── Confirmation.tsx     # Booking success screen
│       ├── Login.tsx            # Login form
│       ├── Register.tsx         # Registration form
│       ├── ForgotPassword.tsx   # Request password reset email
│       ├── ResetPassword.tsx    # Set new password with token
│       ├── Profile.tsx          # View account details (read-only)
│       ├── MyBookings.tsx       # My bookings list + verification + review
│       ├── Reviews.tsx          # All reviews + write a review
│       ├── Brands.tsx           # About the brand
│       ├── Contact.tsx          # Contact form
│       ├── NotFound.tsx         # 404 page
│       └── admin/
│           ├── Dashboard.tsx         # Stats overview
│           ├── ManageBookings.tsx    # View/approve/reject bookings
│           ├── ManageChalets.tsx     # Add/edit/deactivate chalets
│           ├── ManagePricing.tsx     # Set prices
│           ├── ManageUsers.tsx       # View all users
│           ├── ManagePromotions.tsx  # Discount codes
│           ├── ManageReviews.tsx     # Approve/delete reviews
│           └── ManageVerification.tsx # Review ID verification submissions
├── vercel.json               # Vercel deployment config (rewrites)
├── vite.config.ts            # Vite config (proxy, base path, alias)
└── package.json
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://api.grandebeach.com
```

- In **development**, Vite proxies `/api` and `/uploads` to the backend automatically (see `vite.config.ts`).
- In **production** (Vercel), `vercel.json` rewrites handle the proxy.
- Never commit `.env` to git.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create env file
echo "VITE_API_BASE_URL=https://api.grandebeach.com" > .env

# 3. Start development server
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Starts Vite dev server with HMR |
| Build | `npm run build` | TypeScript check + Vite production build |
| Preview | `npm run preview` | Preview the production build locally |
| Lint | `npm run lint` | Run ESLint |

---

## Pages & Routes

| URL | Page | Auth required |
|---|---|---|
| `/` | Home | No |
| `/chalets` | Chalets grid | No |
| `/chalets/:id` | Chalet detail | No |
| `/booking/:chaletId` | Select dates | **Yes** |
| `/checkout` | Confirm booking | **Yes** |
| `/confirmation/:bookingId` | Booking success | **Yes** |
| `/login` | Login | No |
| `/register` | Sign up | No |
| `/forgot-password` | Forgot password | No |
| `/reset-password` | Reset password | No |
| `/profile` | My profile (view only) | **Yes** |
| `/my-bookings` | My bookings | **Yes** |
| `/reviews` | All reviews | No (write requires login) |
| `/brands` | About brands | No |
| `/contact` | Contact | No |
| `/admin` | Admin dashboard | **Admin role** |
| `/admin/bookings` | Manage bookings | **Admin role** |
| `/admin/chalets` | Manage chalets | **Admin role** |
| `/admin/pricing` | Manage pricing | **Admin role** |
| `/admin/users` | Manage users | **Admin role** |
| `/admin/promotions` | Promotions | **Admin role** |
| `/admin/reviews` | Manage reviews | **Admin role** |
| `/admin/verification` | ID verification | **Admin role** |

Unauthenticated users trying to access protected routes are redirected to `/login`. After login they are sent back to the page they originally tried to visit.

---

## State Management (Redux)

The Redux store (`src/store/index.ts`) combines these slices:

### `auth`
```
{ user, isAuthenticated, isGuest, isLoading, error }
```
- `loginWithAPI` — POST `/api/Auth/login`
- `registerWithAPI` — POST `/api/Auth/register`
- `tryRefreshToken` — POST `/api/Auth/refresh` (exported, called every 10 min by App.tsx)
- `fetchProfile` — GET `/api/Auth/profile`
- `updateProfile` — PUT `/api/Auth/profile`
- `logout` — clears localStorage and Redux state

### `chalets`
```
{ chalets[], selectedChalet, filters, isLoading, error }
```
- `fetchChalets(filters?)` — GET `/api/Chalets` (paginates automatically, fetches all pages)
- `fetchChaletById(id)` — GET `/api/Chalets/:id`
- `selectFilteredChalets` — memoised selector that sorts client-side

### `booking`
```
{ currentBooking, myBookings, myBookingsLoading, myBookingsError }
```
- `fetchMyBookings` — GET `/api/Bookings/my`
- `fetchBookingById(id)` — GET `/api/Bookings/:id`
- `cancelUserBooking(id, reason)` — POST `/api/Bookings/:id/cancel`

### `notifications`
```
{ notifications[], unreadCount }
```
- Polled every 30 seconds via `useNotificationPoller` hook

### `ui`
```
{ sidebarOpen, language, activeModal }
```

### `admin`
```
{ bookings[], users[], isLoading }
```
- Used only inside `/admin/*` pages

---

## API Integration

**Base URL:** `https://api.grandebeach.com`

All authenticated requests send:
```
Authorization: Bearer <access_token>
```

Token is stored in `localStorage` as `access_token`. Refresh token stored as `refresh_token`.

### Key Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/Auth/login` | Login |
| POST | `/api/Auth/register` | Register |
| POST | `/api/Auth/refresh` | Refresh access token |
| GET | `/api/Auth/profile` | Get logged-in user profile |
| PUT | `/api/Auth/profile` | Update profile |
| POST | `/api/Auth/change-password` | Change password |
| POST | `/api/Auth/forgot-password` | Request reset email |
| POST | `/api/Auth/reset-password` | Reset password with token |
| GET | `/api/Chalets` | List chalets (paginated, filterable) |
| GET | `/api/Chalets/:id` | Single chalet |
| GET | `/api/Bookings/my` | My bookings |
| GET | `/api/Bookings/:id` | Booking detail |
| POST | `/api/Bookings/:id/cancel` | Cancel a booking |
| GET | `/api/reviews` | All reviews (paginated) |
| GET | `/api/reviews/chalet/:chaletId` | Reviews for one chalet |
| POST | `/api/reviews` | Submit a review |
| POST | `/api/Verification` | Submit identity verification (multipart/form-data) |
| GET | `/api/Verification/my` | Get my verification status |
| GET | `/api/admin/verification` | Admin: list all verifications |
| POST | `/api/admin/verification/:id/review` | Admin: approve or reject |

### Chalet Query Parameters

```
GET /api/Chalets?Page=1&PageSize=50&Type=VIP&Guests=4&MinPrice=100&MaxPrice=500&CheckIn=...&CheckOut=...
```

---

## Authentication & Token Refresh

The backend issues two tokens on login/register:
- **Access token** — short-lived (used for all API calls)
- **Refresh token** — long-lived (used to get a new access token)

### Automatic Background Refresh

`App.tsx` runs a `setInterval` every **10 minutes** when the user is authenticated. It calls `tryRefreshToken()` silently — the user never notices and never gets logged out mid-session.

```
Access token expires → tryRefreshToken() → new access token stored → next API call succeeds
```

If the refresh token itself expires (very long idle), the next protected API call will return 401 and the user must log in again.

### Where Tokens Are Stored

| Key | Value |
|---|---|
| `localStorage.access_token` | JWT access token |
| `localStorage.refresh_token` | Refresh token |
| `localStorage.auth_user` | Serialised user object (instant rehydration on page load) |

---

## Internationalization (i18n)

- Library: **i18next** + **react-i18next**
- Languages: **English (`en`)** and **Arabic (`ar`)**
- Language is detected from the browser and can be toggled in the header
- Arabic uses RTL layout — Tailwind's `dir="rtl"` is applied to `<html>`
- All UI strings live in `src/i18n/locales/en.ts` and `src/i18n/locales/ar.ts`
- Use `const { t, i18n } = useTranslation()` in any component
- Language code is sent to the API as `preferredLanguage` on register

---

## Loyalty Program

Points are earned on every booking at the rate of **0.1 points per KWD spent**.

| Tier | Points required | Discount |
|---|---|---|
| Bronze | 0 – 999 | 0% |
| Silver | 1,000 – 4,999 | 5% |
| Gold | 5,000 – 9,999 | 8% |
| Platinum | 10,000+ | 12% |

Maximum loyalty discount cap: **20%**.  
Points and tier are stored on the user object and updated via `updateLoyaltyPoints` Redux action.

---

## Verification Flow

Identity verification is required for booking confirmation. The user submits from the **My Bookings** page:

1. User clicks **Verify** on a pending/confirmed booking
2. `VerificationModal` opens (bottom sheet) with three required fields:
   - **ID Card** — file upload (image)
   - **Selfie photo** — file upload (image)
   - **Digital Signature** — canvas pad drawn with mouse or finger, exported as base64 PNG
3. Submitted via `POST /api/Verification` as `multipart/form-data`:

```
IdCard        → File (image)
Photo         → File (image)
SignatureData → base64 PNG string
BookingId     → UUID
```

4. Admin reviews via `/admin/verification` — can approve or reject with a written reason
5. User checks status via `GET /api/Verification/my`

Verification status is shown on each booking card:
- `Pending` — amber badge, awaiting admin review
- `Approved` — green "Verified ✓" badge (replaces the Verify button)
- `Rejected` — rejection reason shown, user must resubmit

---

## Reviews System

### Guest View (`/reviews`)
- Loads all reviews via `GET /api/reviews` (paginated)
- Can filter by chalet using `GET /api/reviews/chalet/:chaletId`
- Each review card shows: chalet photo, type badge (Standard / Superior / VIP), star rating, comment, guest name
- Logged-in users can write a review via the sidebar form:
  - Select a completed or confirmed booking from a dropdown
  - Rate 1–5 stars with interactive star picker
  - Optional comment textarea

### Home Page
- Shows 6 latest reviews in a 3-column grid section
- Fetched directly from the API on page load

### My Bookings
- Completed bookings show a **Review** button
- Opens a bottom sheet with star picker and comment

---

## Admin Panel

Accessible at `/admin` — requires a user with `admin`, `superadmin`, `manager`, or `staff` role.

| Page | What it does |
|---|---|
| Dashboard | Total bookings, revenue, occupancy stats |
| Manage Bookings | View all bookings, approve or reject requests |
| Manage Chalets | Add, edit, activate/deactivate chalets |
| Manage Pricing | Set base price and weekend price per chalet |
| Manage Users | View all registered users and their details |
| Manage Promotions | Create and manage discount/promo codes |
| Manage Reviews | Approve or delete guest reviews |
| Manage Verification | View submitted ID, selfie and signature — approve or reject with reason |

---

## Deployment (Vercel)

The project is deployed on **Vercel**.

### `vercel.json`
```json
{
  "rewrites": [
    { "source": "/api/:path*",     "destination": "https://api.grandebeach.com/api/:path*" },
    { "source": "/uploads/:path*", "destination": "https://api.grandebeach.com/uploads/:path*" },
    { "source": "/((?!api|uploads).*)", "destination": "/index.html" }
  ]
}
```

- The first two rules proxy API and upload requests to the backend (avoids CORS in production).
- The third rule sends all other URLs to `index.html` so React Router handles client-side navigation.

### `vite.config.ts` — critical setting
```ts
base: '/'   // Must be '/' for Vercel — './' breaks non-root routes
```

### Build command for Vercel
```
npm run build
```

Output directory: `dist/`

---

## Key Constants (`src/utils/constants.ts`)

| Constant | Value | Description |
|---|---|---|
| `WHATSAPP_NUMBER` | `+96590976666` | Resort WhatsApp contact |
| `TAX_RATE` | `0.15` | 15% tax on bookings |
| `DEPOSIT_RATE` | `0.30` | 30% deposit required |
| `LOYALTY_POINTS_PER_KWD` | `0.1` | Points earned per KWD spent |
| `LOYALTY_POINTS_TO_KWD` | `0.5` | Redemption rate (points → KWD) |
| `MAX_LOYALTY_DISCOUNT_PERCENT` | `0.20` | Cap on loyalty discount (20%) |
| `WEEKEND_DAYS` | `[5, 6]` | Friday + Saturday (Kuwait weekend) |
| `RESORT_LOCATION` | `{ lat: 28.6553, lng: 48.3861 }` | GPS coordinates |

---

## Folder Reference

| Folder | Purpose |
|---|---|
| `src/types/` | Shared TypeScript interfaces used across the whole app |
| `src/utils/` | Pure functions and constants — no React, no Redux |
| `src/data/` | Static data (chalet image mappings) |
| `src/i18n/` | Translation strings for Arabic and English |
| `src/hooks/` | Custom React hooks (typed Redux, notification polling) |
| `src/store/` | Redux store and all slices |
| `src/components/ui/` | Generic reusable UI components (Button, Input, Modal…) |
| `src/components/layout/` | Page shells (Header, Footer, Layout, AdminLayout) |
| `src/components/chalets/` | Chalet-specific components (card, filter, calendar) |
| `src/components/booking/` | Booking flow components |
| `src/pages/` | One file per route — full page components |
| `src/pages/admin/` | Admin-only pages |
| `public/` | Static assets served as-is (hero video) |

---

## Important Notes

- **Booking is a request system**, not instant. The team reviews and confirms manually.
- **Cancellation** goes through WhatsApp — the app opens a pre-filled WhatsApp message with booking details when a user requests cancellation.
- **Chalet images** are local assets mapped by chalet name in `src/data/chaletImages.ts` — not served from the API.
- **Local dev proxy** — the Vite dev server proxies `/api` and `/uploads` so no CORS configuration is needed during development.
- **Profile page** is view-only — cancellation is handled exclusively from the My Bookings page with a WhatsApp flow.
