import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopBar } from '../top-bar';
import { describe, it, expect } from 'vitest';

describe('TopBar Component', () => {
  it('renders global search input and profile name with glass HUD styling', () => {
    const { container } = render(<TopBar />);
    expect(screen.getByPlaceholderText('Search orders, customers, products...')).toBeInTheDocument();
    expect(screen.getByText('Patchawin')).toBeInTheDocument();
    
    // The HUD container wrapper must contain glassmorphism styling
    const hudContainer = container.querySelector('[style*="var(--hud-bg)"]');
    expect(hudContainer).toBeInTheDocument();
    
    const styleAttr = hudContainer?.getAttribute('style') || '';
    expect(styleAttr).toContain('backdrop-filter: var(--hud-blur)');
    expect(styleAttr).toContain('border-color: var(--hud-border)');
  });
});
