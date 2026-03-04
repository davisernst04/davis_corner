'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, addTagToPost } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TagInput from '@/components/TagInput'

export default function NewPost() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  const handleAddTag = (tag: string) => {
    setTags([...tags, tag])
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Auto-generate slug
    if (!slug || slug === title.toLowerCase().replace(/\s+/g, '-')) {
      setSlug(newTitle.toLowerCase().replace(/\s+/g, '-'))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data: post, error } = await supabase.from('blog_posts').insert({
        title,
        slug,
        excerpt,
        content,
        published,
        author_id: user.id,
      }).select().single()

      if (error) throw error

      // Add tags
      if (post && tags.length > 0) {
        await Promise.all(tags.map(tag => addTagToPost(post.id, tag)))
      }
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Post title"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-slug"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of the post"
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tag Input */}
        <TagInput
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />

        {/* Content Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-900">
              Content (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {!preview ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post in Markdown..."
              rows={20}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          ) : (
            <div className="border border-slate-300 rounded-lg p-6 bg-white prose prose-sm sm:prose max-w-none min-h-96">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Publish Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm font-medium text-slate-900">
            Publish immediately
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? 'Saving...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
