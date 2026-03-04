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
