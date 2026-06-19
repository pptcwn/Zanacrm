import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null })
  })

  it('should initialize with null user', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
  })

  it('should set the user', () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'admin' }
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('should clear the user', () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'admin' }
    useAuthStore.getState().setUser(mockUser)
    useAuthStore.getState().setUser(null)
    expect(useAuthStore.getState().user).toBeNull()
  })
})
