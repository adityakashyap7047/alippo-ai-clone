"use client";
import AnalyticsCards from "@/components/AnalyticsCards";
import { getStore, generateSampleData } from "@/lib/store";
import { useEffect, useState } from "react";
import { Sparkles, ShoppingCart, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const store = getStore();
    if (store && store.products.length === 0) {
      generateSampleData();
    }
    setHasData(true);
  }, []);

  if (!hasData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here is your store overview.</p>
        </div>
      </div>

      <AnalyticsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-primary/10 p-2"><Sparkles className="h-5 w-5 text-primary" /></div>
            <h3 className="font-semibold text-gray-900">AI Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-3">
              <p className="text-sm font-medium text-yellow-800">Cart Recovery Alert</p>
              <p className="text-xs text-yellow-600 mt-1">3 customers abandoned their carts today. Send a recovery email to boost conversions.</p>
            </div>
            <div className="rounded-lg bg-green-50 border border-green-100 p-3">
              <p className="text-sm font-medium text-green-800">Sales Trend Up</p>
              <p className="text-xs text-green-600 mt-1">Your sales are up 12% this week. Consider launching a flash sale to capitalize on momentum.</p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
              <p className="text-sm font-medium text-blue-800">Marketing Tip</p>
              <p className="text-xs text-blue-600 mt-1">Add customer reviews to your product pages to increase trust and conversions.</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/products" className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 transition-all hover:border-primary hover:bg-primary/5">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-gray-700">Manage Products</span>
            </Link>
            <Link href="/dashboard/orders" className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 transition-all hover:border-primary hover:bg-primary/5">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-gray-700">View Orders</span>
            </Link>
            <Link href="/dashboard/ai-cofounder" className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 transition-all hover:border-primary hover:bg-primary/5">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-gray-700">AI Co-founder</span>
            </Link>
            <Link href="/store/preview" className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 transition-all hover:border-primary hover:bg-primary/5">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-gray-700">View Store</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
