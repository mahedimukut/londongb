// dashboard/wishlists/page.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  Search,
  Heart,
  User,
  Package,
  DollarSign,
  Eye,
  Loader2,
  Filter,
  Mail,
  Calendar,
} from "lucide-react";

// Types
interface WishlistProduct {
  id: string;
  productId: string;
  productName: string;
  price: number;
  image?: string;
}

interface Wishlist {
  id: string;
  customer: string;
  email: string;
  image?: string;
  items: number;
  totalValue: number;
  created: string;
  lastUpdated: string;
  products: WishlistProduct[];
}

interface WishlistsResponse {
  wishlists: Wishlist[];
  stats: {
    totalWishlists: number;
    totalItems: number;
    totalValue: number;
    avgItems: number;
    activeUsers: number;
  };
}

// Skeleton Loading Component
const WishlistSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
    </td>
  </tr>
);

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WishlistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(
    null
  );

  // Build query params
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("search", searchTerm);

  const { data, error, isLoading, mutate } = useSWR<WishlistsResponse>(
    `/api/wishlist/admin?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  const wishlists = data?.wishlists || [];
  const stats = data?.stats;

  // Filter wishlists based on search
  const filteredWishlists = wishlists.filter(
    (wishlist) =>
      wishlist.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  // Function to get user initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewWishlist = (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load wishlists</p>
          <button
            onClick={() => mutate()}
            className="mt-4 px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Wishlists</h1>
        <p className="text-gray-600">
          {isLoading
            ? "Loading wishlist data..."
            : `Managing ${stats?.totalWishlists || 0} customer wishlists with ${
                stats?.totalItems || 0
              } total items`}
        </p>
      </div>

      {/* Stats Cards */}
      {!isLoading && stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-pink-50">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Wishlists
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalWishlists}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.activeUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Items</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.avgItems}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Auto-refresh every 30s</span>
          </div>
        </div>
      </div>

      {/* Wishlists table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items & Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: 5 }).map((_, index) => (
                  <WishlistSkeleton key={index} />
                ))
              ) : filteredWishlists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm
                        ? "No wishlists match your search"
                        : "No wishlists found"}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWishlists.map((wishlist) => (
                  <tr key={wishlist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* User Image with Fallback */}
                        {wishlist.image ? (
                          <Image
                            src={wishlist.image}
                            alt={wishlist.customer}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(wishlist.customer)}
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">
                            {wishlist.customer}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-3 h-3 mr-1" />
                            {wishlist.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Package className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">
                            {wishlist.items} items
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                          {formatCurrency(wishlist.totalValue)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(wishlist.created)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(wishlist.lastUpdated)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewWishlist(wishlist)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-brand-primary-700 bg-brand-primary-100 hover:bg-brand-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary footer */}
      {!isLoading && stats && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              <span>
                Showing {filteredWishlists.length} of {stats.totalWishlists}{" "}
                wishlists
                {searchTerm && " (filtered)"}
              </span>
            </div>
            <div>
              {stats.totalItems} total items •{" "}
              {formatCurrency(stats.totalValue)} total value
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Details Modal */}
      {selectedWishlist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedWishlist.customer}'s Wishlist
                </h2>
                <p className="text-gray-600">{selectedWishlist.email}</p>
              </div>
              <button
                onClick={() => setSelectedWishlist(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Loader2 className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Total Items
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedWishlist.items}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedWishlist.totalValue)}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Wishlist Items</h3>
              <div className="space-y-3">
                {selectedWishlist.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.productName}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setSelectedWishlist(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
