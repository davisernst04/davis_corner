'use client'

import * as React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  content: string
  created_at: string
  author_id: string
}

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single()

        if (error) throw error
        setPost(data)
      } catch (err) {
        setError('Post not found')
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground italic font-serif">Unrolling the parchment...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-6 py-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Archives
              </Button>
            </Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-24 text-center space-y-4">
          <h1 className="text-3xl font-bold italic">{error || 'Post not found'}</h1>
          <p className="text-muted-foreground font-serif">The requested entry has been lost to time or never existed.</p>
          <Link href="/">
            <Button className="font-bold">Return to Blog</Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="-ml-2 font-bold text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center border-b border-border/50">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight italic">
            {post.title}
          </h1>
          <div className="flex items-center justify-center text-muted-foreground gap-3 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Calendar className="h-3 w-3" />
            <time>
              {new Date(post.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="prose prose-earth dark:prose-invert max-w-none font-serif">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </main>

      <footer className="max-w-3xl mx-auto px-6 mt-20 text-center">
        <div className="border-t border-border pt-12">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground/40">
            End of entry
          </p>
        </div>
      </footer>
    </div>
  )
}
