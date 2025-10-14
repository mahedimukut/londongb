"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  Search,
  Mail,
  Phone,
  Eye,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  joined: string;
  lastOrder: string | null;
  emailVerified: boolean;
  reviews: number;
  status: "ACTIVE" | "INACTIVE";
}

interface CustomersResponse {
  customers: Customer[];
  meta: {
    total: number;
    search?: string;
    activeCustomers: number;
    totalRevenue: number;
  };
}

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  totalItems,
  itemsPerPage,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems: number;
  itemsPerPage: number;
}) => {
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
      </div>

      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-medium ${
              page === currentPage
                ? "bg-brand-primary-600 text-white border-brand-primary-600"
                : page === "..."
                ? "bg-white text-gray-500 border-gray-300 cursor-default"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
            }`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <span>Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-brand-primary-500 focus:border-brand-primary-500"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

// Skeleton Loading Component
const CustomerSkeleton = () => (
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
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </td>
  </tr>
);

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Build query params with pagination
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("search", searchTerm);
  queryParams.append("page", currentPage.toString());
  queryParams.append("limit", itemsPerPage.toString());

  const { data, error, isLoading, mutate } = useSWR<CustomersResponse>(
    `/api/customers?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
    }
  );

  const customers = data?.customers || [];
  const meta = data?.meta;

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === "search") setSearchTerm(value);
    if (filterType === "status") setStatusFilter(value);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Apply status filter
  const filteredCustomers = customers.filter(
    (customer) => statusFilter === "all" || customer.status === statusFilter
  );

  // Calculate pagination info
  const totalPages = meta ? Math.ceil(meta.total / itemsPerPage) : 0;

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

  // Handle data reload
  const handleReload = async () => {
    await mutate();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load customers</p>
          <button
            onClick={handleReload}
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
      {/* Page header with stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">
            {isLoading
              ? "Loading customer data..."
              : `Showing ${filteredCustomers.length} of ${
                  meta?.total || 0
                } customers`}
          </p>
        </div>
        <button
          onClick={handleReload}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      {!isLoading && meta && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">{meta.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {meta.activeCustomers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingBag className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(meta.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
              value={searchTerm}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
            value={statusFilter}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Auto-refresh every 30s</span>
          </div>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders & Spending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: 5 }).map((_, index) => (
                  <CustomerSkeleton key={index} />
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm || statusFilter !== "all"
                        ? "No customers match your filters"
                        : "No customers found"}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* User Image with Fallback */}
                        {customer.image ? (
                          <Image
                            src={customer.image}
                            alt={customer.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              // If image fails to load, hide the image element
                              e.currentTarget.style.display = "none";
                              // Show the fallback avatar
                              const fallback = e.currentTarget
                                .nextSibling as HTMLElement;
                              if (fallback) {
                                fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        {/* Fallback Avatar - Always rendered but hidden if image exists */}
                        <div
                          className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                            customer.image ? "hidden" : "flex"
                          }`}
                        >
                          {getInitials(customer.name)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">
                            {customer.name}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            {customer.reviews > 0 && (
                              <>
                                <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                <span>{customer.reviews} reviews</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span
                            className={
                              customer.emailVerified ? "" : "text-gray-400"
                            }
                          >
                            {customer.email}
                          </span>
                          {customer.emailVerified && (
                            <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <ShoppingBag className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">
                            {customer.totalOrders} orders
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          {formatCurrency(customer.totalSpent)}
                        </div>
                        {customer.totalOrders > 0 && (
                          <div className="text-xs text-gray-500">
                            Avg: {formatCurrency(customer.averageOrderValue)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(customer.joined)}
                        </div>
                        {customer.lastOrder && (
                          <div className="text-xs text-gray-500">
                            Last order: {formatDate(customer.lastOrder)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {customer.status === "ACTIVE" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {customer.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.total > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={meta.total}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* Summary footer */}
      {!isLoading && meta && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              <span>
                Showing {filteredCustomers.length} of {meta.total} customers
                {(searchTerm || statusFilter !== "all") && " (filtered)"}
              </span>
            </div>
            <div>
              Active: {meta.activeCustomers} | Inactive:{" "}
              {meta.total - meta.activeCustomers}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
