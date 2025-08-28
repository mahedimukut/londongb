// app/(user-account)/page.tsx
"use client";

import { User, Package, Heart, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";

export default function AccountOverview() {
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
            Manage your shipping addresses
          </p>
          <Link
            href="/settings"
            className="text-brand-primary-600 hover:text-brand-primary-700 font-medium text-sm"
          >
            Manage Addresses →
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/orders"
          className="bg-white border border-brand-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-brand-primary-600" />
            <span className="text-sm font-medium text-brand-neutral-600">
              Orders
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-neutral-900">5</p>
          <p className="text-sm text-brand-neutral-500">Recent orders</p>
        </Link>

        <Link
          href="/wishlist"
          className="bg-white border border-brand-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-brand-primary-600" />
            <span className="text-sm font-medium text-brand-neutral-600">
              Wishlist
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-neutral-900">12</p>
          <p className="text-sm text-brand-neutral-500">Saved items</p>
        </Link>

        <div className="bg-white border border-brand-neutral-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-brand-primary-600" />
            <span className="text-sm font-medium text-brand-neutral-600">
              Payment Methods
            </span>
          </div>
          <p className="text-2xl font-bold text-brand-neutral-900">2</p>
          <p className="text-sm text-brand-neutral-500">Saved cards</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-brand-neutral-50 rounded-lg">
            <Package className="w-4 h-4 text-brand-primary-600" />
            <div>
              <p className="text-sm font-medium text-brand-neutral-900">
                Order #12345 shipped
              </p>
              <p className="text-xs text-brand-neutral-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-brand-neutral-50 rounded-lg">
            <Heart className="w-4 h-4 text-brand-primary-600" />
            <div>
              <p className="text-sm font-medium text-brand-neutral-900">
                Added item to wishlist
              </p>
              <p className="text-xs text-brand-neutral-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
