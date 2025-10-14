"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-5 w-40 h-40 rounded-full bg-purple-200/40 blur-3xl"></div>
          <div className="absolute top-40 right-10 w-32 h-32 rounded-full bg-pink-200/50 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-36 h-36 rounded-full bg-blue-200/30 blur-3xl"></div>
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* Animated 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="text-9xl font-bold text-purple-600 opacity-20">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                >
                  404
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like this product page has wandered off! Don't worry - we've
              got plenty of other amazing finds waiting for you.
            </p>

            {/* Animated Shopping Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mb-8"
            >
              <ShoppingBag className="h-16 w-16 text-purple-600 mx-auto" />
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 hover:shadow-md transition-all"
              size="lg"
            >
              <Link href="/shop" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>

          {/* Quick Links - Updated for your categories */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-purple-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Popular Categories
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  href: "/category/skin-care",
                  label: "Skin Care",
                  icon: "✨",
                  count: "28 products",
                },
                {
                  href: "/category/electronics",
                  label: "Electronics",
                  icon: "📱",
                  count: "67 products",
                },
                {
                  href: "/category/baby",
                  label: "Baby Products",
                  icon: "👶",
                  count: "42 products",
                },
                {
                  href: "/category/health-beauty",
                  label: "Health & Beauty",
                  icon: "💄",
                  count: "35 products",
                },
                {
                  href: "/category/auto-parts",
                  label: "Auto Parts",
                  icon: "🚗",
                  count: "23 products",
                },
                {
                  href: "/category/pets",
                  label: "Pet Supplies",
                  icon: "🐾",
                  count: "18 products",
                },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-all group border border-transparent hover:border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{link.icon}</span>
                      <div className="text-left">
                        <span className="font-medium text-gray-800 group-hover:text-purple-600">
                          {link.label}
                        </span>
                        <p className="text-xs text-gray-500">{link.count}</p>
                      </div>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-purple-600 rotate-180" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-purple-100"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <p className="text-gray-700 font-medium">
                Fast Delivery Across Bangladesh
              </p>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Can't find what you're looking for?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
            >
              <Sparkles className="h-4 w-4" />
              Contact our support team
            </Link>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm">
              Try searching for products in our{" "}
              <Link
                href="/search"
                className="text-purple-600 hover:underline font-medium"
              >
                search page
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
