"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  Heart,
  Settings,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const navigation = [
  {
    name: "My Account",
    href: "/account",
    icon: User,
  },
  {
    name: "My Orders",
    href: "/orders",
    icon: Package,
  },
  {
    name: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function UserAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setSidebarOpen(false);
  };

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-neutral-900">
            My Account
          </h1>
          <p className="text-brand-neutral-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden flex items-center gap-2 p-4 bg-brand-primary-50 rounded-lg text-brand-primary-600 font-medium mb-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
            Menu
          </button>

          {/* Sidebar */}
          <div
            className={`
              fixed inset-0 z-40 lg:static lg:z-auto lg:block
              ${sidebarOpen ? "block" : "hidden"}
            `}
          >
            {/* Backdrop for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar content */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-xl lg:static lg:shadow-none lg:rounded-xl lg:border lg:border-brand-neutral-200 lg:w-64">
              {/* Close button for mobile */}
              <button
                className="lg:hidden absolute top-4 right-4 p-2 text-brand-neutral-500 hover:text-brand-neutral-700"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>

              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                        ${
                          isActive
                            ? "bg-brand-primary-50 text-brand-primary-600"
                            : "text-brand-neutral-600 hover:bg-brand-neutral-50 hover:text-brand-neutral-900"
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>

              {/* User info section */}
              <div className="mt-8 pt-8 border-t border-brand-neutral-200">
                <div className="flex items-center gap-3 mb-4">
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
                      <User className="w-5 h-5 text-brand-primary-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-neutral-900 truncate">
                      {session?.user?.name || "User Name"}
                    </p>
                    <p className="text-xs text-brand-neutral-500 truncate">
                      {session?.user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-brand-neutral-200 p-6">
              {children}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
