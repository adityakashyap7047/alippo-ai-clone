"use client";
import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, XCircle, Eye } from "lucide-react";
import { getStore, updateOrderStatus, type Order } from "@/lib/store";

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-50", icon: Package },
  shipped: { label: "Shipped", color: "text-blue-600 bg-blue-50", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-600 bg-green-50", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-600 bg-red-50", icon: XCircle },
};

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const store = getStore();
    if (store) setOrders(store.orders);
  };

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
    loadOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <div className="flex gap-2">
          {["all", "pending", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all capitalize ${
                filter === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${selectedOrder ? "lg:col-span-2" : "lg:col-span-3"} space-y-3`}>
          {filtered.map((order) => {
            const sc = statusConfig[order.status];
            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                  selectedOrder?.id === order.id ? "border-primary ring-1 ring-primary" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-2 ${sc.color.split(" ")[1]}`}>
                      <sc.icon className={`h-5 w-5 ${sc.color.split(" ")[0]}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">#{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customerName} &middot; {order.products.length} item(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No orders found</p>
            </div>
          )}
        </div>

        {selectedOrder && (
          <div className="animate-slide-up rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><XCircle className="h-5 w-5" /></button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Items</p>
                {selectedOrder.products.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 text-sm">
                    <span className="text-gray-700">{item.name} x{item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-gray-100 pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "shipped", "delivered", "cancelled"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedOrder.id, s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                        selectedOrder.status === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
