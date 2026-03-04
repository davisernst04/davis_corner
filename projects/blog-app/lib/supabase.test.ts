import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchPosts, getTags, getPostsByTag, addTagToPost, removeTagFromPost } from './supabase'

// Mock supabase
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createBrowserClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  })),
}))

import { supabase } from './supabase'

describe('Supabase API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('searchPosts', () => {
    it('should search posts by query', async () => {
      const mockPosts = [{ id: '1', title: 'Test Post' }]
      const eqMock = vi.fn().mockReturnThis()
      const orderMock = vi.fn().mockResolvedValue({ data: mockPosts, error: null })
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: eqMock,
        order: orderMock,
      } as any)

      const results = await searchPosts('test')

      expect(supabase.from).toHaveBeenCalledWith('blog_posts')
      expect(eqMock).toHaveBeenCalledWith('published', true)
      expect(results).toEqual(mockPosts)
    })
  })

  describe('getTags', () => {
    it('should fetch all tags', async () => {
      const mockTags = [{ id: '1', name: 'React' }]
      const orderMock = vi.fn().mockResolvedValue({ data: mockTags, error: null })
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: orderMock,
      } as any)

      const results = await getTags()

      expect(supabase.from).toHaveBeenCalledWith('tags')
      expect(results).toEqual(mockTags)
    })
  })

  describe('getPostsByTag', () => {
    it('should fetch posts by tag id', async () => {
      const mockPosts = [{ post_id: '1', blog_posts: { id: '1', title: 'Test' } }]
      const eqMock = vi.fn().mockResolvedValue({ data: mockPosts, error: null })
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: eqMock,
      } as any)

      const results = await getPostsByTag('tag-1')

      expect(supabase.from).toHaveBeenCalledWith('post_tags')
      expect(eqMock).toHaveBeenCalledWith('tag_id', 'tag-1')
      expect(results).toEqual(mockPosts)
    })
  })

  describe('addTagToPost', () => {
    it('should add a tag to a post', async () => {
      const mockTag = { id: 'tag-1', name: 'React' }
      const singleMock = vi.fn().mockResolvedValue({ data: mockTag, error: null })
      const insertMock = vi.fn().mockResolvedValue({ error: null })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'tags') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: singleMock,
            insert: vi.fn().mockReturnThis(),
            select2: vi.fn().mockReturnThis(), // simulated
          } as any
        }
        return {
          insert: insertMock,
        } as any
      })

      await addTagToPost('post-1', 'React')

      expect(supabase.from).toHaveBeenCalledWith('tags')
      expect(supabase.from).toHaveBeenCalledWith('post_tags')
    })
  })

  describe('removeTagFromPost', () => {
    it('should remove a tag from a post', async () => {
      const deleteMock = vi.fn().mockResolvedValue({ error: null })
      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        delete2: deleteMock, // simulated final call
      } as any)

      await removeTagFromPost('post-1', 'tag-1')

      expect(supabase.from).toHaveBeenCalledWith('post_tags')
    })
  })
})
