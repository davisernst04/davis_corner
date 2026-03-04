import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

// Use a getter to ensure we capture environment variables at the right time
// and avoid returning null which causes "can't access property 'auth'" errors.
const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, Next.js might not have these variables.
    // We return a proxy that handles property access without crashing immediately,
    // but throws a clear error if actually used in the browser.
    if (typeof window !== 'undefined') {
      console.warn('Supabase variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing!')
    }
    
    return new Proxy({} as any, {
      get(_, prop) {
        if (prop === 'auth') {
          return new Proxy({} as any, {
            get(_, authProp) {
              return () => {
                throw new Error(`Supabase Auth method "${String(authProp)}" called but Supabase is not configured. Check your environment variables.`)
              }
            }
          })
        }
        return undefined
      }
    })
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabase()

export async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, created_at, published, post_tags(tags(name))')
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

export async function getPostTags(postId: string) {
  const { data, error } = await supabase
    .from('post_tags')
    .select('*, tags(*)')
    .eq('post_id', postId)

  if (error) throw error
  return (data as any[])?.map((pt: any) => pt.tags) || []
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
  if (!tag) throw new Error('Failed to get or create tag')
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
