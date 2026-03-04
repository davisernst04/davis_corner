'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Trash2, Edit2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  published: boolean
  created_at: string
  post_tags: { tags: { name: string } }[]
}

export default function Dashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, published, created_at, post_tags(tags(name))')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      setPosts(posts.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Your Posts</h1>
        <Link
          href="/dashboard/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">No posts yet</p>
          <Link
            href="/dashboard/new"
            className="text-blue-600 hover:text-blue-800"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{post.title}</p>
                    <p className="text-sm text-slate-600">{post.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.post_tags?.map(({ tags }) => (
                        <span
                          key={tags.name}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                        >
                          {tags.name}
                        </span>
                      ))}
                      {(!post.post_tags || post.post_tags.length === 0) && (
                        <span className="text-xs text-slate-400">No tags</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      href={`/dashboard/edit/${post.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
