// dashboard/page.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Types
interface DashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    revenueChange: number;
    revenueChangeType: "positive" | "negative";
  };
  chartData: {
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
    }>;
    topProducts: Array<{
      name: string;
      quantity: number;
      revenue: number;
    }>;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    date: string;
    amount: number;
    status: string;
  }>;
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      <div className="ml-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
      <div className="w-6 h-6 bg-gray-200 rounded"></div>
    </div>
    <div className="h-64 bg-gray-200 rounded-lg"></div>
  </div>
);

const OrdersTableSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-14"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const [activeChart, setActiveChart] = useState<"revenue" | "products">(
    "revenue"
  );

  const { data, error, isLoading } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Chart data for revenue
  const revenueChartData = {
    labels: data?.chartData.monthlyRevenue.map((item) => item.month) || [],
    datasets: [
      {
        label: "Monthly Revenue",
        data: data?.chartData.monthlyRevenue.map((item) => item.revenue) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Chart data for top products
  const productsChartData = {
    labels: data?.chartData.topProducts.map((item) => item.name) || [],
    datasets: [
      {
        label: "Units Sold",
        data: data?.chartData.topProducts.map((item) => item.quantity) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(139, 92, 246)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          {isLoading
            ? "Loading dashboard data..."
            : "Welcome to your admin dashboard"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : data ? (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.stats.totalProducts.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Active products in store
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-50">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.stats.totalOrders.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">All-time orders</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-50">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data.stats.totalCustomers.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Registered users</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-50">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(data.stats.totalRevenue)}
                  </p>
                  <div className="flex items-center text-sm">
                    {data.stats.revenueChangeType === "positive" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        data.stats.revenueChangeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {data.stats.revenueChange > 0 ? "+" : ""}
                      {data.stats.revenueChange}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Charts and recent orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Charts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeChart === "revenue" ? "Revenue Analytics" : "Top Products"}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveChart("revenue")}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  activeChart === "revenue"
                    ? "bg-brand-primary-100 text-brand-primary-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveChart("products")}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  activeChart === "products"
                    ? "bg-brand-primary-100 text-brand-primary-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Products
              </button>
            </div>
          </div>

          {isLoading ? (
            <ChartSkeleton />
          ) : data ? (
            <div className="h-64">
              {activeChart === "revenue" ? (
                <Line data={revenueChartData} options={revenueChartOptions} />
              ) : (
                <Doughnut
                  data={productsChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom" as const,
                      },
                    },
                  }}
                />
              )}
            </div>
          ) : null}
        </div>

        {/* Recent orders */}
        {isLoading ? (
          <OrdersTableSkeleton />
        ) : data ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                href="/dashboard/orders"
                className="text-sm text-brand-primary-600 hover:text-brand-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "PROCESSING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0) +
                            order.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
