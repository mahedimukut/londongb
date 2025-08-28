// app/(user-account)/orders/page.tsx
"use client";

import { Package, Search, Calendar, Truck, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: "12345",
      date: "2023-12-01",
      status: "delivered",
      items: 3,
      total: 17497,
      tracking: "TRK123456789",
    },
    {
      id: "12346",
      date: "2023-11-25",
      status: "shipped",
      items: 2,
      total: 8999,
      tracking: "TRK987654321",
    },
    {
      id: "12347",
      date: "2023-11-20",
      status: "processing",
      items: 1,
      total: 2499,
      tracking: null,
    },
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-600" />;
      default:
        return <Package className="w-5 h-5 text-brand-neutral-400" />;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-neutral-900">My Orders</h2>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-neutral-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
            />
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-brand-neutral-300" />
          <h3 className="mt-4 text-lg font-medium text-brand-neutral-900">
            No orders yet
          </h3>
          <p className="mt-2 text-brand-neutral-500">
            Start shopping to see your orders here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-brand-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-medium text-brand-neutral-900">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-brand-neutral-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-neutral-900">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-sm text-brand-neutral-500">
                    {order.items} {order.items === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-brand-neutral-100 text-brand-neutral-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>

                <div className="flex items-center gap-3">
                  <button className="text-brand-primary-600 hover:text-brand-primary-700 font-medium text-sm">
                    View Details
                  </button>
                  {order.tracking && (
                    <button className="text-brand-neutral-600 hover:text-brand-neutral-700 font-medium text-sm">
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
