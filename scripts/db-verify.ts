import { Database } from '../types/database.types'

export function verifyMockData(db: Partial<Database>) {
  void db
  const mockProduct: Database['public']['Tables']['products']['Row'] = {
    id: '1',
    name: 'Premium Silk Shirt',
    sku: 'SH-SILK-01',
    price: 1290.00,
    cost: 450.00,
    stock_quantity: 25,
    low_stock_threshold: 5,
    channel: null,
    category: 'Apparel',
    image_url: null,
    is_active: true,
    created_at: '2026-06-19T00:00:00Z',
  }
  return mockProduct.sku === 'SH-SILK-01'
}