'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'

type UserRole = Database['public']['Enums']['user_role']

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackRoute?: string
}

export function RoleGuard({ children, allowedRoles, fallbackRoute = '/' }: RoleGuardProps) {
  const { profile, isInitialized } = useAuthStore()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    if (isInitialized) {
      if (profile && allowedRoles.includes(profile.role)) {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
        router.replace(fallbackRoute)
      }
    }
  }, [isInitialized, profile, allowedRoles, fallbackRoute, router])

  if (!isInitialized || isAuthorized === null) {
    return null // Return nothing while determining access, AuthProvider handles initial loading
  }

  if (isAuthorized === false) {
    return null // Will redirect
  }

  return <>{children}</>
}
