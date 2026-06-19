# Global Layout & Themes Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the overall OMS layout (Sidebar, TopBar, and Main Layout wrappers) and CSS theme variables to implement floating translucent HUD panels, extreme typography hierarchy, and minimal dividers.

**Architecture:** Use CSS custom properties in `globals.css` to define the layout tokens, border treatments, and glassmorphic blurs. Implement Sidebar and TopBar as floating translucent glass columns and bars, utilizing responsive flex/grid layouts without hardcoded styles.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, Lucide React, Vitest, React Testing Library.

## Global Constraints

- Never use hardcoded Tailwind color utilities (e.g., `bg-zinc-950` or `border-zinc-800`) directly inside components; always map components to semantic variables (e.g., `bg-card`, `border-border`, `bg-primary`, `bg-background`).
- Ensure all interactive elements (buttons, links, search fields) have visible focus rings (`focus-visible:ring-2 focus-visible:ring-ring`).
- Maintain WCAG contrast standards for active and hover states in dark mode (minimum 4.5:1 ratio).
- Ensure mobile layout remains unbroken by checking layout bounds down to 375px.

---

### Task 1: Test Environment Setup

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `components/__tests__/setup.ts`

**Interfaces:**
- Consumes: None
- Produces: Command line test runners for Vitest and React Testing Library

- [ ] **Step 1: Write test dependency installation script**

Execute:
```bash
npm install -D vitest @testing-library/react @testing-library/dom jsdom @testing-library/jest-dom @vitejs/plugin-react
```

- [ ] **Step 2: Create Vitest config file**

Create `vitest.config.ts` with exact contents:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./components/__tests__/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

- [ ] **Step 3: Create tests setup file**

Create `components/__tests__/setup.ts` with exact contents:
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 4: Add test scripts to package.json**

Modify `package.json` to insert `"test": "vitest run"` under scripts:
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  }
```

- [ ] **Step 5: Run tests command to verify configuration works**

Run: `npm run test`
Expected: Succeeds with "No test files found" (exit code 0 or message).

- [ ] **Step 6: Commit test setup changes**

Run:
```bash
git add package.json vitest.config.ts components/__tests__/setup.ts
git commit -m "chore: setup Vitest and React Testing Library environment"
```

---

### Task 2: Redesign Theme Tokens in globals.css

**Files:**
- Modify: `app/globals.css`
- Test: `app/__tests__/theme.test.ts`

**Interfaces:**
- Consumes: Testing library environment.
- Produces: CSS layout variables (`--hud-blur`, `--hud-bg`, `--hud-border`, `--shadow-hud`) in `globals.css` and custom fonts settings.

- [ ] **Step 1: Write failing theme token test**

Create `app/__tests__/theme.test.ts` with contents:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL due to missing variables in `globals.css`.

- [ ] **Step 3: Implement new OKLCH theme variables**

Modify `app/globals.css` to add the variables to `:root`:
```css
  /* === Premium Glass HUD Tokens === */
  --hud-bg: oklch(0.145 0 0 / 0.65); /* Translucent near-black background */
  --hud-blur: blur(16px);
  --hud-border: oklch(1 0 0 / 0.08); /* Translucent hairline border */
  --hud-border-glow: oklch(0.62 0.19 256 / 0.15); /* Primary glow border */
  --shadow-hud: 0 8px 32px 0 oklch(0 0 0 / 0.4);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit CSS changes**

Run:
```bash
git add app/globals.css app/__tests__/theme.test.ts
git commit -m "style: define Premium Glass HUD design tokens in globals.css"
```

---

### Task 3: Redesign Sidebar to Floating Translucent HUD

**Files:**
- Modify: `components/sidebar.tsx`
- Test: `components/__tests__/sidebar.test.tsx`

**Interfaces:**
- Consumes: CSS theme tokens in `globals.css`.
- Produces: `<Sidebar />` component with floating margin, glassmorphism, and minimal dividers.

- [ ] **Step 1: Write test for Sidebar rendering and layout attributes**

