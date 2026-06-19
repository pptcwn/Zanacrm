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
