'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPostsByTag, getTags } from '@/lib/supabase'
import TagList from '@/components/TagList'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  created_at: string
  published: boolean
  post_tags: { tags: { name: string } }[]
}

export default function TaggedPosts({ params }: { params: { id: string } }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [tagName, setTagName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTags()
    fetchTaggedPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  async function fetchTags() {
    try {
      const data = await getTags()
      setTags(data || [])
      const currentTag = data?.find((t: any) => t.id === params.id)
      if (currentTag) setTagName(currentTag.name)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  async function fetchTaggedPosts() {
    setLoading(true)
    try {
      const data = await getPostsByTag(params.id)
      // data is from post_tags, each row has blog_posts
      const formattedPosts = data?.map((row: any) => ({
        ...row.blog_posts,
        // We need to fetch tags for each post too if we want to display them on the card
        // For simplicity, I'll just use the posts from the relation
      })).filter((p: any) => p.published) || []
      
      setPosts(formattedPosts)
    } catch (error) {
      console.error('Error fetching tagged posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← All Posts
          </Link>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Posts tagged with &quot;{tagName || '...'}&quot;
              </h1>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <p className="text-sm font-medium text-slate-500">Explore other tags</p>
              <TagList tags={tags} activeTagId={params.id} />
            </div>
          </div>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No posts found with this tag</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <time className="text-sm text-slate-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
