'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

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
      <label className="block text-sm font-medium text-slate-900">
        Tags
      </label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              aria-label={`Remove ${tag}`}
              className="p-0.5 hover:bg-blue-200 rounded-full transition"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag..."
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-slate-500">Press Enter to add a tag</p>
    </div>
  )
}
