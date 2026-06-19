# Zanacrm Production Upgrade — Design Specification

> **สถานะ**: อนุมัติแล้ว  
> **วันที่**: 19 มิถุนายน 2569  
> **แนวทาง**: Foundation First (Phase A)  
> **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)

---

## 1. บริบทและปัญหา

Zanacrm (OMS - Omni-Channel Order Management System) ปัจจุบันอยู่ในสถานะ **Prototype** (~96% UI พร้อม) แต่ยังมีปัญหาวิกฤตที่ขวางกั้นการใช้งานจริง:

| ปัญหา | ความรุนแรง |
|:---|:---:|
| 100% Mock Data — ไม่มี API call | 🔴 Critical |
| ไม่มี Authentication — ชื่อ hardcode ทั้งระบบ | 🔴 Critical |
| ปุ่มส่วนใหญ่ไม่ทำงาน (Export, Add, Create) | 🔴 Critical |
| Design token inconsistency — 7/11 หน้าใช้ hardcode colors | 🟡 High |
| Dual styling system — CSS classes + React components ปนกัน | 🟡 High |
| Type safety violations — `as any` casts 5 จุด | 🟡 High |
| Test coverage ~0% — 3 tests เท่านั้น | 🟡 High |
| Feature gap จาก prototype HTML — Login, CRM Pipeline, Settings ยังไม่มี | 🟠 Medium |

### สิ่งที่มีและต้องคงไว้
- โครงสร้าง Next.js 15 App Router ดี มี routing ครบ 11 โมดูล
- Design System OKLCH tokens + Glass HUD theme สวยงาม
- UI Component Library คุณภาพดี (Badge, Button, Card, StatusBadge, PlatformBadge, TaskCard)
- Accessibility ดีใน shared components (aria-labels, focus rings, keyboard nav)

---

## 2. เป้าหมาย

เปลี่ยน Zanacrm จาก Prototype → Production-ready OMS ที่:
1. เชื่อมต่อ Supabase backend จริง (Auth, DB, Realtime)
2. ทุกฟีเจอร์ทำงานได้จริง (CRUD, tracking, chat, finance)
3. Type-safe 100%, ไม่มี `as any`
4. Design system สม่ำเสมอทั้งระบบ
5. Test coverage ครอบคลุม components + services

---

## 3. Database Schema

### 3.1 ตาราง `profiles`
ผูกกับ `auth.users` — เก็บข้อมูลเพิ่มเติมของผู้ใช้

| Column | Type | Note |
|:---|:---|:---|
| id | uuid (FK auth.users) | Primary key |
| full_name | text | ชื่อแสดงผล |
| role | enum: owner, admin, sales | กำหนดสิทธิ์ |
| avatar_url | text | URL รูปโปรไฟล์ |
| phone | text | เบอร์โทร |
| created_at | timestamptz | |

### 3.2 ตาราง `customers`
ลูกค้าทุกช่องทาง

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| name | text | ชื่อลูกค้า |
| phone | text | |
| email | text | |
| segment | enum: vip, regular, new, at_risk | กลุ่มลูกค้า |
| total_orders | integer | นับจากข้อมูลจริง |
| total_spent | decimal | ยอดรวมสะสม |
| platforms | text[] | ช่องทางที่เคยสั่ง |
| notes | text | หมายเหตุ |
| created_at | timestamptz | |

### 3.3 ตาราง `products`
สินค้าทั้งหมด

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| name | text | ชื่อสินค้า |
| sku | text (unique) | รหัสสินค้า |
| price | decimal | ราคาต่อชิ้น |
| cost | decimal | ต้นทุนต่อชิ้น |
| stock_quantity | integer | จำนวนคงเหลือ |
| low_stock_threshold | integer | เกณฑ์แจ้งเตือน |
| channel | text | ช่องทางขาย |
| category | text | หมวดหมู่ |
| image_url | text | รูปสินค้า |
| is_active | boolean | สถานะการขาย |
| created_at | timestamptz | |

