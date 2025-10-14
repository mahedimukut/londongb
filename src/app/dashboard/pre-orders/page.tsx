"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
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
  Clock,
  AlertTriangle,
  MessageCircle,
  DollarSign,
  CalendarDays,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Preorder Types based on your Prisma schema
interface Preorder {
  id: string;
  productName: string;
  productDescription: string;
  category: string;
  urgency: string;
  budget: string | null;
  quantity: number;
  customerName: string;
  email: string;
  phone: string;
  additionalNotes: string | null;
  images: string[];
  status:
    | "PENDING"
    | "REVIEWING"
    | "PRICED"
    | "CONTACTED"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED";
  adminNotes: string | null;
  estimatedPrice: number | null;
  estimatedTime: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PreordersResponse {
  preorders: Preorder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

export default function PreordersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedPreorder, setSelectedPreorder] = useState<Preorder | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Local state for form fields
  const [localFormData, setLocalFormData] = useState({
    estimatedPrice: "",
    estimatedTime: "",
    adminNotes: "",
  });

  // Build query params with pagination
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("search", searchTerm);
  if (selectedStatus !== "ALL") queryParams.append("status", selectedStatus);
  queryParams.append("page", currentPage.toString());
  queryParams.append("limit", itemsPerPage.toString());

  const { data, error, isLoading, mutate } = useSWR<PreordersResponse>(
    `/api/preorders?${queryParams.toString()}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  const preorders = data?.preorders || [];

  // Initialize local form data when preorder is selected
  useEffect(() => {
    if (selectedPreorder) {
      setLocalFormData({
        estimatedPrice: selectedPreorder.estimatedPrice?.toString() || "",
        estimatedTime: selectedPreorder.estimatedTime || "",
        adminNotes: selectedPreorder.adminNotes || "",
      });
    }
  }, [selectedPreorder]);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === "search") setSearchTerm(value);
    if (filterType === "status") setSelectedStatus(value);
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

  const statusOptions = [
    {
      value: "PENDING",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    {
      value: "REVIEWING",
      label: "Reviewing",
      color: "bg-blue-100 text-blue-800",
      icon: Eye,
    },
    {
      value: "PRICED",
      label: "Priced",
      color: "bg-purple-100 text-purple-800",
      icon: DollarSign,
    },
    {
      value: "CONTACTED",
      label: "Contacted",
      color: "bg-indigo-100 text-indigo-800",
      icon: MessageCircle,
    },
    {
      value: "APPROVED",
      label: "Approved",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    {
      value: "REJECTED",
      label: "Rejected",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
    {
      value: "COMPLETED",
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800",
      icon: CheckCircle,
    },
  ];

  const urgencyOptions = [
    { value: "LOW", label: "Low", color: "bg-gray-100 text-gray-800" },
    {
      value: "MEDIUM",
      label: "Medium",
      color: "bg-orange-100 text-orange-800",
    },
    { value: "HIGH", label: "High", color: "bg-red-100 text-red-800" },
    { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-800" },
  ];

  const statuses = [{ value: "ALL", label: "All Statuses" }, ...statusOptions];

  // Update preorder status
  const updatePreorderStatus = async (
    preorderId: string,
    newStatus: Preorder["status"]
  ) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const response = await fetch(`/api/preorders/${preorderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      await mutate();
      // Update selected preorder if it's the one being updated
      if (selectedPreorder?.id === preorderId) {
        setSelectedPreorder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch (error: any) {
      console.error("Error updating preorder status:", error);
      setUpdateError(error.message || "Failed to update preorder status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Save pricing and timeline details
  const savePricingDetails = async () => {
    if (!selectedPreorder) return;

    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updates: any = {};

      if (localFormData.estimatedPrice !== "") {
        updates.estimatedPrice = parseFloat(localFormData.estimatedPrice);
      } else {
        updates.estimatedPrice = null;
      }

      if (localFormData.estimatedTime !== "") {
        updates.estimatedTime = localFormData.estimatedTime;
      } else {
        updates.estimatedTime = null;
      }

      if (localFormData.adminNotes !== "") {
        updates.adminNotes = localFormData.adminNotes;
      } else {
        updates.adminNotes = null;
      }

      const response = await fetch(`/api/preorders/${selectedPreorder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update preorder");
      }

      const updatedPreorder = await response.json();

      await mutate();
      setSelectedPreorder(updatedPreorder);

      // Show success feedback
      setUpdateError(null);
    } catch (error: any) {
      console.error("Error updating preorder details:", error);
      setUpdateError(error.message || "Failed to update preorder details");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete preorder
  const deletePreorder = async (preorderId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this preorder? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    try {
      const response = await fetch(`/api/preorders/${preorderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete preorder");
      }

      await mutate();
      setSelectedPreorder(null);
    } catch (error: any) {
      console.error("Error deleting preorder:", error);
      setUpdateError(error.message || "Failed to delete preorder");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredAndSortedPreorders = [...preorders].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case "customerName":
        aValue = a.customerName;
        bValue = b.customerName;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "productName":
        aValue = a.productName;
        bValue = b.productName;
        break;
      case "urgency":
        const urgencyOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        aValue = urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 0;
        bValue = urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 0;
        break;
      default:
        aValue = a[sortField as keyof Preorder];
        bValue = b[sortField as keyof Preorder];
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Not priced";
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const getUrgencyColor = (urgency: string) => {
    const option = urgencyOptions.find((u) => u.value === urgency);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  // Check if form has changes
  const hasFormChanges =
    selectedPreorder &&
    (localFormData.estimatedPrice !==
      (selectedPreorder.estimatedPrice?.toString() || "") ||
      localFormData.estimatedTime !== (selectedPreorder.estimatedTime || "") ||
      localFormData.adminNotes !== (selectedPreorder.adminNotes || ""));

  // Handle data reload
  const handleReload = async () => {
    await mutate();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load preorders</p>
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
          <h1 className="text-2xl font-bold text-gray-900">
            Preorder Requests
          </h1>
          <p className="text-gray-600">
            {isLoading
              ? "Loading..."
              : `Showing ${filteredAndSortedPreorders.length} of ${
                  data?.pagination.total || 0
                } preorder requests`}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search preorders, customers, products..."
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

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Auto-refresh every 30s</span>
          </div>
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

      {/* Preorders table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("productName")}
                >
                  <div className="flex items-center">
                    Product Request
                    <SortIcon field="productName" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("customerName")}
                >
                  <div className="flex items-center">
                    Customer
                    <SortIcon field="customerName" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Request Date
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Urgency
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
                  Estimated Price
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
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-primary-600" />
                      <span className="ml-2 text-gray-600">
                        Loading preorders...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedPreorders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm || selectedStatus !== "ALL"
                        ? "No preorders match your filters"
                        : "No preorder requests found"}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedPreorders.map((preorder) => (
                  <tr key={preorder.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {preorder.productName}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {preorder.productDescription}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {preorder.category} • Qty: {preorder.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {preorder.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {preorder.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {preorder.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(preorder.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyColor(
                          preorder.urgency
                        )}`}
                      >
                        {preorder.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusOptions.find((s) => s.value === preorder.status)
                            ?.color || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {preorder.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(preorder.estimatedPrice)}
                      </div>
                      {preorder.estimatedTime && (
                        <div className="text-xs text-gray-500">
                          Est: {preorder.estimatedTime}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedPreorder(preorder)}
                        className="inline-flex items-center text-brand-primary-600 hover:text-brand-primary-900"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.pages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={data.pagination.total}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {/* Preorder Details Modal */}
      {selectedPreorder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Preorder Request
                </h2>
                <p className="text-gray-600">
                  Submitted on {formatDate(selectedPreorder.createdAt)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      statusOptions.find(
                        (s) => s.value === selectedPreorder.status
                      )?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedPreorder.status}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(
                      selectedPreorder.urgency
                    )}`}
                  >
                    {selectedPreorder.urgency} Priority
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPreorder(null);
                  setUpdateError(null);
                  setLocalFormData({
                    estimatedPrice: "",
                    estimatedTime: "",
                    adminNotes: "",
                  });
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

              {/* Product Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Product Request
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {selectedPreorder.productName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-600">
                      {selectedPreorder.productDescription}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <p className="text-gray-600">
                        {selectedPreorder.category}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <p className="text-gray-600">
                        {selectedPreorder.quantity}
                      </p>
                    </div>
                  </div>
                  {selectedPreorder.budget && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Budget
                      </label>
                      <p className="text-gray-600">{selectedPreorder.budget}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Images */}
              {selectedPreorder.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Reference Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedPreorder.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`Reference image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <p className="text-gray-900">
                        {selectedPreorder.customerName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="text-gray-900">{selectedPreorder.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <p className="text-gray-900">{selectedPreorder.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Controls */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Pricing & Timeline
                    </h3>
                    {hasFormChanges && (
                      <button
                        onClick={savePricingDetails}
                        disabled={isUpdating}
                        className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>Save</span>
                      </button>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Price (BDT)
                      </label>
                      <input
                        type="number"
                        value={localFormData.estimatedPrice}
                        onChange={(e) =>
                          setLocalFormData((prev) => ({
                            ...prev,
                            estimatedPrice: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                        placeholder="Enter estimated price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Time
                      </label>
                      <input
                        type="text"
                        value={localFormData.estimatedTime}
                        onChange={(e) =>
                          setLocalFormData((prev) => ({
                            ...prev,
                            estimatedTime: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                        placeholder="e.g., 2-3 weeks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Notes
                      </label>
                      <textarea
                        value={localFormData.adminNotes}
                        onChange={(e) =>
                          setLocalFormData((prev) => ({
                            ...prev,
                            adminNotes: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                        placeholder="Add internal notes..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedPreorder.additionalNotes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">
                      {selectedPreorder.additionalNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Controls */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Update Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        updatePreorderStatus(
                          selectedPreorder.id,
                          status.value as Preorder["status"]
                        )
                      }
                      disabled={
                        isUpdating || selectedPreorder.status === status.value
                      }
                      className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                        selectedPreorder.status === status.value
                          ? "border-brand-primary-500 bg-brand-primary-50 text-brand-primary-700"
                          : "border-gray-200 hover:bg-gray-50"
                      } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <status.icon className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        {status.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <div className="border-t pt-4">
                <button
                  onClick={() => deletePreorder(selectedPreorder.id)}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span>Delete Preorder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
