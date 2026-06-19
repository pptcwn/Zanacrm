import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('globals.css Theme Tokens', () => {
  it('defines custom glassmorphism and hud properties', () => {
    const cssPath = path.resolve(__dirname, '../globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    expect(cssContent).toContain('--hud-bg');
    expect(cssContent).toContain('--hud-blur');
    expect(cssContent).toContain('--hud-border');
  });
});
