# Gemini Project Context: Personal Blog App

This project is a modern, personal blog application built with the Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase for authentication and database management.

## Project Overview

- **Frontend:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **Backend/Auth:** Supabase (PostgreSQL + GoTrue)
- **Content:** Markdown-based posts rendered with `react-markdown` and `remark-gfm`

The application features a public-facing blog and a protected admin dashboard for managing posts (create, read, update, delete).

## Architecture

- **Public Routes:**
  - `/`: Home page listing all published posts.
  - `/blog/[slug]`: Individual post page with Markdown rendering.
- **Protected Routes (Dashboard):**
  - `/dashboard`: Management interface for all posts (drafts and published).
  - `/dashboard/new`: Editor for creating new posts.
  - `/dashboard/edit/[id]`: Editor for modifying existing posts.
- **Authentication:**
  - `/login`: Unified login and signup page.
  - Auth state is managed via Supabase Auth Helpers.

## Key Commands

- `npm run dev`: Starts the development server at `http://localhost:3000`.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built production application.
- `npm run lint`: Runs ESLint for code quality checks.

## Development Conventions

- **Component Model:** The project primarily uses **Client Components** (`'use client'`) for data fetching and interactivity, leveraging the Supabase client-side SDK.
- **Styling:** Tailwind CSS is used for all styling. Global styles and Markdown-specific prose styles are defined in `app/globals.css`.
- **Database:** The primary table is `blog_posts`. Refer to `README.md` or `ARCHITECTURE.md` for the full SQL schema and Row Level Security (RLS) policies.
- **Authentication Check:** Protected routes are guarded in `app/dashboard/layout.tsx` using a client-side `useEffect` hook that checks for an active Supabase session.
- **Environment Variables:** Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

## Key Files

- `lib/supabase.ts`: Initializes the Supabase browser client.
- `app/layout.tsx`: Root layout defining metadata and global styles.
- `app/dashboard/layout.tsx`: Handles authentication logic for the admin area.
- `app/blog/[slug]/page.tsx`: Renders individual blog posts from Markdown.
- `app/dashboard/new/page.tsx`: Contains the Markdown editor for post creation.

## Documentation

For more detailed information, refer to:
- `README.md`: General overview and setup instructions.
- `ARCHITECTURE.md`: Detailed data flow and component structure.
- `PROJECT_SUMMARY.md`: High-level summary of the project state.
- `SETUP.md`: Step-by-step installation and configuration guide.
