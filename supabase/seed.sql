-- Seed products
insert into public.products (name, sku, price, cost, stock_quantity, low_stock_threshold, category) values
('Premium Silk Shirt', 'SH-SILK-01', 1290.00, 450.00, 25, 5, 'Apparel'),
('Comfort Chino Pants', 'PT-CHINO-02', 1590.00, 600.00, 3, 5, 'Apparel');

-- Seed customers
insert into public.customers (name, phone, email, segment, total_orders, total_spent, platforms) values
('Alice Johnson', '0812345678', 'alice@example.com', 'vip'::customer_segment, 5, 8500.00, array['tiktok', 'shopee']),
('Bob Smith', '0898765432', 'bob@example.com', 'new'::customer_segment, 1, 1590.00, array['facebook']);