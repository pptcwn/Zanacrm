# Phase 1: Foundation Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the verification issues from the layout redesign, install core backend dependencies, and set up Supabase clients and Zustand stores for the Zanacrm Production Upgrade.

**Architecture:** We will first resolve technical debt (rogue tests, hardcoded colors, TS lint errors) to ensure a clean build. Then we install `@supabase/supabase-js`, `zustand`, etc. We will implement the browser and server Supabase clients following the new SSR auth flow, and set up basic Zustand stores (`useAuthStore`, `useUIStore`).

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, Supabase, Zustand.

## Global Constraints

- Never use hardcoded Tailwind color utilities directly inside components; always map components to semantic variables.
- Type safety 100%, no `as any` allowed. Define types explicitly in `types/` or use inline union types.

---

### Task 1: Pre-requisite Cleanup

**Files:**
- Modify: `vitest.config.ts`
- Modify: `components/top-bar.tsx`
- Modify: `app/(dashboard)/page.tsx`
- Modify: `app/chat/page.tsx`
- Modify: `app/finance/page.tsx`
- Modify: `app/orders/page.tsx`

**Interfaces:**
- Consumes: Existing components and config.
- Produces: Clean `npm run test` and `npm run lint` execution.

- [ ] **Step 1: Exclude rogue directory from tests**

Modify `vitest.config.ts` to add `exclude` to the `test` config:
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
    exclude: ['**/node_modules/**', '**/dist/**', '**/antigravity-auto-accept/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

- [ ] **Step 2: Fix hardcoded colors in TopBar**

Modify `components/top-bar.tsx` to replace `zinc` with semantic variables.
```tsx
// Inside components/top-bar.tsx
// Line 21:
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
// Line 27:
className="w-full bg-white/3 border border-transparent pl-9 pr-4 py-1.5 text-xs rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder-muted-foreground text-foreground"
// Line 42:
className="relative p-2 hover:bg-white/5 text-muted-foreground hover:text-foreground rounded-xl transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
```

- [ ] **Step 3: Fix lint errors in Dashboard**

Modify `app/(dashboard)/page.tsx`.
Remove unused import `PlatformBadge` at line 3.
Escape quotes in line 13:
```tsx
<p className="text-lg text-zinc-400 mt-2">Here&apos;s a clear overview of your multi-channel business today.</p>
```

- [ ] **Step 4: Fix `as any` casts in other pages**

Modify `app/chat/page.tsx`, line 51:
Change `platform={chat.channel.toLowerCase() as any}` to `platform={chat.channel.toLowerCase() as "tiktok" | "shopee" | "facebook" | "lazada"}`.

Modify `app/finance/page.tsx`, line 25:
Change `onClick={() => setActiveTab(tab.key as any)}` to `onClick={() => setActiveTab(tab.key as 'overview' | 'cost' | 'ad' | 'report')}`.

Modify `app/orders/page.tsx`, lines 45, 51, 56:
Change `platform={order.channel.toLowerCase() as any}` to `platform={order.channel.toLowerCase() as "tiktok" | "shopee" | "facebook" | "lazada"}` (lines 45, 51).
Change `status={order.status.toLowerCase() as any}` to `status={order.status.toLowerCase() as "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "paid" | "refunded"}` (line 56).

- [ ] **Step 5: Verify tests and lint**

Run: `npm run test`
Expected: PASS
Run: `npm run lint`
Expected: PASS with 0 errors.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts components/top-bar.tsx app/
git commit -m "fix: resolve lint and test errors from layout verification"
```

---

### Task 2: Install Foundation Dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: None
- Produces: Installed npm packages.

- [ ] **Step 1: Install packages**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr zustand swr zod
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: install supabase, zustand, swr, and zod"
```

---

### Task 3: Supabase Clients Setup

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `types/database.types.ts`

**Interfaces:**
- Consumes: Supabase credentials from `.env.local`
- Produces: Functions `createBrowserClient` and `createServerClient` for DB access.

- [ ] **Step 1: Create Database Types**

Create `types/database.types.ts`:
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'owner' | 'admin' | 'sales'
          avatar_url: string | null
        }
      }
    }
  }
}
```

- [ ] **Step 2: Create Browser Client**

Create `lib/supabase/client.ts`:
```typescript
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

export function createBrowserClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Create Server Client**

Create `lib/supabase/server.ts`:
```typescript
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add types/ lib/supabase/
git commit -m "feat: setup supabase browser and server clients"
```

---

### Task 4: Zustand Stores Setup

**Files:**
- Create: `stores/useAuthStore.ts`
- Create: `stores/useUIStore.ts`

**Interfaces:**
- Consumes: None
- Produces: Global client-side state hooks for Auth and UI.

- [ ] **Step 1: Create Auth Store**

Create `stores/useAuthStore.ts`:
```typescript
import { create } from 'zustand'

interface AuthState {
  user: { id: string; email: string; role: string } | null
  setUser: (user: { id: string; email: string; role: string } | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

- [ ] **Step 2: Create UI Store**

Create `stores/useUIStore.ts`:
```typescript
import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  unreadNotifications: number
  setUnreadNotifications: (count: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  unreadNotifications: 0,
  setUnreadNotifications: (count) => set({ unreadNotifications: count }),
}))
```

- [ ] **Step 3: Commit**

```bash
git add stores/
git commit -m "feat: setup zustand stores for auth and ui"
```
