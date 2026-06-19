'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth.service'
import { loginSchema } from '@/lib/validations/auth.schema'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setFieldErrors({})

    try {
      const validatedData = loginSchema.parse({ email, password })
      const data = await authService.signIn(validatedData)
      
      if (data.user) {
        // AuthProvider will pick up the session change
        router.push('/')
      }
    } catch (err: any) {
      if (err instanceof z.ZodError || err.errors) {
        const errors: Record<string, string> = {}
        const zodErr = err as any
        zodErr.errors.forEach((e: any) => {
          if (e.path[0]) errors[e.path[0].toString()] = e.message
        })
        setFieldErrors(errors)
      } else {
        const message = err instanceof Error ? err.message : 'Failed to sign in'
        setErrorMsg(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-8 space-y-8 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">ZANA Order Management System</h1>
          <p className="text-sm text-zinc-400">Sign in to your account</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
          />

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-medium"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
