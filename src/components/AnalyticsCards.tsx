"use client";
import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Package, TrendingUp, Clock } from "lucide-react";
import { getAnalytics } from "@/lib/store";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalSales: number;
  pendingOrders: number;
}

export default function AnalyticsCards() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const data = getAnalytics();
    setAnalytics(data);
  }, []);

  if (!analytics) return null;

  const cards = [
    { label: "Total Revenue", value: `$${analytics.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Orders", value: analytics.totalOrders, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Products", value: analytics.totalProducts, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Items Sold", value: analytics.totalSales, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Pending Orders", value: analytics.pendingOrders, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`rounded-lg p-2.5 ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
