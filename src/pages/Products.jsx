import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { FaSearch, FaFileDownload, FaEllipsisV, FaBox, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const productsData = Array.from({ length: 30 }, (_, index) => {
  const products = [
    { title: 'Matte Clay Pomade', cat: 'Styling', brand: 'Smith Pomade', price: 120000, image: '🧴' },
    { title: 'Wahl Cordless Senior', cat: 'Tools', brand: 'Wahl Professional', price: 2500000, image: '🔧' },
    { title: 'Aftershave Cologne', cat: 'Shaving', brand: 'The Shave Factory', price: 85000, image: '🌸' },
    { title: 'Hair Tonic Anti-Dandruff', cat: 'Hair Care', brand: 'Chief', price: 65000, image: '💧' },
    { title: 'Profoil Lithium Shaver', cat: 'Tools', brand: 'Andis', price: 1850000, image: '🪒' },
  ];

  const baseProduct = products[index % products.length];

  return {
    id: (index + 1),
    code: `PRD-${(index + 1).toString().padStart(4, '0')}`,
    title: `${baseProduct.title} Vol. ${Math.floor(index / 5) + 1}`,
    category: baseProduct.cat,
    brand: baseProduct.brand,
    price: baseProduct.price,
    stock: Math.floor(Math.random() * 50) + 5,
    image: baseProduct.image,
  };
});

export default function Products() {
  const getStockStatus = (stock) => {
    if (stock <= 10) return { color: 'bg-red-500', text: 'text-red-600' };
    if (stock <= 25) return { color: 'bg-amber-400', text: 'text-amber-600' };
    return { color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  return (
    <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-8">
      <PageHeader title="Product Inventory" breadcrumb={["Dashboard", "Products"]}>
        <div className="flex gap-3">
          <Button type="secondary" className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <FaFileDownload className="mr-2" /> Export CSV
          </Button>
          <Button type="dark" className="shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
            + Add Product
          </Button>
        </div>
      </PageHeader>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-6 border border-white/50 transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-600 transition-colors" />
            <input
              placeholder="Cari produk..."
              className="pl-12 pr-4 py-3 bg-gray-50 rounded-2xl w-full outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-300 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-2xl flex items-center gap-2">
              <FaBox className="text-slate-500" />
              <span className="font-medium">30</span> products
            </div>
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" title="In Stock"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400" title="Low Stock"></span>
              <span className="w-3 h-3 rounded-full bg-red-500" title="Out of Stock"></span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {productsData.map(p => {
                const stockStatus = getStockStatus(p.stock);
                return (
                  <tr 
                    key={p.id} 
                    className="border-b border-gray-50 hover:bg-slate-50 transition-all duration-200 group relative"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl shadow-sm">
                          {p.image}
                        </div>
                        <div>
                          <Link 
                            to={`/products/${p.id}`} 
                            className="font-bold text-slate-700 hover:text-blue-600 transition-colors block"
                          >
                            {p.title}
                          </Link>
                          <span className="text-xs text-gray-400 font-mono">{p.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge type="primary">
                        {p.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.brand}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      Rp {p.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`font-semibold ${stockStatus.text}`}>
                          {p.stock} pcs
                        </span>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${stockStatus.color}`} 
                            style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                          <FaEllipsisV className="text-gray-400 group-hover/btn:text-slate-600 transition-colors" />
                        </button>
                        {/* Quick actions */}
                        <div className="absolute right-0 mt-8 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2">
                            <FaEye className="text-gray-400" /> View Details
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2">
                            <FaEdit className="text-gray-400" /> Edit Product
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <FaTrash className="text-red-400" /> Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}