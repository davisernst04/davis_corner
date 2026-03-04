'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase, searchPosts, getTags } from '@/lib/supabase'
import Search from '@/components/Search'
import TagList from '@/components/TagList'
import { ThemeToggle } from '@/components/ThemeToggle'
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

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
    fetchTags()
  }, [])

  async function fetchTags() {
    try {
      const data = await getTags()
      setTags(data || [])
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  async function fetchPosts() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, created_at, published, post_tags(tags(name))')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts((data as unknown as BlogPost[]) || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchPosts()
      return
    }

    setLoading(true)
    try {
      const data = await searchPosts(query)
      setPosts(data as any || [])
    } catch (error) {
      console.error('Error searching posts:', error)
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
            <Link href="/" className="group">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors italic">
                Davis' Corner
              </h1>
              <p className="mt-1 text-sm md:text-base text-muted-foreground font-serif italic">
                Musings on life, code, and everything in between.
              </p>
            </Link>
            <ThemeToggle />
          </div>
          
          <div className="space-y-6">
            <Search onSearch={handleSearch} />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                Topics of interest
              </span>
              <TagList tags={tags} />
            </div>
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32 space-y-4 italic">
            <p className="text-xl text-muted-foreground">The archives are empty...</p>
            <button 
              onClick={() => fetchPosts()}
              className="text-primary hover:underline underline-offset-4 font-bold"
            >
              Refresh collection
            </button>
          </div>
        ) : (
          <div className="space-y-20">
            {posts.map((post) => (
              <article key={post.id} className="group relative">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {post.post_tags?.map(({ tags }) => (
                      <span key={tags.name} className="text-[10px] uppercase tracking-widest font-bold text-primary/70">
                        {tags.name}
                      </span>
                    ))}
                  </div>
                  
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
