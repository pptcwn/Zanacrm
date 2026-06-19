# Unified Chat Advanced Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement AI-assisted replies, dynamic database quick reply templates, real-time inbox list syncing, and stock-aware CRM quick order creation with backorder capability.

**Architecture:** Database migrations to create `quick_reply_templates`, subscribing to Supabase `conversations` real-time channels, integrating `products` store selectors, client-side sentiment heuristics, and product stock adjustments on order insertion.

**Tech Stack:** Next.js, Supabase JS Client, PostgreSQL, Tailwind CSS, Lucide icons, Zustand store, Vitest.

---

## Proposed Tasks

### Task 1: SQL Migration for Quick Reply Templates & Seeding

**Files:**
- Create: `supabase/migrations/20260620000001_chat_advanced_features.sql`

**Interfaces:**
- Consumes: None
- Produces: `quick_reply_templates` table in Supabase.

- [ ] **Step 1: Write SQL migration script**
  Create `supabase/migrations/20260620000001_chat_advanced_features.sql` with:
  ```sql
  -- Create quick_reply_templates table
  CREATE TABLE IF NOT EXISTS public.quick_reply_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    shortcut text UNIQUE NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE public.quick_reply_templates ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Allow authenticated users to read templates"
    ON public.quick_reply_templates FOR SELECT
    TO authenticated
    USING (true);

  -- Seed templates
  INSERT INTO public.quick_reply_templates (shortcut, title, content) VALUES
  ('address', 'ขอที่อยู่จัดส่ง', 'สวัสดีค่ะคุณ {customer_name} รบกวนแจ้งชื่อ ที่อยู่ และเบอร์โทรศัพท์สำหรับจัดส่งสินค้าด้วยนะคะ ขอบคุณค่ะ'),
  ('promo', 'โปรโมชั่นลูกค้าประจำ', 'โปรโมชั่นพิเศษสำหรับลูกค้าระดับ {customer_segment}! รับส่วนลดค่าจัดส่งฟรีและลดเพิ่ม 10% เมื่อซื้อยอดรวมครบ 1,000 บาทค่ะ'),
  ('order_confirm', 'ยืนยันออเดอร์', 'ยืนยันการสั่งซื้อสำเร็จค่ะคุณ {customer_name} ออเดอร์หมายเลข {order_number} ยอดรวมชำระ {total_amount} บาท อยู่ระหว่างการจัดเตรียมค่ะ')
  ON CONFLICT (shortcut) DO UPDATE 
  SET title = EXCLUDED.title, content = EXCLUDED.content;
  ```

- [ ] **Step 2: Run SQL migration**
  Apply migration to local Supabase database or run it on the remote instance.
  Command: Use Supabase MCP tool `apply_migration` or run:
  `supabase migration up` (or apply sql through `execute_sql` tool).

- [ ] **Step 3: Verify table structure in PostgreSQL**
  Run SQL:
  `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'quick_reply_templates';`
  Expected Output: Columns `id`, `shortcut`, `title`, `content`, `created_at` with appropriate types.

---

### Task 2: Service API & Store Integration for Quick Reply Templates

**Files:**
- Modify: `types/database.types.ts`
- Create: `lib/services/quick-reply.service.ts`
- Create: `lib/services/__tests__/quick-reply.service.test.ts`
- Modify: `lib/store/chatStore.ts`

**Interfaces:**
- Consumes: `quick_reply_templates` table
- Produces: `quickReplyService.getAll()`, `useChatStore.templates`, `useChatStore.fetchTemplates()`

- [ ] **Step 1: Update Database types**
  Add `quick_reply_templates` types into `types/database.types.ts` public tables interface:
  ```typescript
  quick_reply_templates: {
    Row: {
      id: string;
      shortcut: string;
      title: string;
      content: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      shortcut: string;
      title: string;
      content: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      shortcut?: string;
      title?: string;
      content?: string;
      created_at?: string;
    };
  }
  ```

