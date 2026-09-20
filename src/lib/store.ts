export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  inventory: number;
  sales: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logo: string;
  products: Product[];
  orders: Order[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

const STORE_KEY = "alippo_store";

export function getStore(): Store | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveStore(store: Store): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function createStore(name: string, category: string, description: string): Store {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const store: Store = {
    id: Date.now().toString(),
    name,
    slug,
    category,
    description,
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C5CE7&color=fff&size=128`,
    products: [],
    orders: [],
    createdAt: new Date().toISOString(),
  };
  saveStore(store);
  return store;
}

export function addProduct(product: Omit<Product, "id" | "sales" | "createdAt">): Product {
  const store = getStore();
  if (!store) throw new Error("No store found");
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    sales: 0,
    createdAt: new Date().toISOString(),
  };
  store.products.push(newProduct);
  saveStore(store);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const store = getStore();
  if (!store) return;
  store.products = store.products.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveStore(store);
}

export function deleteProduct(id: string): void {
  const store = getStore();
  if (!store) return;
  store.products = store.products.filter((p) => p.id !== id);
  saveStore(store);
}

export function addOrder(order: Omit<Order, "id" | "createdAt">): Order {
  const store = getStore();
  if (!store) throw new Error("No store found");
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  store.orders.push(newOrder);
  saveStore(store);
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order["status"]): void {
  const store = getStore();
  if (!store) return;
  store.orders = store.orders.map((o) => (o.id === id ? { ...o, status } : o));
  saveStore(store);
}

export function getAnalytics() {
  const store = getStore();
  if (!store) return null;
  const totalRevenue = store.orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = store.orders.length;
  const totalProducts = store.products.length;
  const totalSales = store.products.reduce((sum, p) => sum + p.sales, 0);
  const pendingOrders = store.orders.filter((o) => o.status === "pending").length;
  return { totalRevenue, totalOrders, totalProducts, totalSales, pendingOrders };
}

export function generateSampleData(): void {
  const store = getStore();
  if (!store) return;

  const sampleProducts: Product[] = [
    { id: "1", name: "Wireless Earbuds Pro", price: 49.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=300&h=300&fit=crop", description: "Premium wireless earbuds with noise cancellation", category: "Electronics", inventory: 150, sales: 234, createdAt: new Date().toISOString() },
    { id: "2", name: "Organic Cotton T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", description: "Soft organic cotton t-shirt in multiple colors", category: "Clothing", inventory: 200, sales: 189, createdAt: new Date().toISOString() },
    { id: "3", name: "Smart Water Bottle", price: 34.99, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop", description: "Temperature tracking smart water bottle", category: "Accessories", inventory: 80, sales: 156, createdAt: new Date().toISOString() },
    { id: "4", name: "Minimalist Watch", price: 89.99, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop", description: "Elegant minimalist analog watch", category: "Accessories", inventory: 60, sales: 98, createdAt: new Date().toISOString() },
    { id: "5", name: "Portable Charger 20K", price: 39.99, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop", description: "High capacity portable power bank", category: "Electronics", inventory: 120, sales: 278, createdAt: new Date().toISOString() },
    { id: "6", name: "Leather Journal", price: 24.99, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=300&fit=crop", description: "Handcrafted genuine leather journal", category: "Stationery", inventory: 90, sales: 145, createdAt: new Date().toISOString() },
  ];

  const sampleOrders: Order[] = [
    { id: "101", customerName: "Sarah Johnson", customerEmail: "sarah@example.com", products: [{ productId: "1", name: "Wireless Earbuds Pro", quantity: 1, price: 49.99 }], total: 49.99, status: "delivered", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "102", customerName: "Mike Chen", customerEmail: "mike@example.com", products: [{ productId: "2", name: "Organic Cotton T-Shirt", quantity: 2, price: 29.99 }], total: 59.98, status: "shipped", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "103", customerName: "Emma Wilson", customerEmail: "emma@example.com", products: [{ productId: "3", name: "Smart Water Bottle", quantity: 1, price: 34.99 }, { productId: "5", name: "Portable Charger 20K", quantity: 1, price: 39.99 }], total: 74.98, status: "pending", createdAt: new Date().toISOString() },
    { id: "104", customerName: "James Brown", customerEmail: "james@example.com", products: [{ productId: "4", name: "Minimalist Watch", quantity: 1, price: 89.99 }], total: 89.99, status: "pending", createdAt: new Date().toISOString() },
    { id: "105", customerName: "Lisa Davis", customerEmail: "lisa@example.com", products: [{ productId: "6", name: "Leather Journal", quantity: 3, price: 24.99 }], total: 74.97, status: "delivered", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  ];

  store.products = sampleProducts;
  store.orders = sampleOrders;
  saveStore(store);
}
