'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, PlusSquare, LogOut } from 'lucide-react'

const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_USER_EMAIL

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push('/login')
          return
        }

        // Check if the user is the allowed user
        if (ALLOWED_EMAIL && session.user.email !== ALLOWED_EMAIL) {
          console.error('Unauthorized access attempt:', session.user.email)
          await supabase.auth.signOut()
          router.push('/login?error=Unauthorized')
          return
        }

        setUser(session.user)
        setLoading(false)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>Verifying session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col fixed inset-y-0">
        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </h2>
          <p className="text-xs text-muted-foreground mt-2 truncate" title={user?.email}>
            {user?.email}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <FileText className="h-4 w-4" />
            Posts
          </Link>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <PlusSquare className="h-4 w-4" />
            New Post
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
