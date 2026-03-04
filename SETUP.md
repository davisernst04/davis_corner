# Quick Setup Guide

## 5-Minute Setup

### Step 1: Get Supabase Credentials (2 minutes)
1. Go to https://supabase.com → Create new project
2. Wait for project to initialize
3. Go to Settings → API
4. Copy: `Project URL` and `Anon Public Key`

### Step 2: Set Up Database (1 minute)
1. In Supabase, go to SQL Editor
2. Copy and paste the entire SQL schema from `README.md` → "Create Database Schema" section
3. Click "Run"

### Step 3: Configure App (1 minute)
```bash
# Copy example env file
cp .env.local.example .env.local

# Edit .env.local and paste your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_url_here
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### Step 4: Install & Run (1 minute)
```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

---

## What You Now Have

✅ **Public Blog** (everyone can see)
- Home page listing all published posts
- Individual blog post pages with Markdown rendering

✅ **Admin Dashboard** (only you)
- `/login` - Sign up/sign in
- `/dashboard` - Manage all your posts
- `/dashboard/new` - Create posts with Markdown editor
- `/dashboard/edit/[id]` - Edit existing posts
- Delete posts with one click

✅ **Security**
- Only authenticated users can access dashboard
- Only you can see and edit your draft posts
- Published posts are visible to everyone

---

## Common Tasks

### Write a New Blog Post
1. Go to `/dashboard`
2. Click "New Post"
3. Fill in title, slug, excerpt
4. Write content in Markdown
5. Click "Preview" to see how it looks
6. Check "Publish immediately" if you want it live
7. Click "Create Post"

### Edit a Post
1. Go to `/dashboard`
2. Find your post in the list
3. Click "Edit"
4. Make changes
5. Click "Update Post"

### Publish a Draft
1. Go to `/dashboard`
2. Click "Edit" on the draft post
3. Check "Publish" checkbox
4. Click "Update Post"
5. Post now appears on home page

### Delete a Post
1. Go to `/dashboard`
2. Find your post
3. Click "Delete"
4. Confirm deletion

---

## Markdown Cheat Sheet

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*

- Bullet point
- Another point

1. Numbered item
2. Another item

[Link text](https://example.com)

![Image alt](https://example.com/image.jpg)

> Blockquote

`inline code`

\`\`\`
code block
\`\`\`

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

---

## Troubleshooting

**Issue:** Cannot log in
- Check email is correct
- Make sure you signed up first (use sign-up form)
- Check browser console for error messages

**Issue:** Posts not showing on home page
- Verify `published` checkbox is checked
- Refresh the page
- Check Supabase database directly to confirm data exists

**Issue:** Dashboard shows "not authenticated"
- Verify `.env.local` has correct Supabase keys
- Make sure you've signed up and logged in
- Check browser cookies are enabled

**Issue:** Markdown preview doesn't show
- Click "Preview" button to toggle preview mode
- Make sure Markdown syntax is correct

---

## Next Steps

1. **Customize branding:**
   - Edit `app/layout.tsx` → change "My Blog" title
   - Edit `app/page.tsx` → customize homepage text
   - Edit Tailwind colors in `tailwind.config.ts`

2. **Add more features:**
   - Categories/tags for posts
   - Search functionality
   - Comments (requires new Supabase table)
   - Social sharing buttons
   - Newsletter signup

3. **Deploy to production:**
   - Push to GitHub
   - Connect to Vercel
   - Set environment variables
   - Deploy!

---

## File Structure Explained

```
blog-app/
├── app/
│   ├── page.tsx           ← Home page (public)
│   ├── blog/[slug]/       ← Individual posts (public)
│   ├── dashboard/         ← Admin area (private)
│   │   ├── page.tsx       ← Post list
│   │   ├── new/           ← Create post
│   │   └── edit/[id]/     ← Edit post
│   ├── login/page.tsx     ← Auth page
│   └── globals.css        ← Styling
├── lib/
│   └── supabase.ts        ← Database connection
└── package.json           ← Dependencies
```

---

Need help? Check the `README.md` for more detailed information!
