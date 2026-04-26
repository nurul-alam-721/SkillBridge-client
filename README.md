# SkillBridge

A full-stack tutoring platform that connects learners with expert tutors — enabling seamless booking, session management, and reviews.

**Live App:** https://skill-bridge-client-green.vercel.app
**Backend API:** https://skillbridge-backend-tcy5.onrender.com

---

## Features

- **Authentication** — Email/password and Google OAuth via Better Auth. Role-based access for Students, Tutors, and Admins
- **Tutor Discovery** — Browse and filter tutors by subject, rating, and hourly rate with real-time search
- **Booking System** — Book time slots, track session status (Pending → Confirmed → Completed), and capacity management
- **Payments** — Stripe integration for session payments, earnings tracking for tutors, and payment history for students
- **Reviews** — Students can leave, edit, and delete reviews on completed sessions
- **Tutor Dashboard** — Manage availability slots, view bookings, update profile and track earnings
- **Student Dashboard** — View upcoming and past sessions, leave reviews, manage profile and payment history
- **Admin Panel** — Manage users, bookings, categories with stats overview and all platform payments
- **Onboarding** — New Google users choose their role (Student/Tutor) on first login
- **Image Upload** — Cloudinary integration for photos
- **Dark Mode** — Full light/dark theme support

---

## Tech Stack

### Frontend

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Auth Client | Better Auth 1.4 |
| Forms | TanStack Form |
| Tables | TanStack Table |
| HTTP Client | Axios |
| Payments | Stripe |
| Image Upload | Cloudinary |
| Notifications | Sonner |
| Deployment | Vercel |

### Backend

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Language | TypeScript |
| ORM | Prisma 7 |
| Database | PostgreSQL (Neon) |
| Auth Server | Better Auth 1.4 |
| Payments | Stripe |
| Deployment | Render |

---

## Project Structure

```
SkillBridge/
├── skillbridge-client/     # Next.js frontend
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── lib/            # Auth client, axios, utils
│   │   └── types/          # TypeScript types
│   └── proxy.ts            # Next.js middleware
│
└── skillbridge-server/     # Express backend
    └── src/
        ├── modules/        # Feature modules (auth, tutors, bookings, payments…)
        ├── middlewares/    # Auth, error handling
        └── lib/            # Prisma client, auth config
```

---

## Pages & Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured tutors, categories |
| `/tutors` | Browse tutors with filters and search |
| `/tutors/:id` | Tutor profile, availability, reviews, booking |
| `/categories` | Browse all subject categories |
| `/login` | Sign in with email or Google |
| `/register` | Create a Student or Tutor account |
| `/onboarding` | Role selection for new Google users |

### Student

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview and upcoming bookings |
| `/dashboard/bookings` | Full booking history with review management |
| `/dashboard/profile` | Edit profile and photo |
| `/student/payments/history` | Payment history for sessions |

### Tutor

| Route | Description |
|-------|-------------|
| `/tutor/dashboard` | Session overview and stats |
| `/tutor/availability` | Create and manage time slots |
| `/tutor/profile` | Edit tutor profile and hourly rate |
| `/tutor/payments/earnings` | Earnings overview and payout history |

### Admin

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Platform statistics |
| `/admin/users` | Manage and ban users |
| `/admin/bookings` | View all platform bookings |
| `/admin/categories` | Create and manage subject categories |
| `/admin/payments` | All platform payments overview |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Clone the Repository

```bash
git clone <your-repo-url>
cd SkillBridge
```

### Frontend Setup

```bash
cd skillbridge-client
pnpm install
```

Create `.env.local`:

```env
NODE_ENV=development
APP_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

```bash
pnpm dev
```

### Backend Setup

```bash
cd skillbridge-server
pnpm install
```

Create `.env`:

```env
DATABASE_URL=your_neon_postgres_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:5000
APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
APP_USER=your_gmail
APP_PASSWORD=your_gmail_app_password
```

```bash
pnpm prisma db push
pnpm prisma generate
pnpm dev
```

---

## Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |

### Backend

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start with tsx watch |
| `pnpm build` | Bundle with tsup |
| `pnpm seed:admin` | Seed the admin user |

---

## Deployment

Frontend is deployed on **Vercel**, backend on **Render**.

### Backend Environment Variables (Render)

```env
PORT=
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://your-backend.onrender.com
APP_URL=https://your-frontend.vercel.app
STRIPE_SECRET_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
APP_USER=
APP_PASSWORD=
```

### Frontend Environment Variables (Vercel)

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
APP_URL=https://your-frontend.vercel.app
AUTH_URL=https://your-frontend.vercel.app
```

---
