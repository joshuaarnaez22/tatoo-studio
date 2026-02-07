# CLAUDE.md - Tattoo AI Studio

This file provides context for AI assistants working on this codebase.

## Project Overview

Tattoo AI Studio is a web application for tattoo visualization and AI generation. Users can:
1. Upload an image of their body part where they want the tattoo
2. Browse/select existing tattoo designs OR generate custom tattoos via AI prompts
3. Preview how the tattoo will look on their body using an interactive canvas
4. Save designs to their profile

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **3D/Animations**: React Three Fiber, Three.js, Framer Motion
- **Authentication**: Clerk
- **Database**: Neon (Serverless Postgres)
- **ORM**: Prisma
- **State Management**: TanStack Query (React Query)
- **AI Image Generation**: Google Gemini (free/draft) + OpenAI GPT Image (premium/HD)
- **File Storage**: Uploadthing or Cloudflare R2
- **Deployment**: Vercel

## Skills Reference

Skills from `antigravity-awesome-skills` to guide implementation. Clone to `.agent/skills/` directory.

```bash
git clone https://github.com/sickn33/antigravity-awesome-skills.git .agent/skills
```

### Core Skills by Feature

| Skill | Purpose | Use For |
|-------|---------|---------|
| `@3d-web-experience` | Three.js, React Three Fiber, WebGL, 3D scenes | 3D landing page, floating tattoo designs, interactive body models |
| `@clerk-auth` | Clerk auth implementation, middleware, webhooks | Authentication flow, user sync, protected routes |
| `@neon-postgres` | Serverless Postgres, branching, connection pooling | Database setup, connection management |
| `@prisma-expert` | Schema design, migrations, query optimization | Database models, relations, queries |
| `@nextjs-best-practices` | App Router, Server Components, data fetching | Route structure, data patterns, API routes |
| `@ai-wrapper-product` | AI API integration, cost management, rate limiting | Gemini/OpenAI integration, usage tracking |
| `@file-uploads` | S3/R2, presigned URLs, image handling | Body image uploads, tattoo design storage |
| `@frontend-design` | Production-grade UI, distinctive aesthetics | Dark cosmic/neon theme, unique visual identity |
| `@ui-ux-pro-max` | 50 styles, palettes, fonts, React/Next.js patterns | Component design, interaction patterns |
| `@react-patterns` | Modern React hooks, composition, TypeScript | Custom hooks, component architecture |
| `@tailwind-patterns` | Tailwind v4, container queries, design tokens | Styling system, responsive design |
| `@scroll-experience` | Parallax, scroll animations, immersive experiences | Landing page scroll effects |
| `@interactive-portfolio` | Building memorable portfolio-style experiences | Overall site experience, transitions |
| `@api-security-best-practices` | Secure API design, auth, validation | API route protection, input validation |

### Example Skill Prompts

```
# 3D Landing Page
@3d-web-experience help me create an immersive 3D landing page with floating tattoo designs using React Three Fiber

# Authentication
@clerk-auth set up authentication with Next.js App Router including webhooks to sync users

# Database
@neon-postgres configure my Neon database with Prisma for a tattoo design platform
@prisma-expert review my schema for the tattoo design platform

# AI Integration
@ai-wrapper-product implement a tattoo generation feature using both Gemini (free) and OpenAI (premium) with proper cost management

# File Uploads
@file-uploads create a drag-and-drop upload system for body images with S3/R2 storage

# UI/UX
@frontend-design create a dark cosmic aesthetic UI that avoids generic AI look - think neon accents, glassmorphism, unique typography
@ui-ux-pro-max review my tattoo studio interface and suggest improvements for the canvas interaction

# Animations
@scroll-experience add parallax scroll effects to the landing page
```

## Key Architecture Decisions

### AI Generation Strategy
- **Gemini** for draft/free generations (500 images/day free tier, ~$0.039/image paid)
- **OpenAI GPT Image** for HD/premium generations ($0.005-$0.015/image)
- Track generation costs per user in the database
- Implement rate limiting per user

### Database Models
- `User` - Synced from Clerk via webhook
- `Upload` - User's body part images
- `TattooDesign` - Tattoo designs (curated or user-generated)
- `Generation` - AI generation history with cost tracking
- `TattooPreview` - Composited preview images with position data
- `SavedDesign` - User's favorited designs

### Route Groups
- `(marketing)` - Public landing page, pricing
- `(auth)` - Clerk sign-in/sign-up pages
- `(dashboard)` - Protected routes requiring authentication

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm lint                   # Run ESLint

