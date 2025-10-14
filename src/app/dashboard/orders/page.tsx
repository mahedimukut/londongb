"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  MapPin,
  Package,
  CreditCard,
  User,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  IndianRupee,
  Smartphone,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

// Types
interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ url: string }>;
  };
}

interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface GuestShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentMethod:
    | "CARD"
    | "BKASH"
    | "NAGAD"
    | "ROCKET"
    | "BANK_TRANSFER"
    | "CASH_ON_DELIVERY";
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
  guestShippingAddress: GuestShippingAddress | null;
  guestEmail?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  // bKash fields
  bkashNumber?: string;
  bkashReference?: string;
  bkashTransaction?: string;
}

interface OrdersResponse {
  orders: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    search?: string;
    status?: string;
    paymentMethod?: string;
    isAdmin: boolean;
  };
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper function to get customer info
const getCustomerInfo = (order: Order) => {
  if (order.shippingAddress) {
    return {
      name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      phone: order.shippingAddress.phone,
      isGuest: false,
    };
  } else if (order.guestShippingAddress) {
    return {
      name: `${order.guestShippingAddress.firstName} ${order.guestShippingAddress.lastName}`,
      city: order.guestShippingAddress.city,
      state: order.guestShippingAddress.state,
      phone: order.guestShippingAddress.phone,
      isGuest: true,
    };
  } else {
    return {
      name: "Unknown Customer",
      city: "Unknown",
      state: "Unknown",
      phone: "Unknown",
      isGuest: false,
    };
  }
};

// Helper function to get shipping address
const getShippingAddress = (order: Order) => {
  if (order.shippingAddress) {
    return {
      street: order.shippingAddress.street,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      zipCode: order.shippingAddress.zipCode,
      country: order.shippingAddress.country,
      phone: order.shippingAddress.phone,
    };
  } else if (order.guestShippingAddress) {
    return {
      street: order.guestShippingAddress.street,
      city: order.guestShippingAddress.city,
      state: order.guestShippingAddress.state,
      zipCode: order.guestShippingAddress.postalCode,
      country: order.guestShippingAddress.country,
      phone: order.guestShippingAddress.phone,
    };
  } else {
    return {
      street: "Unknown",
      city: "Unknown",
      state: "Unknown",
      zipCode: "Unknown",
      country: "Unknown",
      phone: "Unknown",
    };
  }
};