- [ ] **Step 2: Create Service file**
  Create `lib/services/quick-reply.service.ts` with:
  ```typescript
  import { createBrowserClient } from '@/lib/supabase/client';
  import { Database } from '@/types/database.types';

  type TemplateRow = Database['public']['Tables']['quick_reply_templates']['Row'];

  let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
  function getSupabaseClient() {
    if (!supabaseClient) supabaseClient = createBrowserClient();
    return supabaseClient;
  }

  export const quickReplyService = {
    async getAll(): Promise<TemplateRow[]> {
      const { data, error } = await getSupabaseClient()
        .from('quick_reply_templates')
        .select('*')
        .order('shortcut', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  };
  ```

- [ ] **Step 3: Add Vitest unit test for service**
  Create `lib/services/__tests__/quick-reply.service.test.ts` validating that fetching templates returns seeded rows correctly.

- [ ] **Step 4: Update Zustand Chat store**
  Modify `lib/store/chatStore.ts` to include:
  * State: `templates: TemplateRow[]`
  * Action: `fetchTemplates: () => Promise<void>`
  ```typescript
  // Inside ChatState interface:
  templates: any[];
  fetchTemplates: () => Promise<void>;

  // Inside useChatStore creator:
  templates: [],
  fetchTemplates: async () => {
    try {
      const data = await quickReplyService.getAll();
      set({ templates: data });
    } catch (err: any) {
      console.error(err);
    }
  }
  ```

- [ ] **Step 5: Run tests and verify**
  Run: `npx vitest run lib/services/__tests__/quick-reply.service.test.ts`
  Expected: PASS

---

### Task 3: Real-time Conversations List Synchronization

**Files:**
- Modify: `lib/store/chatStore.ts`

**Interfaces:**
- Consumes: Supabase Conversations table changes
- Produces: Real-time update and sorting in Zustand store

- [ ] **Step 1: Update real-time subscription logic in chatStore.ts**
  In `lib/store/chatStore.ts` modify `subscribeToMessages` to also subscribe to updates in the `conversations` table:
  ```typescript
  // Inside subscribeToMessages:
  const conversationsChannel = supabase
    .channel('conversations-realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'conversations' },
      (payload) => {
        set((state) => {
          const updatedConversations = state.conversations.map((c) =>
            c.id === payload.new.id ? { ...c, ...payload.new } : c
          );
          // Sort conversations by updated_at descending
          updatedConversations.sort((a, b) => {
            const dateA = new Date(a.updated_at || 0).getTime();
            const dateB = new Date(b.updated_at || 0).getTime();
            return dateB - dateA;
          });
          return { conversations: updatedConversations };
        });
      }
    )
    .subscribe();
  ```

- [ ] **Step 2: Add unsubscribe logic**
  Ensure the unsubscribe function in `chatStore.ts` removes the conversations channel subscription.

---

### Task 4: AI Assisted Replies & Sentiment Heuristics UI

