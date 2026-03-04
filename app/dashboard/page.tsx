'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Trash2, Edit2, Plus, MoreVertical, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

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
      setPosts((data as unknown as BlogPost[]) || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deletePost(id: string) {
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight italic">The Archives</h1>
          <p className="text-muted-foreground italic">Managing the collection of thoughts.</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="font-bold">
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-0"></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground italic">Consulting the records...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <p className="text-muted-foreground italic">The chronicles are currently empty.</p>
              <Link href="/dashboard/new">
                <Button variant="outline" className="font-bold">Start writing</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="w-[40%] font-bold uppercase tracking-widest text-[10px]">Title</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-[10px]">Tags</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-[10px]">Date</TableHead>
                  <TableHead className="text-right font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} className="border-border hover:bg-muted/30">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-bold text-foreground">
                          {post.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                          <Link href={`/blog/${post.slug}`} target="_blank" className="hover:text-primary flex items-center transition-colors">
                            /{post.slug} <ExternalLink className="ml-1 h-3 w-3 opacity-50" />
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.post_tags?.map(({ tags }) => (
                          <span
                            key={tags.name}
                            className="text-[9px] font-bold uppercase tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 rounded"
                          >
                            {tags.name}
                          </span>
                        ))}
                        {(!post.post_tags || post.post_tags.length === 0) && (
                          <span className="text-[10px] text-muted-foreground/50 italic">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                        post.published 
                          ? 'text-emerald-600 bg-emerald-500/10' 
                          : 'text-amber-600 bg-amber-500/10'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground font-bold whitespace-nowrap">
                      {new Date(post.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/edit/${post.id}`} className="flex items-center cursor-pointer font-bold text-xs uppercase tracking-widest">
                              <Edit2 className="mr-2 h-3 w-3" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-bold text-xs uppercase tracking-widest">
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="italic">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="font-serif">
                                  This will permanently remove "{post.title}" from the archives. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="font-bold text-xs uppercase tracking-widest">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-destructive hover:bg-destructive/90 font-bold text-xs uppercase tracking-widest">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
