'use client'

import * as React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPostsByTag, getTags } from '@/lib/supabase'
import TagList from '@/components/TagList'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Tag } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="-ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Posts
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Posts tagged with &quot;{tagName || '...'}&quot;
              </h1>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Explore other tags</p>
              <TagList tags={tags} activeTagId={id} />
            </div>
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid gap-6">
            {[1, 2].map((i) => (
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
            <p className="text-xl text-muted-foreground">No posts found with this tag</p>
            <Link href="/">
              <Button variant="link">Back to all posts</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold leading-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 line-clamp-2">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <time className="text-sm text-muted-foreground font-medium uppercase tracking-tighter">
                    {new Date(post.created_at).toLocaleDateString()}
                  </time>
                  <Link href={`/blog/${post.slug}`}>
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
