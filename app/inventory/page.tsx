'use client';

import { useState } from 'react';

const products = [
  { id: 1, name: "เสื้อยืด Oversize", sku: "TS-001", stock: 245, status: "good", channel: "All" },
  { id: 2, name: "กางเกงยีนส์ Slim", sku: "JN-045", stock: 42, status: "low", channel: "Shopee" },
  { id: 3, name: "รองเท้าผ้าใบ", sku: "SN-112", stock: 8, status: "critical", channel: "TikTok" },
  { id: 4, name: "เสื้อเชิ้ต", sku: "SH-078", stock: 156, status: "good", channel: "All" },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockColor = (status: string) => {
    if (status === "good") return "bg-emerald-500/10 text-emerald-500";
    if (status === "low") return "bg-orange-500/10 text-orange-500";
    return "bg-red-500/10 text-red-500";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
          <p className="text-zinc-400">Real-time stock across all channels</p>
        </div>
        <button className="px-4 py-2 bg-white text-black rounded-xl text-sm font-medium">+ Add Product</button>
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search products or SKU..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm">
          <option>All Channels</option>
          <option>TikTok Shop</option>
          <option>Shopee</option>
          <option>Facebook</option>
        </select>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4 font-mono text-blue-400">{product.sku}</td>
                <td className="px-6 py-4 font-semibold">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStockColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400">{product.channel}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline text-sm">Adjust Stock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
