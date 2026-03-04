'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase, searchPosts } from '@/lib/supabase'
import Search from '@/components/Search'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, created_at, published, post_tags(tags(name))')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">My Blog</h1>
              <p className="mt-2 text-slate-600">Thoughts on development, design, and more</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition order-first sm:order-last"
            >
              Dashboard
            </Link>
          </div>
          
          <div className="mt-8">
            <Search onSearch={handleSearch} />
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
            <p className="text-slate-600">No posts found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.post_tags?.map(({ tags }) => (
                    <span key={tags.name} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                      {tags.name}
                    </span>
                  ))}
                </div>
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
