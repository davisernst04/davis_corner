# Davis Corner

Personal blog application built with Next.js and Supabase. It provides a public reading experience for published posts and a private dashboard for managing drafts and published content.

## Overview

This project covers the core requirements for a lightweight personal publishing system:

- public blog index and post pages
- authentication for the author
- dashboard for creating, editing, publishing, and deleting posts
- markdown-based writing workflow

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- PostgreSQL
- React Markdown

## Features

- Public blog pages for published posts
- Author-only dashboard
- Draft and publish workflow
- Markdown editor and preview support
- Supabase-backed authentication and storage
- Row-level security for post access control

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/davisernst04/davis_corner.git
cd davis_corner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and supply your Supabase values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Create the database schema

Apply the SQL in `supabase/migrations/`, or create equivalent tables and policies in Supabase for blog posts and authenticated access.

### 5. Start the development server

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Routes

- `/` - blog index
- `/blog/[slug]` - individual post page
- `/dashboard` - post management dashboard
- `/dashboard/new` - create a post
- `/dashboard/edit/[id]` - edit a post
- `/login` - authentication

## Project Structure

```text
davis_corner/
├── app/
│   ├── blog/
│   ├── dashboard/
│   └── login/
├── components/
├── lib/
├── supabase/
│   └── migrations/
└── package.json
```

## Security

The project relies on Supabase authentication and database policies to restrict dashboard access and ensure users can only manage their own content.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run linting
- `npm run test` - run tests
- `npm run coverage` - run test coverage

## Deployment

The application can be deployed to Vercel or any platform capable of running a Next.js application. Configure the required environment variables and database connection before deployment.

## License

MIT