# Database
pnpm prisma generate        # Generate Prisma client
pnpm prisma db push         # Push schema changes
pnpm prisma studio          # Open Prisma Studio
pnpm prisma migrate dev     # Create migration

# Testing
pnpm test                   # Run tests
```

## File Naming Conventions

- Components: PascalCase (e.g., `TattooCanvas.tsx`)
- Utilities/hooks: camelCase (e.g., `useUpload.ts`)
- API routes: kebab-case folders with `route.ts`
- Types: PascalCase in `types/` directory

## Important Patterns

### Server Components vs Client Components
- Default to Server Components for data fetching
- Use `"use client"` only when needed (interactivity, hooks, browser APIs)
- 3D components (`components/3d/`) are always client components

### Data Fetching
- Use Server Components for initial data
- Use TanStack Query for client-side state and mutations
- Implement optimistic updates for better UX

### File Uploads
- Validate file type and size on both client and server
- Use presigned URLs for secure uploads
- Store metadata in database, files in R2/Uploadthing

### AI API Calls
- Always call AI APIs from server-side (API routes)
- Never expose API keys to client
- Implement proper error handling and rate limiting
- Log generation costs for analytics

## Security Considerations

- Validate all file uploads (type: image/*, max size: 10MB)
- Rate limit AI generation endpoints (e.g., 10/hour for free users)
- Sanitize user prompts before sending to AI
- Use Clerk middleware to protect dashboard routes
- Never expose API keys in client-side code

## UI/Design Guidelines

- Dark cosmic/neon aesthetic
- Avoid generic "AI look" - aim for distinctive, artistic feel
- Use glassmorphism effects sparingly
- Neon accent colors on dark backgrounds
- Smooth animations with Framer Motion
- Mobile-first responsive design

## Environment Variables Required

```
DATABASE_URL                        # Neon connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY   # Clerk public key
CLERK_SECRET_KEY                    # Clerk secret key
CLERK_WEBHOOK_SECRET                # Clerk webhook signing secret
GOOGLE_AI_API_KEY                   # Gemini API key
OPENAI_API_KEY                      # OpenAI API key
UPLOADTHING_SECRET                  # Uploadthing secret
UPLOADTHING_APP_ID                  # Uploadthing app ID
NEXT_PUBLIC_APP_URL                 # App URL (http://localhost:3000 for dev)
```

## Prisma Schema Reference

```prisma
model User {
  id, clerkId, email, name, avatarUrl, createdAt, updatedAt
  relations: uploads, designs, generations, savedDesigns
}

model Upload {
  id, userId, url, publicId, bodyPart, createdAt
  relations: user, previews
}

model TattooDesign {
  id, userId, name, description, imageUrl, category, tags[], isPublic, createdAt
  relations: user, previews, savedBy
}

model Generation {
  id, userId, prompt, imageUrl, model, cost, createdAt
  relations: user
}

model TattooPreview {
  id, uploadId, designId, resultUrl, position (JSON), createdAt
  relations: upload, design
}

model SavedDesign {
  id, userId, designId, createdAt
  unique: [userId, designId]
  relations: user, design
}
```

## API Route Patterns

```typescript
// POST /api/generate
// Body: { prompt: string, style: string, quality: "draft" | "hd" }
// Returns: { imageUrl: string, generationId: string }

// POST /api/upload
// Body: FormData with image
// Returns: { url: string, uploadId: string }

// POST /api/preview
// Body: { uploadId: string, designId: string, position: object }
// Returns: { previewUrl: string }
```

## Implementation Checklist

### Phase 1: Foundation
- [x] Next.js + Tailwind + shadcn/ui setup
- [x] Clerk authentication configuration
- [x] Neon database + Prisma schema
- [x] Clerk webhook for user sync

### Phase 2: Core Features
- [x] File upload system (Uploadthing)
- [x] Tattoo studio canvas (2D with drag/resize/rotate)
- [x] Design gallery with filters
- [x] Save/favorites functionality

### Phase 3: AI Integration
- [x] Gemini API integration (free tier - draft mode)
- [x] OpenAI as premium option (HD mode)
- [x] Rate limiting (10 draft/hr, 5 HD/hr)
- [x] Generation history (saved to database)

### Phase 4: 3D & Polish
- [x] 3D landing page with React Three Fiber (floating designs, animated camera, particles)
- [x] Scroll animations (Framer Motion, parallax hero)
- [x] Loading states & micro-interactions (spinners, skeletons, animated buttons)
- [x] Mobile responsiveness (bottom tab bar, slide-out menu)

### Phase 5: Launch
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Vercel deployment
