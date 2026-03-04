'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase, searchPosts, getTags } from '@/lib/supabase'
import Search from '@/components/Search'
import TagList from '@/components/TagList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Davis' Corner</h1>
              <p className="mt-2 text-muted-foreground">Thoughts on development, design, and more</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <Search onSearch={handleSearch} />
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Popular Tags</p>
              <TagList tags={tags} />
            </div>
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-xl text-muted-foreground">No posts found</p>
            <Button variant="link" onClick={() => fetchPosts()}>Reset search</Button>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.post_tags?.map(({ tags }) => (
                      <Badge key={tags.name} variant="secondary">
                        {tags.name}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-3xl font-bold leading-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 line-clamp-3 text-lg">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <time className="text-sm text-muted-foreground font-medium uppercase tracking-tighter">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                  >
                    <Button variant="ghost" size="sm" className="font-semibold text-primary">
                      Read more →
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
