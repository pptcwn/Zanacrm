'use client'

import { useEffect } from 'react'
import { authService } from '@/lib/services/auth.service'
import { useAuthStore } from '@/lib/store/authStore'
import { usePathname, useRouter } from 'next/navigation'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading, setInitialized, isInitialized } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let mounted = true
    let initialFired = false

    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        if (!mounted) return
        
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' })
          
          // Unlock the UI immediately before fetching profile
          if (!initialFired) {
            initialFired = true
            setLoading(false)
            setInitialized(true)
          }

          // Fetch profile in background completely detached from the callback
          setTimeout(() => {
            if (!mounted) return;
            authService.getUserProfile(session.user.id)
              .then(profile => {
                if (mounted) setProfile(profile)
              })
              .catch(err => console.error('Failed to fetch profile:', err));
          }, 0);
        } else {
          setUser(null)
          setProfile(null)
          
          if (!initialFired) {
            initialFired = true
            setLoading(false)
            setInitialized(true)
          }

          if (pathname !== '/login') {
            router.push('/login')
          }
        }
      }
    )

    // Fallback timeout in case INITIAL_SESSION event never fires
    const timeoutId = setTimeout(() => {
      if (mounted && !initialFired) {
        console.warn('Auth initialization timed out. Forcing UI unlock.');
        initialFired = true;
        setLoading(false);
        setInitialized(true);
      }
    }, 2000);

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [router, pathname, setUser, setProfile, setLoading, setInitialized])

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-zinc-500 text-sm font-medium">Initializing OMS...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
