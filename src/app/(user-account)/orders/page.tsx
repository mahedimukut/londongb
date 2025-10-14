// app/(user-account)/orders/page.tsx
"use client";

import {
  Package,
  Search,
  Calendar,
  Truck,
  CheckCircle,
  Loader2,
  X,
  MapPin,
  Ban,
  Filter,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OrderItem {
  id: string;
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

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  // Fetch orders with search and filter
  const fetchOrders = useCallback(async (search = "", status = "") => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (status && status !== "ALL") queryParams.append("status", status);

      const response = await fetch(`/api/orders?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);

        // Show toast when search/filter returns results
        if ((search || status !== "ALL") && data.orders.length > 0) {
          toast.info(
            `Found ${data.orders.length} orders matching your criteria`,
            {
              position: "bottom-right",
              autoClose: 3000,
            }
          );
        }
      } else {
        console.error("Failed to fetch orders");
        toast.error("Failed to load orders", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle search with proper debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || statusFilter !== "ALL") {
        fetchOrders(searchTerm, statusFilter);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, fetchOrders]);

  // Handle status filter change - fetch immediately
  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    fetchOrders(searchTerm, newStatus);
  };

  // Handle search input change - just update state, debounce will handle the fetch
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "SHIPPED":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "CONFIRMED":
      case "PROCESSING":
        return <Package className="w-5 h-5 text-orange-600" />;
      case "CANCELLED":
        return <Ban className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-brand-neutral-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "CONFIRMED":
        return "Confirmed";
      case "PROCESSING":
        return "Processing";
      case "SHIPPED":
        return "Shipped";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      case "REFUNDED":
        return "Refunded";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "CONFIRMED":
      case "PROCESSING":
        return "bg-orange-100 text-orange-800";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-brand-neutral-100 text-brand-neutral-800";
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "BKASH":
        return "bKash";
      case "NAGAD":
        return "Nagad";
      case "ROCKET":
        return "Rocket";
      case "CARD":
        return "Credit/Debit Card";
      case "BANK_TRANSFER":
        return "Bank Transfer";
      case "CASH_ON_DELIVERY":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    // Use toast for confirmation instead of native confirm
    const toastId = toast.loading("Cancelling order...", {
      position: "bottom-right",
    });

    try {
      setIsCancelling(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "CANCELLED",
                  paymentStatus: data.order.paymentStatus,
                }
              : order
          )
        );

        toast.update(toastId, {
          render: "Order cancelled successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
        });

        // Close modal if open
        setShowOrderDetails(false);
      } else {
        const error = await response.json();
        toast.update(toastId, {
          render: error.message || "Failed to cancel order",
          type: "error",
          isLoading: false,
          autoClose: 4000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.update(toastId, {
        render: "Failed to cancel order. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        hideProgressBar: false,
      });
    } finally {
      setIsCancelling(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    fetchOrders();
    toast.info("Filters cleared", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Enhanced cancel confirmation with custom toast
  const confirmCancelOrder = (orderId: string, orderNumber: string) => {
    toast.info(
      <div className="p-2">
        <p className="font-semibold mb-2">Cancel Order #{orderNumber}?</p>
        <p className="text-sm mb-4">This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss();
              handleCancelOrder(orderId);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
          >
            Keep Order
          </button>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true,
      }
    );
  };

  if (isLoading && orders.length === 0) {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-brand-neutral-900">
            My Orders
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-brand-neutral-200">
              <h3 className="text-xl font-bold text-brand-neutral-900">
                Order Details - {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="p-2 hover:bg-brand-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-brand-neutral-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-brand-neutral-900 mb-3">
                    Order Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-neutral-600">
                        Order Number:
                      </span>
                      <span className="font-medium">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-neutral-600">
                        Order Date:
                      </span>
                      <span className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-neutral-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-neutral-600">
                        Payment Method:
                      </span>
                      <span className="font-medium">
                        {getPaymentMethodText(selectedOrder.paymentMethod)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-neutral-600">
                        Payment Status:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedOrder.paymentStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.paymentStatus === "PENDING"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-brand-neutral-900 mb-3">
                    Shipping Address
                  </h4>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-brand-neutral-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {selectedOrder.shippingAddress.firstName}{" "}
                        {selectedOrder.shippingAddress.lastName}
                      </p>
                      <p className="text-brand-neutral-600">
                        {selectedOrder.shippingAddress.street}
                      </p>
                      <p className="text-brand-neutral-600">
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state}{" "}
                        {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p className="text-brand-neutral-600">
                        {selectedOrder.shippingAddress.country}
                      </p>
                      <p className="text-brand-neutral-600">
                        {selectedOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-brand-neutral-900 mb-3">
                  Order Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 border border-brand-neutral-200 rounded-lg"
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-brand-neutral-100">
                        <Image
                          src={
                            item.product.images[0]?.url ||
                            "/placeholder-product.jpg"
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-medium text-brand-neutral-900 hover:text-brand-primary-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-4 mt-1 text-sm text-brand-neutral-600">
                          <span>Qty: {item.quantity}</span>
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-brand-neutral-500">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-brand-neutral-200 pt-4">
                <div className="max-w-xs ml-auto space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-neutral-600">Subtotal:</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-neutral-600">Discount:</span>
                      <span className="text-green-600">
                        -{formatPrice(selectedOrder.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-neutral-600">Shipping:</span>
                    <span>{formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-neutral-600">Tax:</span>
                    <span>{formatPrice(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-brand-neutral-200 pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Cancel Button in Modal */}
              {selectedOrder.status === "PENDING" && (
                <div className="border-t border-brand-neutral-200 pt-4">
                  <button
                    onClick={() =>
                      confirmCancelOrder(
                        selectedOrder.id,
                        selectedOrder.orderNumber
                      )
                    }
                    disabled={isCancelling === selectedOrder.id}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isCancelling === selectedOrder.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4" />
                        Cancel Order
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-neutral-900">My Orders</h2>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-neutral-400" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-neutral-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300 w-64"
            />
          </div>

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== "ALL") && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-brand-neutral-600 hover:text-brand-neutral-800 border border-brand-neutral-200 rounded-lg hover:bg-brand-neutral-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Show loading indicator only when searching/filtering and we already have orders */}
      {isLoading && orders.length > 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary-600" />
        </div>
      )}

      {orders.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-brand-neutral-300" />
          <h3 className="mt-4 text-lg font-medium text-brand-neutral-900">
            {searchTerm || statusFilter !== "ALL"
              ? "No orders found"
              : "No orders yet"}
          </h3>
          <p className="mt-2 text-brand-neutral-500">
            {searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search terms or filters"
              : "Start shopping to see your orders here"}
          </p>
          {!searchTerm && statusFilter === "ALL" && (
            <Link
              href="/shop"
              className="mt-4 inline-block px-6 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
            >
              Start Shopping
            </Link>
          )}
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
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-brand-neutral-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-neutral-900">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-sm text-brand-neutral-500">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>

                <div className="flex items-center gap-3">
                  {/* Cancel Button - Only show for pending orders */}
                  {order.status === "PENDING" && (
                    <button
                      onClick={() =>
                        confirmCancelOrder(order.id, order.orderNumber)
                      }
                      disabled={isCancelling === order.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                    >
                      {isCancelling === order.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <Ban className="w-3 h-3" />
                          Cancel
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-brand-primary-600 hover:text-brand-primary-700 font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
