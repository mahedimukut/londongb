// dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Heart,
  Star,
  MapPin,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Tag,
  Building,
  AlertCircle,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FaGifts } from "react-icons/fa";

const adminNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: Tag,
  },
  {
    name: "Brands",
    href: "/dashboard/brands",
    icon: Building,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Pre Orders",
    href: "/dashboard/pre-orders",
    icon: FaGifts,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    name: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },
  {
    name: "Wishlists",
    href: "/dashboard/wishlists",
    icon: Heart,
  },
  {
    name: "Addresses",
    href: "/dashboard/addresses",
    icon: MapPin,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.email === "britcartbd@gmail.com") {
      setIsAuthorized(true);
    } else {
      // Redirect unauthorized users to home page
      router.push("/");
    }

    setIsLoading(false);
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Show loading state while checking authentication
  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-600"></div>
      </div>
    );
  }

  // Show unauthorized message if user is not the admin
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-brand-primary-600 text-white rounded-md hover:bg-brand-primary-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-brand-primary-600 text-white">
            <h1 className="text-xl font-bold">britcartbd.com</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-brand-primary-50 text-brand-primary-600"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User profile section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-brand-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-primary-600" />
                </div>
              )}
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || "User Name"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Store
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button
            className="text-gray-500 hover:text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {adminNavigation.find((item) => item.href === pathname)?.name ||
                "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center">
            <div className="flex items-center">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-brand-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-brand-primary-600" />
                </div>
              )}
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-gray-800">
                  {session?.user?.name || "User"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
