# SkillBridge Client

Frontend for SkillBridge — a platform connecting learners with expert tutors.

**Live App:** https://skill-bridge-client-green.vercel.app  
**Backend API:** https://skillbridge-server-vj5k.onrender.com

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Better Auth
- **Frontend Deployment:** Vercel
- **Backend Deployment:** Render

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
git clone <your-repo-url>
cd skillbridge-client
pnpm install
```
### Development

```bash
pnpm dev
```

### Production

```bash
pnpm build
pnpm start
```

---

## Pages & Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Home — hero, search, featured tutors |
| `/tutors` | Browse tutors with filters |
| `/tutors/:id` | Tutor profile, reviews, booking |
| `/login` | Login |
| `/register` | Registration |

### Student

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview and bookings |
| `/dashboard/bookings` | Booking history |
| `/dashboard/profile` | Edit profile |

### Tutor

| Route | Description |
|-------|-------------|
| `/tutor/dashboard` | Sessions and stats |
| `/tutor/availability` | Manage time slots |
| `/tutor/profile` | Edit tutor info |

### Admin

| Route | Description |
|-------|-------------|
| `/admin` | Platform statistics |
| `/admin/users` | Manage users |
| `/admin/bookings` | All bookings |
| `/admin/categories` | Manage categories |

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |