'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

function LoginContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'Unauthorized') {
      setError('Access denied. Only the administrator account can sign in.')
      setLoading(false)
    } else if (errorParam) {
      setError(errorParam)
      setLoading(false)
    } else {
      // Automatically trigger GitHub Login
      handleGithubLogin()
    }
  }, [searchParams])

  async function handleGithubLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 max-w-md w-full p-8 bg-card rounded-2xl border border-border shadow-2xl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold italic text-primary">Davis' Corner</h1>
        <p className="text-muted-foreground font-serif">Gatekeeping the dashboard...</p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground animate-pulse">
            Authenticating with GitHub
          </p>
        </div>
      )}
      
      <button 
        onClick={() => window.location.href = '/'}
        className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
      >
        ← Abandon mission
      </button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <LoginContent />
    </div>
  )
}
