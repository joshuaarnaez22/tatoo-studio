# Tattoo AI Studio

A tattoo visualization and AI generation website where users can upload body images, browse or generate custom tattoo designs via AI, preview how tattoos will look on their body, and save designs to their profile.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| 3D/Animations | React Three Fiber, Three.js, Framer Motion |
| Authentication | Clerk |
| Database | Neon (Serverless Postgres) |
| ORM | Prisma |
| State/Data | TanStack Query (React Query) |
| AI Image Generation | Google Gemini (free tier) + OpenAI GPT Image (premium) |
| File Storage | Uploadthing or Cloudflare R2 |
| Deployment | Vercel |

## Features

- **3D Landing Page** - Immersive hero section with floating tattoo designs and interactive body models
- **Tattoo Studio** - Upload body images and position/resize tattoo designs with an interactive canvas
- **AI Generation** - Generate custom tattoo designs with text prompts and style selection
- **Design Gallery** - Browse curated tattoo designs filtered by category/style
- **User Profiles** - Save favorite designs and generation history

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd tattoo-ai-studio

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up the database
pnpm prisma generate
pnpm prisma db push

# Run development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# AI Services
GOOGLE_AI_API_KEY=
OPENAI_API_KEY=

# File Storage (Uploadthing)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Landing page, pricing
│   ├── (auth)/               # Clerk auth pages
│   ├── (dashboard)/          # Protected routes
│   │   ├── dashboard/
│   │   ├── studio/           # Main tattoo studio
│   │   ├── generate/         # AI generation
│   │   ├── gallery/          # Browse designs
│   │   └── saved/            # User's saved designs
│   └── api/
│       ├── webhooks/clerk/   # Clerk webhook
│       ├── upload/           # File upload endpoints
│       └── generate/         # AI generation endpoint
├── components/
│   ├── 3d/                   # Three.js components
│   ├── ui/                   # shadcn/ui components
│   ├── studio/               # Tattoo studio components
│   └── layout/
├── lib/
│   ├── prisma.ts
│   ├── ai/                   # AI integrations
│   └── utils.ts
└── hooks/
```

## AI Generation Strategy

The app uses a hybrid approach for cost-effectiveness:

- **Draft Mode (Gemini)** - Free tier with 500 images/day, fast generation (~5s)
- **HD Mode (OpenAI)** - Premium quality at $0.005-$0.015/image

## Development Phases

1. **Foundation** - Next.js setup, Clerk auth, Neon database, Prisma schema
2. **Core Features** - File upload, tattoo studio canvas, design gallery, favorites
3. **AI Integration** - Gemini API, OpenAI premium option, rate limiting
4. **3D & Polish** - 3D landing page, scroll animations, micro-interactions
5. **Launch** - SEO, performance optimization, Vercel deployment

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/generate | Generate AI tattoo design |
| POST | /api/upload | Upload body image |
| POST | /api/preview | Create tattoo preview composite |
| GET | /api/saved | Get user's saved designs |
| POST | /api/saved | Save a design |
| DELETE | /api/saved/:id | Remove saved design |

## License

MIT