### 3.4 ตาราง `orders`
ออเดอร์จากทุกช่องทาง

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| order_number | text (unique) | เลขออเดอร์ (ORD-XXXX) |
| channel | enum: tiktok, shopee, facebook, lazada | แพลตฟอร์ม |
| customer_id | uuid (FK customers) | |
| sales_id | uuid (FK profiles) | เซลล์ที่ดูแล |
| status | enum: pending, paid, processing, shipped, delivered, cancelled, refunded | |
| subtotal | decimal | ยอดก่อนส่ง |
| shipping_cost | decimal | ค่าส่ง |
| discount | decimal | ส่วนลด |
| total_amount | decimal | ยอดรวมสุทธิ |
| shipping_address | jsonb | ที่อยู่จัดส่ง |
| tracking_number | text | เลข tracking |
| shipping_provider | text | ขนส่ง (Kerry, Flash, etc.) |
| notes | text | หมายเหตุ |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 3.5 ตาราง `order_items`
รายการสินค้าในแต่ละออเดอร์

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| order_id | uuid (FK orders) | |
| product_id | uuid (FK products) | |
| product_name | text | snapshot ชื่อ ณ เวลาสั่ง |
| quantity | integer | จำนวน |
| unit_price | decimal | ราคาต่อชิ้น ณ เวลาสั่ง |
| total | decimal | quantity × unit_price |

### 3.6 ตาราง `shipment_events`
Log เหตุการณ์การจัดส่ง — ใช้แสดง tracking timeline

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| order_id | uuid (FK orders) | |
| status | enum: picked_up, in_transit, hub_arrived, out_for_delivery, delivered, returned | |
| location | text | สถานที่ |
| note | text | รายละเอียด |
| created_at | timestamptz | เวลาเกิดเหตุการณ์ |

### 3.7 ตาราง `conversations`
การสนทนากับลูกค้าจากทุกช่องทาง

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| customer_id | uuid (FK customers) | |
| channel | enum: tiktok, shopee, facebook, lazada, line | |
| assigned_to | uuid (FK profiles) | เซลล์ที่ดูแล |
| last_message | text | ข้อความล่าสุด |
| unread_count | integer | จำนวนยังไม่อ่าน |
| status | enum: active, resolved, pending | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 3.8 ตาราง `messages`
ข้อความแต่ละรายการ

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| conversation_id | uuid (FK conversations) | |
| sender_type | enum: customer, agent, system | |
| sender_id | uuid | FK profiles (ถ้า agent) |
| content | text | เนื้อหาข้อความ |
| created_at | timestamptz | |

