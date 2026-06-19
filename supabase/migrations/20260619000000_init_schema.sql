-- Custom enums
create type user_role as enum ('owner', 'admin', 'sales');
create type customer_segment as enum ('vip', 'regular', 'new', 'at_risk');
create type order_channel as enum ('tiktok', 'shopee', 'facebook', 'lazada');
create type order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type shipment_status as enum ('picked_up', 'in_transit', 'hub_arrived', 'out_for_delivery', 'delivered', 'returned');
create type chat_channel as enum ('tiktok', 'shopee', 'facebook', 'lazada', 'line');
create type chat_status as enum ('active', 'resolved', 'pending');
create type sender_role as enum ('customer', 'agent', 'system');
create type tag_category as enum ('user', 'order');
create type task_state as enum ('todo', 'in_progress', 'review', 'completed');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');
create type finance_type as enum ('income', 'expense', 'ad_spend');
create type commission_status as enum ('pending', 'approved', 'paid');

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role user_role default 'sales'::user_role not null,
  avatar_url text,
  phone text,
  created_at timestamptz default now() not null
);

-- 2. Customers Table
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  segment customer_segment default 'new'::customer_segment not null,
  total_orders integer default 0 not null,
  total_spent decimal(10,2) default 0.00 not null,
  platforms text[] default '{}'::text[] not null,
  notes text,
  created_at timestamptz default now() not null
);

-- 3. Products Table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique not null,
  price decimal(10,2) not null,
  cost decimal(10,2) not null,
  stock_quantity integer default 0 not null,
  low_stock_threshold integer default 5 not null,
  channel text,
  category text,
  image_url text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

-- 4. Orders Table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  channel order_channel not null,
  customer_id uuid references public.customers(id) on delete set null,
  sales_id uuid references public.profiles(id) on delete set null,
  status order_status default 'pending'::order_status not null,
  subtotal decimal(10,2) default 0.00 not null,
  shipping_cost decimal(10,2) default 0.00 not null,
  discount decimal(10,2) default 0.00 not null,
  total_amount decimal(10,2) default 0.00 not null,
  shipping_address jsonb,
  tracking_number text,
  shipping_provider text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 5. Order Items Table
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null,
  unit_price decimal(10,2) not null,
  total decimal(10,2) not null
);

-- 6. Shipment Events Table
create table public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  status shipment_status not null,
  location text,
  note text,
  created_at timestamptz default now() not null
);

-- 7. Conversations Table
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade not null,
  channel chat_channel not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  last_message text,
  unread_count integer default 0 not null,
  status chat_status default 'active'::chat_status not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 8. Messages Table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_type sender_role not null,
  sender_id uuid,
  content text not null,
  created_at timestamptz default now() not null
);

-- 9. Message Tags Table
create table public.message_tags (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.messages(id) on delete cascade not null,
  tag_type tag_category not null,
  reference_id uuid not null,
  display_text text not null
);

-- 10. Tasks Table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status task_state default 'todo'::task_state not null,
  priority task_priority default 'medium'::task_priority not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  labels text[] default '{}'::text[] not null,
  due_date date,
  position integer default 0 not null,
  created_at timestamptz default now() not null
);

-- 11. Commissions Table
create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  sales_id uuid references public.profiles(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete cascade not null,
  amount decimal(10,2) not null,
  rate decimal(5,2) not null,
  status commission_status default 'pending'::commission_status not null,
  period text not null,
  created_at timestamptz default now() not null
);

-- 12. Finance Entries Table
create table public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  type finance_type not null,
  category text not null,
  amount decimal(10,2) not null,
  description text,
  reference_id uuid,
  date date default current_date not null,
  created_at timestamptz default now() not null
);

-- Automatic Profile Handling trigger from auth.users
create function public.handle_new_user()
returns trigger as $$
declare
  v_role user_role;
begin
  begin
    v_role := (new.raw_user_meta_data->>'role')::user_role;
    if v_role is null then
      v_role := 'sales'::user_role;
    end if;
  exception when others then
    v_role := 'sales'::user_role;
  end;

  insert into public.profiles (id, full_name, role, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    v_role,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