// Helper function to format payment method
const formatPaymentMethod = (method: string) => {
  const methodMap: { [key: string]: string } = {
    CARD: "Credit Card",
    BKASH: "bKash",
    NAGAD: "Nagad",
    ROCKET: "Rocket",
    BANK_TRANSFER: "Bank Transfer",
    CASH_ON_DELIVERY: "Cash on Delivery",
  };
  return methodMap[method] || method.replace(/_/g, " ");
};

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

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPayment, setSelectedPayment] = useState("ALL");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ALL");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Build query params with pagination
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("search", searchTerm);
  if (selectedStatus !== "ALL") queryParams.append("status", selectedStatus);
  if (selectedPaymentMethod !== "ALL")
    queryParams.append("paymentMethod", selectedPaymentMethod);
  queryParams.append("page", currentPage.toString());
  queryParams.append("limit", itemsPerPage.toString());

  const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
    `/api/orders?${queryParams.toString()}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === "search") setSearchTerm(value);
    if (filterType === "status") setSelectedStatus(value);
    if (filterType === "payment") setSelectedPayment(value);
    if (filterType === "paymentMethod") setSelectedPaymentMethod(value);
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

  // Client-side payment status filtering
  const orders = data?.orders || [];
  const filteredOrders =
    selectedPayment !== "ALL"
      ? orders.filter((order) => order.paymentStatus === selectedPayment)
      : orders;

  const statusOptions = [
    {
      value: "PENDING",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: RefreshCw,
    },
    {
      value: "CONFIRMED",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800",
      icon: CheckCircle,
    },
    {
      value: "PROCESSING",
      label: "Processing",
      color: "bg-purple-100 text-purple-800",
      icon: Package,
    },
    {
      value: "SHIPPED",
      label: "Shipped",
      color: "bg-indigo-100 text-indigo-800",
      icon: Truck,
    },
    {
      value: "DELIVERED",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  ];

  const paymentStatusOptions = [
    {
      value: "PENDING",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "PROCESSING",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "COMPLETED",
      label: "Completed",
      color: "bg-green-100 text-green-800",
    },
    { value: "FAILED", label: "Failed", color: "bg-red-100 text-red-800" },
    {
      value: "REFUNDED",
      label: "Refunded",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const paymentMethodOptions = [
    { value: "ALL", label: "All Methods" },
    { value: "CARD", label: "Credit Card" },
    { value: "BKASH", label: "bKash" },
    { value: "NAGAD", label: "Nagad" },
    { value: "ROCKET", label: "Rocket" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
  ];

  const statuses = [{ value: "ALL", label: "All Statuses" }, ...statusOptions];
  const paymentStatuses = [
    { value: "ALL", label: "All Payments" },
    ...paymentStatusOptions,
  ];

  // Show cancel confirmation toast
  const showCancelConfirmation = (order: Order) => {
    setOrderToCancel(order);

    toast.info(
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cancel Order?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel order{" "}
              <strong>{order.orderNumber}</strong>? This action cannot be undone
              and stock will be restored.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleCancelConfirm(order.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Cancel Order
              </button>
              <button
                onClick={() => {
                  toast.dismiss();
                  setOrderToCancel(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                No, Keep Order
              </button>
            </div>
          </div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        style: {
          minWidth: "500px",
          backgroundColor: "white",
          color: "black",
        },
      }
    );
  };

  // Handle cancel confirmation
  const handleCancelConfirm = async (orderId: string) => {
    toast.dismiss(); // Dismiss the confirmation toast

    setIsUpdating(true);
    setUpdateError(null);

    const toastId = toast.loading("Cancelling order...");

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel order");
      }

      await mutate();
      setSelectedOrder(null);
      setOrderToCancel(null);

      toast.update(toastId, {
        render: "Order cancelled successfully! Stock has been restored.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      const errorMessage = error.message || "Failed to cancel order";
      setUpdateError(errorMessage);

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    setIsUpdating(true);
    setUpdateError(null);

    const toastId = toast.loading(
      `Updating order status to ${newStatus.toLowerCase()}...`
    );

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: selectedOrder?.paymentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      await mutate();

      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }

      toast.update(toastId, {
        render: `Order status updated to ${newStatus.toLowerCase()} successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Error updating order status:", error);
      const errorMessage = error.message || "Failed to update order status";
      setUpdateError(errorMessage);

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (
    orderId: string,
    newPaymentStatus: Order["paymentStatus"]
  ) => {
    setIsUpdating(true);
    setUpdateError(null);

    const toastId = toast.loading(
      `Updating payment status to ${newPaymentStatus.toLowerCase()}...`
    );

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus,
          status: selectedOrder?.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update payment status");
      }

      await mutate();

      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, paymentStatus: newPaymentStatus } : null
        );
      }

      toast.update(toastId, {
        render: `Payment status updated to ${newPaymentStatus.toLowerCase()} successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Error updating payment status:", error);
      const errorMessage = error.message || "Failed to update payment status";
      setUpdateError(errorMessage);

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle data reload
  const handleReload = async () => {
    const toastId = toast.loading("Refreshing orders...");
    try {
      await mutate();
      toast.update(toastId, {
        render: "Orders refreshed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to refresh orders",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const filteredAndSortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case "orderNumber":
        aValue = a.orderNumber;
        bValue = b.orderNumber;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "total":
        aValue = a.total;
        bValue = b.total;
        break;
      case "customer":
        const customerA = getCustomerInfo(a);
        const customerB = getCustomerInfo(b);
        aValue = customerA.name;
        bValue = customerB.name;
        break;
      default:
        aValue = a[sortField as keyof Order];
        bValue = b[sortField as keyof Order];
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field)
      return <ChevronDown className="w-4 h-4 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

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

  if (error) {
    toast.error("Failed to load orders");
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load orders</p>
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
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">
            {isLoading
              ? "Loading..."
              : `Showing ${filteredAndSortedOrders.length} of ${
                  data?.meta.total || 0
                } orders`}
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

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders, customers, products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
              value={searchTerm}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
            value={selectedStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
            value={selectedPayment}
            onChange={(e) => handleFilterChange("payment", e.target.value)}
          >
            {paymentStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
            value={selectedPaymentMethod}
            onChange={(e) =>
              handleFilterChange("paymentMethod", e.target.value)
            }
          >
            {paymentMethodOptions.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {updateError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800">{updateError}</span>
            <button
              onClick={() => setUpdateError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("orderNumber")}
                >
                  <div className="flex items-center">
                    Order ID
                    <SortIcon field="orderNumber" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center">
                    Customer
                    <SortIcon field="customer" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center">
                    Amount
                    <SortIcon field="total" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment Method
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-primary-600" />
                      <span className="ml-2 text-gray-600">
                        Loading orders...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ||
                      selectedStatus !== "ALL" ||
                      selectedPayment !== "ALL" ||
                      selectedPaymentMethod !== "ALL"
                        ? "No orders match your filters"
                        : "No orders found"}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map((order) => {
                  const customer = getCustomerInfo(order);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.name}
                          {customer.isGuest && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Guest
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.city}, {customer.state}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPaymentMethod(order.paymentMethod)}
                        </div>
                        {order.paymentMethod === "BKASH" &&
                          order.bkashReference && (
                            <div className="text-xs text-blue-600 font-mono">
                              Ref: {order.bkashReference}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusOptions.find((s) => s.value === order.status)
                              ?.color || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0) +
                            order.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            paymentStatusOptions.find(
                              (p) => p.value === order.paymentStatus
                            )?.color || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.paymentStatus.charAt(0) +
                            order.paymentStatus.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center text-brand-primary-600 hover:text-brand-primary-900"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.meta && (
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.pages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={data.meta.total}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order {selectedOrder.orderNumber}
                </h2>
                <p className="text-gray-600">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
                <p className="text-sm text-gray-500">
                  Payment Method:{" "}
                  {formatPaymentMethod(selectedOrder.paymentMethod)}
                </p>
                {selectedOrder.guestShippingAddress && (
                  <p className="text-sm text-blue-600 font-medium">
                    Guest Order
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setUpdateError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Error Display */}
              {updateError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-800">{updateError}</span>
                  </div>
                </div>
              )}

              {/* bKash Payment Details */}
              {selectedOrder.paymentMethod === "BKASH" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-800">
                    <Smartphone className="w-5 h-5 mr-2" />
                    bKash Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        bKash Number
                      </label>
                      <p className="text-blue-900 font-mono bg-blue-100 px-3 py-2 rounded border">
                        {selectedOrder.bkashNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Reference Number
                      </label>
                      <p className="text-blue-900 font-mono bg-blue-100 px-3 py-2 rounded border">
                        {selectedOrder.bkashReference || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Transaction ID
                      </label>
                      <p className="text-blue-900 font-mono bg-blue-100 px-3 py-2 rounded border">
                        {selectedOrder.bkashTransaction || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {!selectedOrder.bkashTransaction && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800 text-sm">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Transaction ID not verified. Please check bKash account
                        for reference number:{" "}
                        <strong>{selectedOrder.bkashReference}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Order Status & Payment Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Status
                  </h3>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() =>
                          updateOrderStatus(
                            selectedOrder.id,
                            status.value as Order["status"]
                          )
                        }
                        disabled={
                          isUpdating || selectedOrder.status === status.value
                        }
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          selectedOrder.status === status.value
                            ? "border-brand-primary-500 bg-brand-primary-50 text-brand-primary-700"
                            : "border-gray-200 hover:bg-gray-50"
                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className="font-medium">{status.label}</span>
                        {selectedOrder.status === status.value && (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        {isUpdating &&
                          selectedOrder.status === status.value && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Status
                  </h3>
                  <div className="space-y-2">
                    {paymentStatusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() =>
                          updatePaymentStatus(
                            selectedOrder.id,
                            status.value as Order["paymentStatus"]
                          )
                        }
                        disabled={
                          isUpdating ||
                          selectedOrder.paymentStatus === status.value
                        }
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          selectedOrder.paymentStatus === status.value
                            ? "border-brand-primary-500 bg-brand-primary-50 text-brand-primary-700"
                            : "border-gray-200 hover:bg-gray-50"
                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className="font-medium">{status.label}</span>
                        {selectedOrder.paymentStatus === status.value && (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        {isUpdating &&
                          selectedOrder.paymentStatus === status.value && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Product Image with Link */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          target="_blank"
                          className="flex-shrink-0"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                            {item.product.images &&
                            item.product.images.length > 0 ? (
                              <Image
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${item.product.slug}`}
                            target="_blank"
                            className="font-medium text-gray-900 hover:text-brand-primary-600 truncate block"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} • {formatCurrency(item.price)}
                            {item.color && ` • ${item.color}`}
                            {item.size && ` • ${item.size}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Product ID: {item.productId}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">
                      {getCustomerInfo(selectedOrder).name}
                    </p>
                    <p className="text-gray-600">
                      {getCustomerInfo(selectedOrder).phone}
                    </p>
                    {selectedOrder.user && (
                      <p className="text-sm text-gray-500 mt-1">
                        User: {selectedOrder.user.email}
                      </p>
                    )}
                    {selectedOrder.guestEmail && (
                      <p className="text-sm text-blue-600 mt-1">
                        Guest Email: {selectedOrder.guestEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{getShippingAddress(selectedOrder).street}</p>
                    <p>
                      {getShippingAddress(selectedOrder).city},{" "}
                      {getShippingAddress(selectedOrder).state}{" "}
                      {getShippingAddress(selectedOrder).zipCode}
                    </p>
                    <p>{getShippingAddress(selectedOrder).country}</p>
                    <p className="text-gray-600 mt-1">
                      Phone: {getShippingAddress(selectedOrder).phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  ৳ Order Summary
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Cancel Order Button */}
              {selectedOrder.status !== "CANCELLED" && (
                <div className="border-t pt-4">
                  <button
                    onClick={() => showCancelConfirmation(selectedOrder)}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span>Cancel Order</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
