import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppChrome } from '../app-chrome';

const mockUsePathname = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock('../sidebar', () => ({
  Sidebar: () => <nav>Sidebar</nav>,
}));

vi.mock('../top-bar', () => ({
  TopBar: () => <header>TopBar</header>,
}));

vi.mock('../mobile-bottom-nav', () => ({
  MobileBottomNav: () => <nav>MobileNav</nav>,
}));

describe('AppChrome', () => {
  it('hides dashboard chrome on the login page', () => {
    mockUsePathname.mockReturnValue('/login');

    render(<AppChrome><div>Login Content</div></AppChrome>);

    expect(screen.getByText('Login Content')).toBeInTheDocument();
    expect(screen.queryByText('Sidebar')).not.toBeInTheDocument();
    expect(screen.queryByText('TopBar')).not.toBeInTheDocument();
    expect(screen.queryByText('MobileNav')).not.toBeInTheDocument();
  });

  it('renders dashboard chrome on protected pages', () => {
    mockUsePathname.mockReturnValue('/orders');

    render(<AppChrome><div>Orders Content</div></AppChrome>);

    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('TopBar')).toBeInTheDocument();
    expect(screen.getByText('MobileNav')).toBeInTheDocument();
    expect(screen.getByText('Orders Content')).toBeInTheDocument();
  });
});
