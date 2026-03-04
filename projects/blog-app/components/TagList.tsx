'use client'

import Link from 'next/link'

interface Tag {
  id: string
  name: string
}

interface TagListProps {
  tags: Tag[]
  activeTagId?: string
}

export default function TagList({ tags, activeTagId }: TagListProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/blog/tag/${tag.id}`}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            activeTagId === tag.id
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}
