import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../auth.service'

const mockGetSession = vi.fn()
const mockGetUserProfile = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    auth: {
      getSession: () => mockGetSession(),
      signOut: vi.fn(),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => mockGetUserProfile(),
        }),
      }),
    }),
  }),
}))

describe('authService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('retrieves session correctly', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: { user: { id: '1' } } }, error: null })
    const session = await authService.getSession()
    expect(session).toEqual({ user: { id: '1' } })
  })

  it('returns null on profile loading failure', async () => {
    mockGetUserProfile.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })
    const profile = await authService.getUserProfile('1')
    expect(profile).toBeNull()
  })
})
