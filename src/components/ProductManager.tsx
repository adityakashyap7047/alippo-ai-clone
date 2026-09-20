"use client";
import { useEffect, useState } from "react";
import { Trash2, Edit, Plus, Search, Package } from "lucide-react";
import { getStore, addProduct, updateProduct, deleteProduct, type Product } from "@/lib/store";

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", price: "", image: "", description: "", category: "", inventory: "" });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const store = getStore();
    if (store) setProducts(store.products);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateProduct(editId, {
        name: form.name,
        price: parseFloat(form.price),
        image: form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        description: form.description,
        category: form.category,
        inventory: parseInt(form.inventory),
      });
    } else {
      addProduct({
        name: form.name,
        price: parseFloat(form.price),
        image: form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        description: form.description,
        category: form.category,
        inventory: parseInt(form.inventory),
      });
    }
    setForm({ name: "", price: "", image: "", description: "", category: "", inventory: "" });
    setEditId(null);
    setShowForm(false);
    loadProducts();
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, price: p.price.toString(), image: p.image, description: p.description, category: p.category, inventory: p.inventory.toString() });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this product?")) {
      deleteProduct(id);
      loadProducts();
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", price: "", image: "", description: "", category: "", inventory: "" }); }}
          className="flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="animate-slide-up rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editId ? "Edit Product" : "Add Product"}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="Inventory" type="number" value={form.inventory} onChange={(e) => setForm({ ...form, inventory: e.target.value })} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105">{editId ? "Update" : "Add"} Product</button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="group rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="relative h-48 bg-gray-100">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center"><Package className="h-12 w-12 text-gray-300" /></div>
              )}
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => handleEdit(p)} className="rounded-lg bg-white p-2 shadow-sm hover:bg-gray-50"><Edit className="h-4 w-4 text-gray-600" /></button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg bg-white p-2 shadow-sm hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-500" /></button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-primary">{p.category || "Uncategorized"}</p>
              <h3 className="mt-1 font-semibold text-gray-900">{p.name}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">${p.price.toFixed(2)}</span>
                <span className="text-xs text-gray-500">{p.inventory} in stock</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">{search ? "No products found" : "No products yet. Add your first product!"}</p>
        </div>
      )}
    </div>
  );
}
