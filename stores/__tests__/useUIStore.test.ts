import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../useUIStore'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ isSidebarOpen: true, unreadNotifications: 0 })
  })

  it('should initialize with sidebar open and 0 unread notifications', () => {
    const state = useUIStore.getState()
    expect(state.isSidebarOpen).toBe(true)
    expect(state.unreadNotifications).toBe(0)
  })

  it('should toggle sidebar', () => {
    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().isSidebarOpen).toBe(false)

    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().isSidebarOpen).toBe(true)
  })

  it('should set unread notifications count', () => {
    useUIStore.getState().setUnreadNotifications(5)
    expect(useUIStore.getState().unreadNotifications).toBe(5)
  })
})
