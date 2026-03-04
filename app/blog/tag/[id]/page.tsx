'use client'

import * as React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPostsByTag, getTags } from '@/lib/supabase'
import TagList from '@/components/TagList'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ArrowLeft, Tag } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  created_at: string
  published: boolean
  post_tags: { tags: { name: string } }[]
}

export default function TaggedPosts({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [tagName, setTagName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTags()
    fetchTaggedPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchTags() {
    try {
      const data = await getTags()
      setTags(data || [])
      const currentTag = data?.find((t: any) => t.id === id)
      if (currentTag) setTagName(currentTag.name)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  async function fetchTaggedPosts() {
    setLoading(true)
    try {
      const data = await getPostsByTag(id)
      // data is from post_tags, each row has blog_posts
      const formattedPosts = data?.map((row: any) => ({
        ...row.blog_posts,
      })).filter((p: any) => p.published) || []
      
      setPosts(formattedPosts)
    } catch (error) {
      console.error('Error fetching tagged posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="-ml-2 font-bold text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground italic">
                Entries tagged: {tagName || '...'}
              </h1>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                Other topics
              </span>
              <TagList tags={tags} activeTagId={id} />
            </div>
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {loading ? (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32 space-y-4 italic">
            <p className="text-xl text-muted-foreground">No entries found for this tag.</p>
            <Link href="/" className="text-primary hover:underline underline-offset-4 font-bold">
              Return to all archives
            </Link>
          </div>
        ) : (
          <div className="space-y-20">
            {posts.map((post) => (
              <article key={post.id} className="group relative">
                <div className="space-y-4">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-muted-foreground leading-relaxed text-lg line-clamp-3 font-serif">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4">
                    <time className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold">
                      {new Date(post.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-bold text-primary hover:underline underline-offset-4 transition-all"
                    >
                      Continue reading →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20 py-12 bg-secondary/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground/40">
            © {new Date().getFullYear()} Davis' Corner
          </p>
        </div>
      </footer>
    </div>
  )
}
