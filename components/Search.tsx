'use client'

import { useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'

interface SearchProps {
  onSearch: (query: string) => void
}

export default function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    onSearch(val)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search posts..."
        className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
      {query && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition"
        >
          <X className="h-5 w-5 text-slate-400" />
        </button>
      )}
    </div>
  )
}