Create `components/__tests__/sidebar.test.tsx` with contents:
```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../sidebar';
import { describe, it, expect, vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Sidebar Component', () => {
  it('renders correct hierarchy and brand logo', () => {
    render(<Sidebar />);
    expect(screen.getByText('OMS')).toBeInTheDocument();
    expect(screen.getByText('Owner Dashboard')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL if Sidebar does not match imports or test setup.

- [ ] **Step 3: Redesign Sidebar component structure**

Modify `components/sidebar.tsx` to implement floating columns with translucent styles:
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Package, MessageCircle,
  CheckSquare, Truck, DollarSign, Users, BarChart3, Shield,
  TrendingUp,
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { href: '/', label: 'Owner Dashboard', icon: LayoutDashboard },
      { href: '/admin', label: 'Admin', icon: Shield },
      { href: '/sales', label: 'Sales', icon: TrendingUp },
    ],
  },
  {
    title: 'Operations',
    items: [
      { href: '/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/chat', label: 'Unified Chat', icon: MessageCircle },
      { href: '/tasks', label: 'Task Board', icon: CheckSquare },
      { href: '/inventory', label: 'Inventory', icon: Package },
      { href: '/shipping', label: 'Shipping', icon: Truck },
    ],
  },
  {
    title: 'Growth',
    items: [
      { href: '/commission', label: 'Commission', icon: DollarSign },
      { href: '/customers', label: 'Customers', icon: Users },
      { href: '/finance', label: 'Finance', icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-66 shrink-0 flex-col p-4 bg-background">
      {/* Floating HUD Container */}
      <div 
        style={{
          backgroundColor: 'var(--hud-bg)',
          backdropFilter: 'var(--hud-blur)',
          borderColor: 'var(--hud-border)',
          boxShadow: 'var(--shadow-hud)',
        }}
        className="flex-1 flex flex-col rounded-2xl border transition-all duration-300"
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-[var(--hud-border)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold tracking-tight">O</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-[-0.02em]">OMS</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.05em]">Omni Channel</div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isActive
                          ? 'bg-primary/8 text-primary font-semibold border border-primary/20 shadow-sm shadow-primary/5'
                          : 'text-muted-foreground hover:bg-white/3 hover:text-foreground border border-transparent'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile section */}
        <div className="border-t border-[var(--hud-border)] p-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/3 px-3 py-2 border border-white/3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              PN
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold">Patchawin</div>
              <div className="flex items-center gap-1 text-[9px] text-success/90 font-medium">
                <span className="h-1 w-1 rounded-full bg-success" />
                Owner
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit Sidebar changes**

Run:
```bash
git add components/sidebar.tsx components/__tests__/sidebar.test.tsx
git commit -m "feat: redesign Sidebar to be a floating translucent glass HUD"
```

---

### Task 4: Redesign TopBar to Floating Glass HUD

**Files:**
- Modify: `components/top-bar.tsx`
- Test: `components/__tests__/top-bar.test.tsx`

**Interfaces:**
- Consumes: CSS theme tokens in `globals.css`.
- Produces: `<TopBar />` component with floating translucent styling, clean border blurs, and layout updates.

- [ ] **Step 1: Write test for TopBar rendering**

Create `components/__tests__/top-bar.test.tsx` with contents:
```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopBar } from '../top-bar';
import { describe, it, expect } from 'vitest';

describe('TopBar Component', () => {
  it('renders global search input and profile name', () => {
    render(<TopBar />);
    expect(screen.getByPlaceholderText('Search orders, customers, products...')).toBeInTheDocument();
    expect(screen.getByText('Patchawin')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL if TopBar does not match imports or test setup.

- [ ] **Step 3: Redesign TopBar layout and class elements**

Modify `components/top-bar.tsx` to align with the Floating Glass HUD theme:
```typescript
'use client';

import { Search, Bell, Plus } from 'lucide-react';

export function TopBar() {
  return (
    <header className="px-4 pt-4 pb-2 bg-background shrink-0">
      {/* Floating HUD Glass container */}
      <div 
        style={{
          backgroundColor: 'var(--hud-bg)',
          backdropFilter: 'var(--hud-blur)',
          borderColor: 'var(--hud-border)',
          boxShadow: 'var(--shadow-hud)',
        }}
        className="h-14 rounded-2xl border flex items-center px-4 justify-between transition-all"
      >
        <div className="flex items-center gap-4 flex-1 max-w-sm">
          <div className="relative w-full">
            <label htmlFor="global-search" className="sr-only">Search orders, customers, or products</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" aria-hidden="true" />
            <input
              id="global-search"
              type="text"
              placeholder="Search orders, customers, products..."
              aria-label="Search orders, customers, or products"
              className="w-full bg-white/3 border border-transparent pl-9 pr-4 py-1.5 text-xs rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder-zinc-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Add with minimal accent style */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-sm shadow-primary/10">
            <Plus className="w-3.5 h-3.5" />
            Quick Add
          </button>

          {/* Translucent Notifications */}
          <button 
            aria-label="View notifications" 
            className="relative p-2 hover:bg-white/5 text-zinc-400 hover:text-foreground rounded-xl transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full" aria-hidden="true" />
            <span className="sr-only">3 unread notifications</span>
          </button>

          {/* Profile Details */}
          <div className="flex items-center gap-2 pl-3 border-l border-[var(--hud-border)]">
            <div className="text-right text-xs leading-tight">
              <div className="font-semibold">Patchawin</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Owner</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit TopBar changes**

Run:
```bash
git add components/top-bar.tsx components/__tests__/top-bar.test.tsx
git commit -m "feat: redesign TopBar to be a floating translucent glass HUD"
```

---

### Task 5: Verify Layout Fit & Build Compilation

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css` (minor adjustments if needed)

**Interfaces:**
- Consumes: Redesigned Sidebar, redesigned TopBar, layout variables.
- Produces: Fully integrated application frame passing build check.

- [ ] **Step 1: Check components import in RootLayout**

Verify that `app/layout.tsx` correctly imports redesigned `Sidebar` and `TopBar` components.

- [ ] **Step 2: Run linter checks**

Run: `npm run lint`
Expected: SUCCESS with zero linting errors.

- [ ] **Step 3: Run production build compilation**

Run: `npm run build`
Expected: Build succeeds with Next.js compiled pages output and zero errors.

- [ ] **Step 4: Commit overall layout integrations**

Run:
```bash
git add app/layout.tsx
git commit -m "chore: verify overall layout compile successfully"
```
