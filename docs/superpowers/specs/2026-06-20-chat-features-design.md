# Design Spec: Unified Chat Advanced Features

**Date**: 2026-06-20  
**Status**: APPROVED BY USER  
**Author**: Antigravity  

---

## 1. Goal & Context

This design document outlines the implementation of four core enhancements to the **Unified Chat System**:
1. **AI-Assisted Replies & Sentiment Analysis**: Inline AI suggestion box with context-aware responses and customer emotion labels on chat cards.
2. **Database-Driven Quick Replies**: Dynamic templates fetched from a new `quick_reply_templates` table supporting parameter variables like `{customer_name}`, `{order_number}`, and `{customer_segment}`.
3. **Real-time Conversations List**: Automatically updating and re-sorting the inbox sidebar in real-time when conversations are modified or messages are received.
4. **Order-Inventory & Backorder Linkage**: Restructuring the Quick Order Modal to select real database products, perform real-time stock checks, alert sales representatives of backorders, calculate customizable shipping costs, and automatically adjust inventory levels.

---

## 2. Technical Design & Architecture

### 2.1 Database Migrations & Seed Data

A new migration file `supabase/migrations/20260620000001_chat_advanced_features.sql` will be created to define the table structures, insert mock records, and configure security.

#### 1) Quick Reply Templates Table
```sql
CREATE TABLE public.quick_reply_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shortcut text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE public.quick_reply_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read templates"
  ON public.quick_reply_templates FOR SELECT
  TO authenticated
  USING (true);
```

#### 2) Initial Seed Data (Quick Replies)
```sql
INSERT INTO public.quick_reply_templates (shortcut, title, content) VALUES
('address', 'ขอที่อยู่จัดส่ง', 'สวัสดีค่ะคุณ {customer_name} รบกวนแจ้งชื่อ ที่อยู่ และเบอร์โทรศัพท์สำหรับจัดส่งสินค้าด้วยนะคะ ขอบคุณค่ะ'),
('promo', 'โปรโมชั่นลูกค้าประจำ', 'โปรโมชั่นพิเศษสำหรับลูกค้าระดับ {customer_segment}! รับส่วนลดค่าจัดส่งฟรีและลดเพิ่ม 10% เมื่อซื้อยอดรวมครบ 1,000 บาทค่ะ'),
('order_confirm', 'ยืนยันออเดอร์', 'ยืนยันการสั่งซื้อสำเร็จค่ะคุณ {customer_name} ออเดอร์หมายเลข {order_number} อยู่ระหว่างการเตรียมจัดส่งค่ะ');
```

---

### 2.2 Application Components & UI Flow

#### 1) AI Suggested Replies & Sentiment Badge (Column 1 & 2)
* **Sentiment Analysis Helper**: A utility function mapping client messages to emotions:
  * Angry words (`ช้า`, `ยกเลิก`, `คืนเงิน`, `โมโห`) ➡️ 🔴 `Urgent / Angry`
  * Positive words (`ขอบคุณ`, `ชอบ`, `ดี`, `ส่งไว`) ➡️ 🟢 `Positive`
  * Default ➡️ 🟡 `Neutral`
  * Badge displayed on the chat sidebar card next to the customer name, and at the top of the CRM customer profile panel.
* **AI Popover Trigger**:
  * A `✨` (Sparkles) button positioned next to the chat text area.
  * Clicking it shows a popover listing 3 context-specific prompt headers. Selecting an option simulates an LLM response incorporating customer data, inserting the text directly into the input area.

#### 2) Dynamic Autocomplete Templates (Column 2 Input)
* When `/` is typed in the input box, an autocomplete suggestion panel fetches values from `quick_reply_templates`.
* Placeholders are resolved dynamically in JS:
  * `{customer_name}` ➡️ `activeConversation.customers.name`
  * `{customer_segment}` ➡️ `activeConversation.customers.segment`
  * `{order_number}` ➡️ Latest order number from `orders` linked to the customer (e.g. `ORD-5011` or "ไม่มีการสั่งซื้อ").

#### 3) Conversations List Real-time Subscription (Inbox)
* Extend Zustand `useChatStore` to subscribe to the `conversations` channel:
  ```typescript
  // In useChatStore.ts
  const channel = supabase
    .channel('conversations-realtime')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, (payload) => {
      // 1. Update the conversations array in state
      // 2. Sort conversations by updated_at descending to move the active one to the top
    })
    .subscribe();
  ```

#### 4) CRM Quick Order Modal & Stock Check (Column 3)
* Replace product name text inputs in the modal with a `<select>` dropdown populated from `products`.
* Display available stock for the selected product.
* Display shipping cost input (number field, default `50` Baht).
* **Inventory Control Logic**:
  * If quantity ordered > product's `stock_quantity`, display a warning: `⚠️ สินค้าในคลังไม่พอ! ออเดอร์จะถูกตั้งเป็น Backorder`.
  * Total calculation: `Subtotal = Unit Price * Quantity`, `Total = Subtotal + Shipping Cost`.
  * Create order with status:
    * If quantity <= `stock_quantity`: status `paid` (processing).
    * If quantity > `stock_quantity`: status `pending` (Backorder).
  * Run database update `.update({ stock_quantity: newStock })` on product. Realtime channel `public:products` will broadcast the new stock to all other screens.

---

## 3. Verification & Testing Plan

### 3.1 Automated Testing
* **Service Unit Tests**: Write Vitest tests in `lib/services/__tests__/chat_features.test.ts` validating:
  * Dynamic template replacement logic.
  * Sentiment analysis scoring logic.
  * Backorder state transition rules.

### 3.2 Manual Verification
* Access `/chat`, open browser console.
* Type `/` in the message box, select `/promo` and verify placeholder replacements.
* Open another browser window side-by-side, send a message to trigger an update, and verify the card moves to the top automatically.
* Select a product in the Quick Order Modal with 2 stock. Set quantity to 5. Check if orange Backorder warning is shown. Save and verify the order is created with status `pending`.

---
