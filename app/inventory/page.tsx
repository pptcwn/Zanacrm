'use client';

import { useState, useEffect } from 'react';
import { useProductStore } from '@/lib/store/productStore';
import { AddProductModal } from './add-product-modal';
import { AdjustStockModal } from './adjust-stock-modal';
import { Database } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus } from 'lucide-react';

type ProductRow = Database['public']['Tables']['products']['Row'];

const getStockStatus = (stock: number, threshold: number | null) => {
  const min = threshold || 10;
  if (stock <= 0) return { label: 'out of stock', color: 'bg-red-500/10 text-red-500 border border-red-500/20' };
  if (stock <= min) return { label: 'low', color: 'bg-orange-500/10 text-orange-500 border border-orange-500/20' };
  return { label: 'good', color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' };
};

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<ProductRow | null>(null);

  const { products, isLoading, error, fetchProducts, subscribeToProducts, unsubscribeFromProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
    subscribeToProducts();
    return () => unsubscribeFromProducts();
  }, [fetchProducts, subscribeToProducts, unsubscribeFromProducts]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Inventory</h1>
          <p className="text-zinc-400 mt-1 text-sm">Real-time stock across all channels</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-white text-black hover:bg-zinc-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="flex gap-3 max-w-2xl">
        <Input
          placeholder="Search products or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="w-48">
          <Select
            options={[
              { value: 'all', label: 'All Channels' }
            ]}
            value="all"
            onChange={() => {}}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-xl">
        {isLoading && products.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f1f1f] text-left text-xs uppercase tracking-wider text-zinc-500 bg-[#141414]">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 text-right font-medium">Stock</th>
                  <th className="px-6 py-4 text-right font-medium">Price</th>
                  <th className="px-6 py-4 text-center font-medium">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f] text-sm">
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock_quantity || 0, product.low_stock_threshold);
                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors text-white group">
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4 font-mono text-zinc-400 text-xs">{product.sku}</td>
                      <td className="px-6 py-4 font-semibold text-right">{product.stock_quantity || 0}</td>
                      <td className="px-6 py-4 text-right font-medium">฿{product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setAdjustProduct(product)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Adjust Stock
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      No products found. Add a product to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <AdjustStockModal
        product={adjustProduct}
        isOpen={!!adjustProduct}
        onClose={() => setAdjustProduct(null)}
      />
    </div>
  );
}