### 3.9 ตาราง `message_tags`
Tagging ใน chat — เชื่อมโยง @user หรือ #order

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| message_id | uuid (FK messages) | |
| tag_type | enum: user, order | |
| reference_id | uuid | FK profiles หรือ FK orders |
| display_text | text | ข้อความที่แสดง (@ชื่อ หรือ #ORD-xxxx) |

### 3.10 ตาราง `tasks`
Task board (Kanban)

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| title | text | ชื่อ task |
| description | text | รายละเอียด |
| status | enum: todo, in_progress, review, completed | |
| priority | enum: low, medium, high, urgent | |
| assigned_to | uuid (FK profiles) | |
| order_id | uuid (FK orders) | ออเดอร์ที่เกี่ยวข้อง |
| labels | text[] | แท็กเพิ่มเติม |
| due_date | date | กำหนดส่ง |
| position | integer | ลำดับใน column |
| created_at | timestamptz | |

### 3.11 ตาราง `commissions`
คอมมิชชั่นเซลล์

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| sales_id | uuid (FK profiles) | |
| order_id | uuid (FK orders) | |
| amount | decimal | จำนวนเงินคอมฯ |
| rate | decimal | อัตราคอมฯ (%) |
| status | enum: pending, approved, paid | |
| period | text | งวดจ่าย (2026-06) |
| created_at | timestamptz | |

### 3.12 ตาราง `finance_entries`
บันทึกรายรับ-รายจ่าย

| Column | Type | Note |
|:---|:---|:---|
| id | uuid | Primary key |
| type | enum: income, expense, ad_spend | |
| category | text | หมวดหมู่ (ค่าโฆษณา, ค่าสินค้า, ค่าขนส่ง, etc.) |
| amount | decimal | จำนวนเงิน |
| description | text | รายละเอียด |
| reference_id | uuid | อ้างอิง order/campaign (nullable) |
| date | date | วันที่เกิดรายการ |
| created_at | timestamptz | |

---

## 4. Auth & Role-Based Access Control

### 4.1 Authentication Flow
1. Login page ที่ `/login` (email + password)
2. Supabase Auth handles session via cookies
3. Middleware ตรวจสอบ session ทุก request → redirect ถ้าไม่ได้ login
4. `profiles` table ดึง role เพื่อกำหนดสิทธิ์

### 4.2 Role Permissions

| Resource | Owner | Admin | Sales |
|:---|:---:|:---:|:---:|
| Dashboard (Owner) | ✅ | ❌ | ❌ |
| Dashboard (Admin) | ✅ | ✅ | ❌ |
| Dashboard (Sales) | ✅ | ✅ | ✅ (ตัวเอง) |
| Orders — View All | ✅ | ✅ | ❌ |
| Orders — View Own | ✅ | ✅ | ✅ |
| Orders — Create/Edit | ✅ | ✅ | ✅ (assigned) |
| Inventory | ✅ | ✅ | 👁 Read-only |
| Chat — All | ✅ | ✅ | ❌ |
| Chat — Assigned | ✅ | ✅ | ✅ |
| Tasks | ✅ | ✅ | ✅ (assigned) |
| Customers | ✅ | ✅ | 👁 Read-only |
| Finance | ✅ | ❌ | ❌ |
| Commission — All | ✅ | ✅ | ❌ |
| Commission — Own | ✅ | ✅ | ✅ |
| Settings | ✅ | ❌ | ❌ |
| User Management | ✅ | ✅ | ❌ |

### 4.3 Row-Level Security (RLS)
ทุกตารางจะมี RLS policies:
- **Owner/Admin**: `SELECT/INSERT/UPDATE/DELETE` ทุก row
- **Sales**: `SELECT` เฉพาะ row ที่ `sales_id = auth.uid()` หรือ `assigned_to = auth.uid()`
- Finance: `SELECT/INSERT/UPDATE` เฉพาะ Owner

---

## 5. Frontend Architecture

### 5.1 Data Layer Stack
```
UI (React Components)
  ↓
Hooks (SWR for server data)
  ↓
Services (Supabase query functions)
  ↓
Supabase Client (browser/server)
  ↓
PostgreSQL (via Supabase)
```

### 5.2 State Management — Zustand
Client-side UI state เท่านั้น (ไม่ซ้ำกับ server data):

| Store | หน้าที่ |
|:---|:---|
| `useAuthStore` | user profile, role, login/logout actions |
| `useUIStore` | sidebar collapsed, mobile menu, notification count |
| `useOrderStore` | filters, selected order, pagination state |
| `useInventoryStore` | search query, product filters |
| `useChatStore` | selected conversation, draft message |
| `useTaskStore` | drag state, column filters |

### 5.3 Directory Structure

```
lib/
├── supabase/
│   ├── client.ts              → createBrowserClient()
│   ├── server.ts              → createServerClient()
│   └── middleware.ts           → Auth session check
├── services/
│   ├── auth.service.ts         → signIn, signOut, getProfile
│   ├── orders.service.ts       → CRUD orders + order items
│   ├── inventory.service.ts    → CRUD products + stock adjustments
│   ├── customers.service.ts    → CRUD customers + segments
│   ├── chat.service.ts         → conversations + messages + tags
│   ├── tasks.service.ts        → CRUD tasks + reorder
│   ├── finance.service.ts      → entries + P&L calculations
│   ├── commission.service.ts   → commission CRUD + auto-calc
│   └── shipping.service.ts     → shipment events + tracking
├── hooks/
│   ├── useOrders.ts            → SWR hook for orders
│   ├── useInventory.ts         → SWR hook for products
│   ├── useChat.ts              → SWR + Realtime subscription
│   ├── useTasks.ts             → SWR hook for tasks
│   ├── useCustomers.ts         → SWR hook for customers
│   ├── useFinance.ts           → SWR hook for finance entries
│   ├── useCommission.ts        → SWR hook for commissions
│   └── useShipping.ts          → SWR hook for shipment events
├── stores/
│   ├── useAuthStore.ts
│   ├── useUIStore.ts
│   ├── useOrderStore.ts
│   ├── useInventoryStore.ts
│   ├── useChatStore.ts
│   └── useTaskStore.ts
├── types/
│   ├── database.types.ts       → Auto-generated from Supabase
│   ├── enums.ts                → OrderStatus, Channel, TaskStatus, etc.
│   └── index.ts                → Re-exports
└── utils.ts                    → cn() utility (existing)
```

### 5.4 Realtime Subscriptions
ใช้ Supabase Realtime สำหรับ:
1. **Chat messages** — subscribe `messages` table → แสดงข้อความใหม่ทันที
2. **Order status changes** — subscribe `orders` table → อัพเดท dashboard + order list
3. **Low stock alerts** — subscribe `products` table → เมื่อ `stock_quantity < low_stock_threshold`
4. **Task updates** — subscribe `tasks` table → อัพเดท kanban board

---

## 6. Design System Cleanup

### 6.1 สิ่งที่ต้องลบ
- CSS helper classes ทั้งหมดใน `globals.css`: `.card`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`, `.btn`, `.btn-primary`, `.btn-secondary`, `.surface`, `.text-muted`
- Hardcoded Tailwind colors ในทุกหน้า: `bg-zinc-900`, `border-zinc-800`, `text-zinc-400`, `text-blue-500`

### 6.2 สิ่งที่ต้องเพิ่ม (Missing UI Components)

| Component | หน้าที่ |
|:---|:---|
| `Input` | Form input พร้อม label, error state, icon prefix |
| `Textarea` | Multi-line input |
| `Select` | Dropdown select |
| `Modal` | Dialog/Modal พร้อม accessibility |
| `Table` | Composable table system (Header, Body, Row, Cell) |
| `Tabs` | Tab navigation |
| `Dropdown` | Dropdown menu |
| `Avatar` | User/customer avatar |
| `Skeleton` | Loading placeholder |
| `Toast` | Notification toast |
| `TrackingStepper` | Order tracking timeline UI |
| `EmptyState` | Empty state placeholder |
| `Pagination` | Page navigation |
| `SearchInput` | Search with debounce |
| `ConfirmDialog` | Confirmation modal |

### 6.3 Mobile Bottom Nav Fix
- ปรับ routes ให้ตรงกับ sidebar
- เปลี่ยนจาก hardcoded colors → design tokens
- เพิ่ม notification badge

---

## 7. Order Tracking System

### 7.1 Tracking Timeline UI
แสดงเป็น vertical stepper ใน Order Detail page:

```
● รับออเดอร์ (19 มิ.ย. 10:30)          ✅ completed
│
● ชำระเงินแล้ว (19 มิ.ย. 11:00)        ✅ completed
│
● กำลังเตรียมสินค้า (19 มิ.ย. 14:00)    ✅ completed
│
● จัดส่งแล้ว (20 มิ.ย. 09:00)           ✅ completed
│  Kerry Express | TH123456789
│  └─ ถึงศูนย์คัดแยก กรุงเทพ
│  └─ กำลังนำจ่าย
│
○ ลูกค้าได้รับสินค้า                      ⏳ pending
```

### 7.2 Status Update Flow
1. Admin/Owner อัพเดท status → สร้าง `shipment_event` อัตโนมัติ
2. เมื่อ status เปลี่ยน → Realtime notify dashboard
3. สามารถเพิ่ม shipment events ย่อยได้ (เช่น ถึงศูนย์คัดแยก)

---

## 8. Chat Tagging System

### 8.1 @User Mention
- พิมพ์ `@` → แสดง autocomplete dropdown รายชื่อ profiles
- เลือก → แทรกเป็น `@ชื่อ` ในข้อความ + สร้าง `message_tag` record
- แสดงผลเป็น **clickable chip** → link ไปที่ user profile

### 8.2 #Order Tag
- พิมพ์ `#` → แสดง autocomplete dropdown รายการ orders
- เลือก → แทรกเป็น `#ORD-xxxx` + สร้าง `message_tag` record
- แสดงผลเป็น **order card preview** (mini card แสดง order number, status, amount)
- คลิก → navigate ไปที่ order detail

### 8.3 UI Pattern
ในช่อง input จะเป็น contenteditable div (ไม่ใช่ textarea ธรรมดา) เพื่อให้ render tags เป็น styled elements ได้

---

## 9. Verification Plan

### 9.1 Automated Tests
- `npm run test` — Vitest unit tests สำหรับ:
  - UI Components (Button, Badge, Card, Modal, Table, etc.)
  - Services (CRUD operations, data transformation)
  - Hooks (data fetching, error handling)
  - Stores (state mutations)
- `npm run build` — Next.js build verification (type checking + compilation)
- `npm run lint` — ESLint check

### 9.2 Manual Verification
- ทดสอบ Auth flow (Login/Logout/Role redirect)
- ทดสอบ CRUD ทุก module ผ่าน Supabase dashboard
- ทดสอบ Realtime (Chat, Order updates, Stock alerts)
- ทดสอบ Responsive (375px → 1440px)
- ทดสอบ Accessibility (keyboard navigation, screen reader)

---

## 10. Dependencies ที่ต้องเพิ่ม

| Package | หน้าที่ |
|:---|:---|
| `@supabase/supabase-js` | Supabase client |
| `@supabase/ssr` | Server-side auth helpers |
| `zustand` | Client state management |
| `swr` | Data fetching/caching |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag & Drop สำหรับ Task Board |
| `recharts` | Charts สำหรับ Dashboard/Finance |
| `date-fns` | Date formatting (Thai locale) |
| `sonner` | Toast notifications |
| `zod` | Schema validation สำหรับ forms |

---

*สิ้นสุด Design Specification*