**Files:**
- Modify: `app/chat/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: Active customer message content, parameters
- Produces: AI suggestion trigger popup, Sentiment badge rendering, dynamic placeholder insertion

- [ ] **Step 1: Write sentiment scoring function**
  In `app/chat/page.tsx`, create helper function `getSentiment`:
  ```typescript
  const getSentiment = (lastMessage: string) => {
    const text = lastMessage.toLowerCase();
    const negativeWords = ['ช้า', 'ยกเลิก', 'คืนเงิน', 'โมโห', 'ชำรุด', 'พัง', 'แย่', 'ไม่ดี'];
    const positiveWords = ['ขอบคุณ', 'ชอบ', 'ดี', 'ส่งไว', 'แนะนำ', 'ประทับใจ', 'รัก'];
    
    if (negativeWords.some(w => text.includes(w))) return { label: 'Urgent', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (positiveWords.some(w => text.includes(w))) return { label: 'Positive', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    return { label: 'Neutral', color: 'bg-zinc-800 text-zinc-400 border-zinc-700/50' };
  };
  ```

- [ ] **Step 2: Integrate Sentiment Badge on Chat Cards & CRM**
  Render the badge on conversation cards next to the customer's name, and at the top of the CRM customer overview panel.

- [ ] **Step 3: Implement AI suggested reply popover**
  Add a `✨` (Sparkles) button next to the Send button in Column 2. Clicking it toggles a popover listing:
  1) `✨ AI Draft: Greeting & Up-sell`
  2) `✨ AI Draft: Shipping Delay & Apology`
  3) `✨ AI Draft: Quick Order Pitch`
  When clicked, generate a context-aware string substituting customer metrics (e.g. name, LTV) and set input textarea content.

- [ ] **Step 4: Resolve Dynamic Placeholders on `/` templates**
  In `handleInputChange` and `handleSelectSuggestion`, fetch database templates from `useChatStore.templates`.
  When a template is selected, replace variables:
  * `{customer_name}` ➡️ `customerName`
  * `{customer_segment}` ➡️ `customerSegment`
  * `{order_number}` ➡️ `customerOrders[0]?.order_number || 'ORD-3050'` (latest order)
  * `{total_amount}` ➡️ `customerOrders[0]?.total_amount || '640'`

---

### Task 5: CRM Order-Inventory Linkage & Stock Control

**Files:**
- Modify: `app/chat/page.tsx`
- Modify: `lib/store/chatStore.ts`

**Interfaces:**
- Consumes: `useProductStore.products`, stock levels
- Produces: Dynamic product select, stock level indicators, shipping cost calculation, Backorder state rules

- [ ] **Step 1: Load Products on Mount**
  In `ChatPage` mount `useEffect`, fetch products by calling `useProductStore.fetchProducts()` and subscribe to real-time products updates.

- [ ] **Step 2: Redesign Quick Order Modal**
  Replace the text inputs for product name and price with:
  * A `<select>` dropdown populated from `products`.
  * Display selected product price.
  * Display available stock: `Stock: {selectedProduct.stock_quantity}`.
  * An input field for "Shipping Cost" (number, default value `50`).
  * A quantity input.

- [ ] **Step 3: Add Backorder Warning Alert**
  Inside the modal, add logic:
  ```typescript
  const isBackorder = selectedProduct && quantity > selectedProduct.stock_quantity;
  ```
  If `isBackorder` is true, render an amber warning banner:
  `⚠️ สินค้าในคลังไม่พอ! ออเดอร์นี้จะถูกจองเป็น "Backorder" (Pre-order status)`

- [ ] **Step 4: Update total price calculations**
  Total price = `(Product Price * Quantity) + Shipping Cost`.

---

### Task 6: Decrementing Inventory Stock on Order Creation

**Files:**
- Modify: `app/chat/page.tsx`

**Interfaces:**
- Consumes: `productService.adjustStock`
- Produces: Decremented product stock quantity in database, real-time synchronization

- [ ] **Step 1: Update order insertion logic**
  In `handleCreateMockOrder` inside `app/chat/page.tsx`:
  When creating a mock order:
  * Insert order with status `pending` if `isBackorder` is true, otherwise status `paid`.
  * Call `productService.adjustStock({ product_id: selectedProduct.id, adjustment: -quantity })`.
  * Send system message: `Created order ORD-XXXX. Stock adjusted.`

- [ ] **Step 2: Run build and verify**
  Run: `npm run build`
  Expected: Compiled successfully with zero errors.

- [ ] **Step 3: Run Vitest tests**
  Run: `npx vitest`
  Expected: All unit tests pass.

---

## Verification Plan

### Automated Tests
- `npx vitest run lib/services/__tests__/quick-reply.service.test.ts`
- `npm run build`

### Manual Verification
1. Log in at `http://localhost:3000/login` with `admin@test.com` and password `123456`.
2. Go to `http://localhost:3000/chat`.
3. Verify that sentiment badges appear next to names.
4. Type `/` in the input and verify autocomplete templates pop up and replace placeholders.
5. Click `✨` next to the chatbox, select an AI suggestion, and see if it populates the text area.
6. Open the Quick Order Modal, select "Leather Wallet" (check its stock count), try to order a quantity exceeding the stock. Verify the orange backorder alert appears.
7. Submit the order, check if order is created as `pending`, and verify that the product stock decreases in real-time in the inventory view.
