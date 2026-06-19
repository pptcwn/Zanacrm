-- Enable RLS
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipment_events enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.message_tags enable row level security;
alter table public.tasks enable row level security;
alter table public.commissions enable row level security;
alter table public.finance_entries enable row level security;

-- Helper to check user role (bypasses RLS for role lookup)
create function public.get_user_role(user_id uuid)
returns user_role as $$
  select role from public.profiles where id = user_id;
$$ language sql security definer set search_path = public;

revoke all on function public.get_user_role(uuid) from public;
grant execute on function public.get_user_role(uuid) to authenticated;

create function public.is_owner_or_admin()
returns boolean as $$
  select public.get_user_role((select auth.uid())) in ('owner'::user_role, 'admin'::user_role);
$$ language sql security definer set search_path = public;

revoke all on function public.is_owner_or_admin() from public;
grant execute on function public.is_owner_or_admin() to authenticated;

create function public.can_access_order(target_order_id uuid)
returns boolean as $$
  select exists (
    select 1
    from public.orders
    where id = target_order_id
      and (
        sales_id = (select auth.uid())
        or public.is_owner_or_admin()
      )
  );
$$ language sql security definer set search_path = public;

revoke all on function public.can_access_order(uuid) from public;
grant execute on function public.can_access_order(uuid) to authenticated;

create function public.can_access_conversation(target_conversation_id uuid)
returns boolean as $$
  select exists (
    select 1
    from public.conversations
    where id = target_conversation_id
      and (
        assigned_to = (select auth.uid())
        or public.is_owner_or_admin()
      )
  );
$$ language sql security definer set search_path = public;

revoke all on function public.can_access_conversation(uuid) from public;
grant execute on function public.can_access_conversation(uuid) to authenticated;

-- 1. Profiles Policies
create policy "Allow read access to everyone logged in"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Allow owners and admins to manage profiles"
  on public.profiles for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

-- 2. Customers Policies
create policy "Allow authenticated users to read customers"
  on public.customers for select
  to authenticated
  using (true);

create policy "Allow owners and admins to manage customers"
  on public.customers for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

-- 3. Products Policies
create policy "Allow authenticated users to read products"
  on public.products for select
  to authenticated
  using (true);

create policy "Allow owners and admins to manage products"
  on public.products for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

-- 4. Orders Policies
create policy "Allow owners and admins read all orders"
  on public.orders for select
  to authenticated
  using (public.is_owner_or_admin());

create policy "Allow sales to read assigned orders"
  on public.orders for select
  to authenticated
  using (sales_id = (select auth.uid()));

create policy "Allow owners and admins to manage orders"
  on public.orders for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

create policy "Allow sales to manage assigned orders"
  on public.orders for all
  to authenticated
  using (sales_id = (select auth.uid()))
  with check (sales_id = (select auth.uid()));

-- 5. Order Items Policies
create policy "Allow owners and admins to manage order items"
  on public.order_items for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

create policy "Allow sales to access order items for assigned orders"
  on public.order_items for all
  to authenticated
  using (public.can_access_order(order_id))
  with check (public.can_access_order(order_id));

-- 6. Shipment Events Policies
create policy "Allow owners and admins to manage shipment events"
  on public.shipment_events for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

create policy "Allow sales to access shipment events for assigned orders"
  on public.shipment_events for all
  to authenticated
  using (public.can_access_order(order_id))
  with check (public.can_access_order(order_id));

-- 7. Conversations Policies
create policy "Allow owners and admins to manage conversations"
  on public.conversations for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

create policy "Allow sales to access assigned conversations"
  on public.conversations for all
  to authenticated
  using (assigned_to = (select auth.uid()))
  with check (assigned_to = (select auth.uid()));

-- 8. Messages Policies
create policy "Allow owners and admins to manage messages"
  on public.messages for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

create policy "Allow sales to access messages for assigned conversations"
  on public.messages for all
  to authenticated
  using (public.can_access_conversation(conversation_id))
  with check (public.can_access_conversation(conversation_id));

-- 9. Message Tags Policies
create policy "Allow owners and admins to manage message tags"
  on public.message_tags for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

create policy "Allow sales to access message tags for assigned conversations"
  on public.message_tags for all
  to authenticated
  using (
    exists (
      select 1
      from public.messages
      where public.messages.id = message_tags.message_id
        and public.can_access_conversation(public.messages.conversation_id)
    )
  )
  with check (
    exists (
      select 1
      from public.messages
      where public.messages.id = message_tags.message_id
        and public.can_access_conversation(public.messages.conversation_id)
    )
  );

-- 10. Tasks Policies
create policy "Allow owners and admins to manage tasks"
  on public.tasks for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

create policy "Allow sales to access assigned tasks"
  on public.tasks for all
  to authenticated
  using (assigned_to = (select auth.uid()))
  with check (assigned_to = (select auth.uid()));

-- 11. Commissions Policies
create policy "Allow owners and admins to manage commissions"
  on public.commissions for all
  to authenticated
  using (public.is_owner_or_admin())
  with check (public.is_owner_or_admin());

create policy "Allow sales to access own commissions"
  on public.commissions for all
  to authenticated
  using (sales_id = (select auth.uid()))
  with check (sales_id = (select auth.uid()));

-- 12. Finance Policies
create policy "Allow only owners to manage finance"
  on public.finance_entries for all
  to authenticated
  using (public.get_user_role((select auth.uid())) = 'owner'::user_role)
  with check (public.get_user_role((select auth.uid())) = 'owner'::user_role);
