"use client";
import { useEffect, useState } from "react";
import { getStore, type Store, type Product } from "@/lib/store";
import { ShoppingCart, ArrowLeft, Plus, Minus, Trash2, X } from "lucide-react";
import Link from "next/link";

export default function StorePreview() {
  const [store, setStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const s = getStore();
    setStore(s);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) => (c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.product.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No store found. Create one first!</p>
          <Link href="/" className="mt-4 inline-block rounded-xl gradient-primary px-6 py-3 text-white font-semibold">
            Create Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <img src={store.logo} alt={store.name} className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-bold text-gray-900">{store.name}</span>
            </div>
          </div>
          <button onClick={() => setShowCart(true)} className="relative rounded-xl bg-gray-100 p-2.5 text-gray-600 hover:bg-gray-200">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">{store.name}</h1>
          <p className="mt-4 text-lg text-gray-500">{store.description || store.category}</p>
          <p className="mt-2 text-sm text-primary font-medium">{store.products.length} products available</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Products</h2>
        {store.products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">No products yet. Add some from the dashboard!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {store.products.map((product) => (
              <div key={product.id} className="group rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">No Image</div>
                  )}
                  {product.inventory < 10 && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white uppercase">
                      Low Stock
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-primary uppercase">{product.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:scale-105"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)}></div>
          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold">Shopping Cart ({cartCount})</h3>
              <button onClick={() => setShowCart(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 mt-8">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 rounded-xl border border-gray-100 p-3">
                    <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.product.name}</p>
                      <p className="text-sm text-primary font-semibold">${item.product.price.toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full rounded-xl gradient-primary py-3 text-white font-semibold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-gray-200 bg-white py-8 text-center">
        <p className="text-sm text-gray-400">Powered by Alippo AI Co-founder</p>
      </footer>
    </div>
  );
}
