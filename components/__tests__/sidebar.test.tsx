import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../sidebar';
import { describe, it, expect } from 'vitest';

describe('Sidebar Component', () => {
  it('renders correct hierarchy and brand logo with glass HUD styling', () => {
    const { container } = render(<Sidebar />);
    expect(screen.getByText('ZANA')).toBeInTheDocument();
    expect(screen.getByText('managements')).toBeInTheDocument();
    expect(screen.getByText('Owner Dashboard')).toBeInTheDocument();
    
    // The HUD container wrapper must contain glassmorphism styling
    const hudContainer = container.querySelector('[style*="var(--hud-bg)"]');
    expect(hudContainer).toBeInTheDocument();
    
    const styleAttr = hudContainer?.getAttribute('style') || '';
    expect(styleAttr).toContain('backdrop-filter: var(--hud-blur)');
    expect(styleAttr).toContain('border-color: var(--hud-border)');
  });
});
