-- Create tags table
CREATE TABLE public.tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create post_tags junction table
CREATE TABLE public.post_tags (
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_post_tags_post_id ON public.post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON public.post_tags(tag_id);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can view tags
CREATE POLICY "Tags are viewable by everyone" 
ON public.tags FOR SELECT 
USING (true);

-- Authenticated users can insert tags
CREATE POLICY "Authenticated users can insert tags" 
ON public.tags FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Post tags are viewable by everyone
CREATE POLICY "Post tags are viewable by everyone" 
ON public.post_tags FOR SELECT 
USING (true);

-- Authenticated users can insert post tags
CREATE POLICY "Authenticated users can insert post tags" 
ON public.post_tags FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can delete post tags
CREATE POLICY "Authenticated users can delete post tags" 
ON public.post_tags FOR DELETE 
USING (auth.role() = 'authenticated');
