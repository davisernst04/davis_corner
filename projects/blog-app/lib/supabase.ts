import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, created_at, published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export async function getPostsByTag(tagId: string) {
  const { data, error } = await supabase
    .from('post_tags')
    .select('*, blog_posts(*)')
    .eq('tag_id', tagId)

  if (error) throw error
  return data
}

export async function addTagToPost(postId: string, tagName: string) {
  // 1. Get or create tag
  let { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('id')
    .eq('name', tagName)
    .single()

  if (tagError && tagError.code !== 'PGRST116') {
    throw tagError
  }

  if (!tag) {
    const { data: newTag, error: createError } = await supabase
      .from('tags')
      .insert({ name: tagName })
      .select()
      .single()

    if (createError) throw createError
    tag = newTag
  }

  // 2. Link tag to post
  const { error: linkError } = await supabase
    .from('post_tags')
    .insert({ post_id: postId, tag_id: tag.id })

  if (linkError && linkError.code !== '23505') { // Ignore duplicate key errors
    throw linkError
  }
}

export async function removeTagFromPost(postId: string, tagId: string) {
  const { error } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId)
    .eq('tag_id', tagId)

  if (error) throw error
}
