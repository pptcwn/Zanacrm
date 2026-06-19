-- Migration: triggers, indexes, and utility functions

-- Section 1: Utility trigger function
-- Auto-update updated_at timestamp
create or replace function public.update_modified_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.update_modified_column();

-- Section 2: Stock decrement trigger
-- Auto-decrement product stock on order_item insert
create or replace function public.decrement_stock()
returns trigger as $$
begin
  if new.product_id is not null then
    update public.products
    set stock_quantity = stock_quantity - new.quantity
    where id = new.product_id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_order_item_insert_decrement_stock
  after insert on public.order_items
  for each row execute function public.decrement_stock();

-- Section 3: Customer stats trigger
-- Auto-update customer total_orders and total_spent
create or replace function public.update_customer_stats()
returns trigger as $$
declare
  target_customer_id uuid;
begin
  target_customer_id := coalesce(new.customer_id, old.customer_id);
  if target_customer_id is not null then
    update public.customers set
      total_orders = (select count(*) from public.orders where customer_id = target_customer_id),
      total_spent = (select coalesce(sum(total_amount), 0) from public.orders where customer_id = target_customer_id)
    where id = target_customer_id;
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_order_update_customer_stats
  after insert or update or delete on public.orders
  for each row execute function public.update_customer_stats();

-- Section 4: Order number generation
-- Generate unique sequential order number by channel
create or replace function public.generate_order_number(p_channel order_channel)
returns text as $$
declare
  prefix text;
  next_seq int;
begin
  prefix := case p_channel
    when 'tiktok' then 'TK'
    when 'shopee' then 'SP'
    when 'facebook' then 'FB'
    when 'lazada' then 'LZ'
  end;
  select coalesce(max(cast(substring(order_number from 4) as int)), 0) + 1
  into next_seq
  from public.orders
  where channel = p_channel;
  return prefix || '-' || lpad(next_seq::text, 4, '0');
end;
$$ language plpgsql;

-- Section 5: Dashboard summary function
-- Get dashboard KPI summary
create or replace function public.get_dashboard_summary(
  p_start_date timestamptz default now() - interval '30 days',
  p_end_date timestamptz default now()
)
returns json as $$
  select json_build_object(
    'total_revenue', coalesce(sum(total_amount), 0),
    'total_orders', count(*),
    'avg_order_value', coalesce(round(avg(total_amount)::numeric, 2), 0)
  )
  from public.orders
  where created_at between p_start_date and p_end_date
    and status not in ('cancelled', 'refunded');
$$ language sql stable security definer set search_path = public;

revoke all on function public.get_dashboard_summary(timestamptz, timestamptz) from public;
grant execute on function public.get_dashboard_summary(timestamptz, timestamptz) to authenticated;

-- Section 6: Performance indexes
-- Performance indexes
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_orders_sales_id on public.orders(sales_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_conversations_customer_id on public.conversations(customer_id);
create index if not exists idx_conversations_assigned_to on public.conversations(assigned_to);
create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_tasks_assigned_to on public.tasks(assigned_to);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_commissions_sales_id on public.commissions(sales_id);
create index if not exists idx_commissions_period on public.commissions(period);
create index if not exists idx_finance_entries_date on public.finance_entries(date);
create index if not exists idx_finance_entries_type on public.finance_entries(type);
