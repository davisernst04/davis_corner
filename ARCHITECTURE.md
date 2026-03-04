# Blog App Architecture

## Project Structure

```
blog-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Global styles and Markdown styles
│   ├── page.tsx                 # Public home page
│   │
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx         # Individual blog post page
│   │
│   ├── dashboard/               # Protected admin area
│   │   ├── layout.tsx           # Dashboard layout with auth check
│   │   ├── page.tsx             # Post management/listing
│   │   ├── new/
│   │   │   └── page.tsx         # Create new post with editor
│   │   └── edit/
│   │       └── [id]/page.tsx    # Edit existing post
│   │
│   └── login/
│       └── page.tsx             # Authentication (login/signup)
│
├── lib/
│   └── supabase.ts              # Supabase client initialization
│
├── Configuration Files
│   ├── package.json             # Dependencies and scripts
│   ├── next.config.js           # Next.js configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tailwind.config.ts       # Tailwind theme config
│   ├── postcss.config.js        # PostCSS config for Tailwind
│   └── .eslintrc.json           # ESLint configuration
│
└── Documentation
    ├── README.md                # Complete guide
    ├── SETUP.md                 # Quick start guide
    ├── PROJECT_SUMMARY.md       # Project overview
    └── ARCHITECTURE.md          # This file
```

## Data Flow

### Public Blog Flow
```
User visits /
    ↓
app/page.tsx (fetches published posts)
    ↓
Supabase query: SELECT * FROM blog_posts WHERE published=true
    ↓
Display posts on home page
    ↓
User clicks post title
    ↓
Navigate to /blog/[slug]
    ↓
app/blog/[slug]/page.tsx (fetches that specific post)
    ↓
Render Markdown as HTML
    ↓
User reads post
```

### Admin Dashboard Flow
```
User visits /login
    ↓
app/login/page.tsx
    ↓
User signs up/signs in
    ↓
Supabase Auth creates session
    ↓
User redirected to /dashboard
    ↓
app/dashboard/layout.tsx checks auth
    ↓
If authenticated → show dashboard layout
If not → redirect to /login
    ↓
User sees app/dashboard/page.tsx (post list)
    ↓
User can:
  - Click "New Post" → /dashboard/new
  - Click "Edit" on post → /dashboard/edit/[id]
  - Click "Delete" → removes from database
```

### Create Post Flow
```
User visits /dashboard/new
    ↓
app/dashboard/new/page.tsx (editor component)
    ↓
User fills in:
  - title
  - slug
  - excerpt
  - content (Markdown)
  - published (true/false)
    ↓
User clicks "Create Post"
    ↓
Form submits to Supabase
    ↓
INSERT INTO blog_posts VALUES (...)
    ↓
On success → redirect to /dashboard
On error → show error message
    ↓
Post appears in listing
If published=true → also visible on home page
```

## Component Architecture

### Page Components
- **app/page.tsx** - Fetches and displays published posts
- **app/blog/[slug]/page.tsx** - Fetches and displays single post with Markdown rendering
- **app/dashboard/page.tsx** - Lists all user's posts with edit/delete options
- **app/dashboard/new/page.tsx** - Editor for creating new posts
- **app/dashboard/edit/[id]/page.tsx** - Editor for modifying existing posts
- **app/login/page.tsx** - Authentication interface

### Layout Components
- **app/layout.tsx** - Root layout (header, styling)
- **app/dashboard/layout.tsx** - Dashboard layout (sidebar, auth check)

## Database Schema

