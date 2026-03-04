# GEMINI.md - Project Context & Instructions

This file serves as the primary instructional context for Gemini CLI when working on the **Davis' Corner** blog application.

## Project Overview

**Davis' Corner** is a modern, personal blog application built with Next.js 16 and Supabase. It features a public-facing blog with search and tagging capabilities, and a secure admin dashboard for managing content.

- **Purpose:** Personal blogging, thoughts on development, design, and more.
- **Main Technologies:**
    - **Framework:** Next.js 16 (App Router)
    - **Language:** TypeScript
    - **Styling:** Tailwind CSS + Shadcn UI
    - **Backend:** Supabase (PostgreSQL, Auth, RLS)
    - **Markdown:** React Markdown + GitHub Flavored Markdown
    - **Icons:** Lucide React
    - **Forms & Validation:** React Hook Form + Zod
    - **Testing:** Vitest + React Testing Library

## Project Structure

```
/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── auth/             # Auth-related routes (callback)
│   ├── blog/             # Public blog post pages ([slug])
│   ├── dashboard/        # Protected admin area (Management, New/Edit Post)
│   └── login/            # Authentication page
├── components/           # React Components
│   ├── ui/               # Shadcn UI base components
│   └── ...               # Custom application components (Search, TagInput, etc.)
├── conductor/            # Project Orchestration & Documentation
│   ├── code_styleguides/ # Language-specific style guides
│   ├── tracks/           # Feature-specific development tracks
│   └── index.md          # Entry point for conductor documentation
├── lib/                  # Shared utilities and client initializations
│   ├── supabase.ts       # Supabase client and data fetching functions
│   └── utils.ts          # Tailwind merge and utility functions
├── supabase/             # Supabase configuration and migrations
│   └── migrations/       # SQL migration files
└── ...                   # Configuration files (Next, Tailwind, TS, Vitest, etc.)
```

## Development Workflow

### Conductor System
The project follows a "Conductor" management pattern. Refer to the `conductor/` directory for high-level project guidance:
- **Index:** `conductor/index.md`
- **Product Definition:** `conductor/product.md`
- **Tech Stack Details:** `conductor/tech-stack.md`
- **Workflow & Style:** `conductor/workflow.md` and `conductor/code_styleguides/`
- **Tracks:** `conductor/tracks.md` lists active and completed development tracks.

### Building and Running
- **Development Server:** `npm run dev`
- **Build Production:** `npm run build`
- **Start Production:** `npm run start`
- **Linting:** `npm run lint`
- **Testing:** `npm run test`
- **Coverage:** `npm run coverage`

### Database Management
Supabase is used for the backend. Use the Supabase CLI (if available) or the hosted console for management.
- **Migrations:** Located in `supabase/migrations/`. 
- **RLS:** Row-Level Security is enabled on all tables. Public access is granted for viewing published posts and tags, while authenticated users (owners) have full CRUD access.

## Coding Conventions

- **Next.js:** Prefer Server Components where possible; use `'use client'` selectively for interactivity.
- **Data Fetching:** Centralized in `lib/supabase.ts` using the Supabase client.
- **Styling:** Use Tailwind CSS utility classes. Adhere to Shadcn UI patterns for base components.
- **Types:** Strict TypeScript usage is expected. Use Zod for schema validation (especially for forms).
- **Testing:** Follow the `*.test.tsx` pattern in the `components/` or `lib/` directory.

## Key Files & Entry Points

- `app/page.tsx`: The public homepage listing published posts.
- `app/dashboard/page.tsx`: The primary entry point for the admin dashboard.
- `lib/supabase.ts`: Contains the Supabase client instance and core data fetching logic.
- `app/globals.css`: Global styles including Markdown/Prose styling.

---
*Note: This file is intended for AI consumption and should be updated as the project's architecture or dependencies evolve.*
