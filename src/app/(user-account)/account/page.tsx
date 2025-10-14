"use client";

import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
}

interface Address {
  id: string;
  isDefault: boolean;
}

export default function AccountOverview() {
  const { state } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await fetch("/api/orders");
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData.orders || []);
        }

        // Fetch addresses
        const addressesResponse = await fetch("/api/addresses");
        if (addressesResponse.ok) {
          const addressesData = await addressesResponse.json();
          setAddresses(addressesData.addresses || []);
        }

        // Generate recent activity based on actual data
        const activity = [];

        // Add recent orders to activity
        const recentOrders = orders.slice(0, 2).map((order) => ({
          type: "order",
          message: `Order #${order.orderNumber} ${getOrderStatusText(
            order.status
          )}`,
          timestamp: new Date(order.createdAt),
          icon: Package,
        }));

        // Add wishlist activity if there are items
        if (state.wishlist.length > 0) {
          const recentWishlistItem = state.wishlist[0];
          activity.push({
            type: "wishlist",
            message: "Added item to wishlist",
            timestamp: new Date(recentWishlistItem.addedAt),
            icon: Heart,
          });
        }

        // Sort by timestamp and take latest 2
        const sortedActivity = [...recentOrders, ...activity]
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, 2);

        setRecentActivity(sortedActivity);
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [state.wishlist]);

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "placed";
      case "CONFIRMED":
        return "confirmed";
      case "PROCESSING":
        return "is processing";
      case "SHIPPED":
        return "shipped";
      case "DELIVERED":
        return "delivered";
      case "CANCELLED":
        return "cancelled";
      default:
        return "updated";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - timestamp.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
          Account Overview
        </h2>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
        Account Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Personal Info Card */}
        <div className="bg-brand-primary-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-brand-primary-600" />
            <h3 className="text-lg font-semibold text-brand-neutral-900">
              Personal Information
            </h3>
          </div>
          <p className="text-brand-neutral-600 mb-4">
            Manage your personal details and contact information
          </p>
          <Link
            href="/settings"
            className="text-brand-primary-600 hover:text-brand-primary-700 font-medium text-sm"
          >
            Edit Information →
          </Link>
        </div>

        {/* Address Card */}
        <div className="bg-brand-primary-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-brand-primary-600" />
            <h3 className="text-lg font-semibold text-brand-neutral-900">
              Address Book
            </h3>
          </div>
          <p className="text-brand-neutral-600 mb-4">
            {addresses.length > 0
              ? `You have ${addresses.length} saved address${
                  addresses.length !== 1 ? "es" : ""
                }`
              : "No saved addresses yet"}
          </p>
          <Link
            href="/settings"
            className="text-brand-primary-600 hover:text-brand-primary-700 font-medium text-sm"
          >
            {addresses.length > 0 ? "Manage Addresses" : "Add Address"} →
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/orders"
          className="bg-white border border-brand-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-brand-primary-600" />
            <span className="text-sm font-medium text-brand-neutral-600">
              Orders
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-neutral-900 group-hover:text-brand-primary-600 transition-colors">
            {orders.length}
          </p>
          <p className="text-sm text-brand-neutral-500">
            {orders.length === 1 ? "Recent order" : "Recent orders"}
          </p>
        </Link>

        <Link
          href="/wishlist"
          className="bg-white border border-brand-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-brand-primary-600" />
            <span className="text-sm font-medium text-brand-neutral-600">
              Wishlist
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-neutral-900 group-hover:text-brand-primary-600 transition-colors">
            {state.wishlistCount}
          </p>
          <p className="text-sm text-brand-neutral-500">
            {state.wishlistCount === 1 ? "Saved item" : "Saved items"}
          </p>
        </Link>

        <div className="bg-white border border-brand-neutral-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-brand-primary-600" />
            <span className="text-sm font-medium text-brand-neutral-600">
              Cart Items
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-neutral-900">
            {state.cartCount}
          </p>
          <p className="text-sm text-brand-neutral-500">
            {state.cartCount === 1 ? "Item in cart" : "Items in cart"}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4">
          Recent Activity
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-brand-neutral-50 rounded-lg"
                >
                  <IconComponent className="w-4 h-4 text-brand-primary-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-neutral-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-brand-neutral-500">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-brand-neutral-50 rounded-lg">
            <Package className="w-8 h-8 text-brand-neutral-300 mx-auto mb-2" />
            <p className="text-brand-neutral-500 text-sm">No recent activity</p>
            <p className="text-brand-neutral-400 text-xs mt-1">
              Your recent orders and activities will appear here
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-brand-neutral-200">
        <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/shop"
            className="bg-brand-primary-600 text-white text-center py-3 px-4 rounded-lg hover:bg-brand-primary-700 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="bg-white border border-brand-neutral-300 text-center py-3 px-4 rounded-lg hover:bg-brand-neutral-50 transition-colors font-medium"
          >
            View Orders
          </Link>
          <Link
            href="/wishlist"
            className="bg-white border border-brand-neutral-300 text-center py-3 px-4 rounded-lg hover:bg-brand-neutral-50 transition-colors font-medium"
          >
            View Wishlist
          </Link>
          <Link
            href="/settings"
            className="bg-white border border-brand-neutral-300 text-center py-3 px-4 rounded-lg hover:bg-brand-neutral-50 transition-colors font-medium"
          >
            Account Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
