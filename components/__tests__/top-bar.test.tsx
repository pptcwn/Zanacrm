import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TopBar } from '../top-bar';

const replace = vi.fn();
const refresh = vi.fn();
const signOut = vi.fn();
const logout = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock('@/lib/services/auth.service', () => ({
  authService: {
    signOut: (...args: unknown[]) => signOut(...args),
  },
}));

vi.mock('@/lib/store/authStore', () => ({
  useAuthStore: () => ({
    profile: null,
    logout,
  }),
}));

describe('TopBar', () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    signOut.mockReset();
    logout.mockReset();
  });

  it('signs the user out and redirects to login', async () => {
    signOut.mockResolvedValue(undefined);

    render(<TopBar />);

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(logout).toHaveBeenCalledTimes(1);
      expect(replace).toHaveBeenCalledWith('/login');
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });
});
