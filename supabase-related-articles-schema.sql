-- Create related_articles table for linking blog posts
CREATE TABLE IF NOT EXISTS related_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  related_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blog_post_id, related_post_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_related_articles_blog_post_id ON related_articles(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_related_articles_display_order ON related_articles(blog_post_id, display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE related_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on related articles"
  ON related_articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE blog_posts.id = related_articles.blog_post_id 
      AND blog_posts.published = true 
      AND blog_posts.published_at IS NOT NULL
    )
    AND EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE blog_posts.id = related_articles.related_post_id 
      AND blog_posts.published = true 
      AND blog_posts.published_at IS NOT NULL
    )
  );

-- Create policies for authenticated users (admin access)
CREATE POLICY "Allow authenticated insert on related_articles"
  ON related_articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on related_articles"
  ON related_articles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on related_articles"
  ON related_articles FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read on all related_articles"
  ON related_articles FOR SELECT
  USING (auth.role() = 'authenticated');
