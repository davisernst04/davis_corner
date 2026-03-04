# Personal Blog App

A modern, feature-rich personal blog application built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, and Supabase. Only you can access the dashboard to manage your blog posts.

## Features

✨ **Core Features:**
- 🔐 Secure authentication with Supabase (email/password only - you control access)
- 📝 Markdown editor with live preview for creating and editing posts
- 🎨 Beautiful, responsive UI with shadcn/ui components
- 📱 Mobile-friendly design
- 🔍 SEO-friendly blog pages
- 🎯 Draft and publish functionality
- 🗑️ Easy post management (create, read, update, delete)

## Tech Stack

- **Frontend:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend & Auth:** Supabase
- **Database:** PostgreSQL (via Supabase)
- **Markdown:** React Markdown with GitHub Flavored Markdown support

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your `Project URL` and `Anon Public Key` from Settings → API

### 2. Create Database Schema

In your Supabase project, go to SQL Editor and run this SQL:

```sql
-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id uuid NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Set RLS (Row Level Security)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published posts
CREATE POLICY "Published posts are viewable by everyone" 
ON public.blog_posts FOR SELECT 
USING (published = true);

-- Authenticated users can only view their own draft posts
CREATE POLICY "Users can view their own draft posts" 
ON public.blog_posts FOR SELECT 
USING (auth.uid() = author_id);

-- Users can only insert their own posts
CREATE POLICY "Users can insert their own posts" 
ON public.blog_posts FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- Users can only update their own posts
CREATE POLICY "Users can update their own posts" 
ON public.blog_posts FOR UPDATE 
USING (auth.uid() = author_id);

-- Users can only delete their own posts
CREATE POLICY "Users can delete their own posts" 
ON public.blog_posts FOR DELETE 
USING (auth.uid() = author_id);
```

### 3. Install Dependencies

```bash
cd blog-app
npm install
```

Or with yarn:
```bash
yarn install
```

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

### Public Blog
- **Home Page** (`/`): Displays all published blog posts
- **Blog Post** (`/blog/[slug]`): Read individual blog posts with rendered Markdown

### Admin Dashboard
- **Dashboard** (`/dashboard`): View all your posts (drafts and published)
- **New Post** (`/dashboard/new`): Create a new blog post with Markdown editor
- **Edit Post** (`/dashboard/edit/[id]`): Edit existing posts
- **Delete Post**: Remove posts from your blog

### Authentication
- **Login** (`/login`): Sign in to your dashboard
- **Sign Up** (`/login`): Create your account (if enabled in Supabase Auth settings)

## Security Features

1. **Row-Level Security (RLS):** Database policies ensure users can only see/edit their own posts
2. **Protected Routes:** Dashboard routes check authentication before allowing access
3. **Environment Variables:** Sensitive keys are never exposed to the browser
4. **Supabase Auth:** Industry-standard authentication with secure password handling

## Markdown Features

Supported Markdown syntax:
- **Headers:** `# H1`, `## H2`, `### H3`
- **Bold & Italic:** `**bold**`, `*italic*`
- **Lists:** `- item`, `1. numbered item`
- **Code:** Inline `` `code` `` and code blocks
- **Links:** `[text](url)`
- **Images:** `![alt](url)`
- **Tables:** Full GitHub Flavored Markdown table support
- **Blockquotes:** `> quoted text`

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Other Platforms
Make sure to:
1. Set environment variables in your deployment platform
2. Run `npm run build` before deploying
3. Set the start command to `npm start`

## Project Structure

```
blog-app/
├── app/
│   ├── page.tsx              # Home page (blog listing)
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── blog/
│   │   └── [slug]/page.tsx   # Individual blog post
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard layout with auth
│   │   ├── page.tsx          # Posts management
│   │   ├── new/page.tsx      # Create new post
│   │   └── edit/[id]/page.tsx # Edit post
│   └── login/page.tsx        # Login/signup page
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Troubleshooting

### Can't login
- Check that your Supabase project has Auth enabled
- Verify environment variables are correct
- Make sure your `.env.local` file exists and is not in `.gitignore`

### Posts not showing on homepage
- Make sure the `published` field is set to `true`
- Check that the blog_posts table exists and has data
- Verify Row Level Security policies are correctly set

### Markdown not rendering properly
- Check that `react-markdown` and `remark-gfm` are installed
- Make sure you're using the correct Markdown syntax

## License

MIT

## Contributing

This is a personal project, but feel free to fork and modify for your own use!

## Next Steps

1. **Customize the styling:** Modify Tailwind config and CSS to match your brand
2. **Add more features:** Comments, tags, search, social sharing
3. **Optimize images:** Add image optimization for blog posts
4. **Set up analytics:** Track blog views with Plausible or Umami
5. **Add email notifications:** Notify yourself when someone signs up

Enjoy your new blog! 🚀
