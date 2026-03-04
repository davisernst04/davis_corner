'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

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
        <Link key={tag.id} href={`/blog/tag/${tag.id}`}>
          <Badge
            variant={activeTagId === tag.id ? 'default' : 'secondary'}
            className="cursor-pointer hover:bg-primary/90 transition-colors"
          >
            {tag.name}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
