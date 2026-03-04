'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface TagInputProps {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export default function TagInput({ tags, onAddTag, onRemoveTag }: TagInputProps) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const tag = input.trim()
      if (tag && !tags.includes(tag)) {
        onAddTag(tag)
        setInput('')
      }
    }
  }

  return (
    <div className="space-y-3">
      <Label>Tags</Label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 pr-1.5"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              aria-label={`Remove ${tag}`}
              className="ml-1 hover:text-destructive transition-colors focus:outline-none"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>

      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag..."
      />
      <p className="text-xs text-muted-foreground">Press Enter to add a tag</p>
    </div>
  )
}
