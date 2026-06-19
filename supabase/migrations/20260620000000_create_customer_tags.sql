-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#3B82F6',
    category TEXT NOT NULL CHECK (category IN ('customer', 'conversation', 'general')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create customer_tags junction table
CREATE TABLE IF NOT EXISTS public.customer_tags (
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (customer_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow authenticated users to read tags"
ON public.tags FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert/update tags"
ON public.tags FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read customer tags"
ON public.customer_tags FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage customer tags"
ON public.customer_tags FOR ALL TO authenticated USING (true);

-- Create Index for performance optimization
CREATE INDEX IF NOT EXISTS idx_customer_tags_customer_id ON public.customer_tags(customer_id);