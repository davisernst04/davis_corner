'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-600 mt-2">Welcome, {user?.email}</p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            Posts
          </Link>
          <Link
            href="/dashboard/new"
            className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            New Post
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  )
}