### blog_posts Table
```
┌─────────────────────────────────────┐
│          blog_posts                 │
├─────────────────────────────────────┤
│ id (UUID) PRIMARY KEY               │
│ title (TEXT) NOT NULL               │
│ slug (TEXT) NOT NULL UNIQUE         │
│ excerpt (TEXT)                      │
│ content (TEXT) NOT NULL             │
│ author_id (UUID) FOREIGN KEY        │
│ published (BOOLEAN) DEFAULT false   │
│ created_at (TIMESTAMP)              │
│ updated_at (TIMESTAMP)              │
└─────────────────────────────────────┘

Indexes:
  - idx_blog_posts_author_id (author_id)
  - idx_blog_posts_published (published)
  - idx_blog_posts_slug (slug)

Row Level Security (RLS):
  - Public: SELECT published=true
  - Owner: SELECT/INSERT/UPDATE/DELETE on own posts
  - Others: Cannot access unpublished posts
```

## Authentication Flow

```
User not logged in
    ↓
Try to access /dashboard
    ↓
app/dashboard/layout.tsx → useEffect
    ↓
Check supabase.auth.getSession()
    ↓
If no session → router.push('/login')
If session exists → set user, continue
    ↓
User can now access dashboard
```

## File Dependencies

```
app/page.tsx
  └── lib/supabase.ts (fetch posts)
  └── Supabase (query published posts)

app/blog/[slug]/page.tsx
  └── lib/supabase.ts (fetch single post)
  └── Supabase (query by slug)
  └── react-markdown (render Markdown)

app/dashboard/layout.tsx
  └── lib/supabase.ts (check auth)
  └── Supabase (get session)

app/dashboard/page.tsx
  └── lib/supabase.ts (fetch user's posts)
  └── Supabase (query all user's posts)

app/dashboard/new/page.tsx
  └── lib/supabase.ts (create post)
  └── Supabase (INSERT new post)
  └── react-markdown (preview)

app/dashboard/edit/[id]/page.tsx
  └── lib/supabase.ts (fetch & update post)
  └── Supabase (SELECT and UPDATE)
  └── react-markdown (preview)

app/login/page.tsx
  └── lib/supabase.ts (auth)
  └── Supabase Auth (signUp, signInWithPassword, signOut)
```

## State Management

**Client State (React)**
- Form inputs in editor components
- Loading states during API calls
- Preview toggle in editor
- Published posts list

**Server State (Supabase)**
- User authentication session
- Blog posts data
- User information

**Caching**
- Next.js caches pages (ISR possible with revalidateTime)
- React Query not used (simple data, no complex caching needs)

## Styling Strategy

```
Tailwind CSS
    ↓
tailwind.config.ts (theme, colors, fonts)
    ↓
app/globals.css (global styles, prose styles for Markdown)
    ↓
Component-level classes (inline Tailwind classes)
    ↓
Rendered UI
```

## Security Layers

```
1. Supabase Auth
   └── Email/password authentication
   └── Session management
   └── JWT tokens

2. Row Level Security (RLS)
   └── Database-level access control
   └── Users can only see their own draft posts
   └── Published posts visible to all

3. Protected Routes
   └── Client-side auth check
   └── Redirects to /login if not authenticated

4. Environment Variables
   └── Secrets in .env.local (not in git)
   └── Public keys safe to expose (NEXT_PUBLIC_*)
```

## Performance Considerations

- **Server Components:** Used where possible for data fetching
- **Client Components:** Used only where interactivity needed
- **Image Optimization:** Images in Markdown rendered with <img> (can add next/image)
- **Code Splitting:** Automatic by Next.js
- **CSS-in-JS:** Tailwind (no runtime overhead)

## Error Handling

- Try/catch blocks in async functions
- User-friendly error messages
- Console logging for debugging
- Redirect on auth failure
- Form validation in components

## Deployment Checklist

- [ ] Get Supabase keys
- [ ] Run SQL schema
- [ ] Set environment variables
- [ ] Test locally with `npm run dev`
- [ ] Build with `npm run build`
- [ ] Deploy to Vercel/other platform
- [ ] Set environment variables on platform
- [ ] Test deployed site
- [ ] Create first blog post

---

This architecture is designed to be:
✅ Simple and maintainable
✅ Secure at multiple levels
✅ Fast and responsive
✅ Easy to extend
✅ Production-ready
