"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Baby, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-brand-primary-50 to-brand-sky-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="text-9xl font-bold text-brand-primary-600 opacity-20">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-bold text-brand-primary-600">
                  404
                </div>
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
            <h1 className="text-3xl md:text-4xl font-bold text-brand-neutral-900 mb-4">
              Oops! Little One Got Lost
            </h1>
            <p className="text-lg text-brand-neutral-600 mb-8 max-w-md mx-auto">
              The page you're looking for seems to have wandered off. Don't
              worry, we'll help you find your way back to the fun stuff!
            </p>

            {/* Animated Baby Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mb-8"
            >
              <Baby className="h-16 w-16 text-brand-primary-600 mx-auto" />
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
              className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white px-6 py-3"
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
              className="border-brand-primary-600 text-brand-primary-600 hover:bg-brand-primary-50 px-6 py-3"
              size="lg"
            >
              <Link href="/shop" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-brand-neutral-200"
          >
            <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4 flex items-center justify-center gap-2">
              <Search className="h-5 w-5 text-brand-primary-600" />
              Popular Pages
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/shop", label: "All Products", icon: "🛒" },
                { href: "/new-arrivals", label: "New Arrivals", icon: "⭐" },
                { href: "/for-moms", label: "For Moms", icon: "👩" },
                { href: "/sale", label: "Sale", icon: "🔥" },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-primary-50 transition-colors text-brand-neutral-700 hover:text-brand-primary-600"
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
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
            className="mt-8 text-center"
          >
            <p className="text-brand-neutral-500 mb-2">
              Need help finding something?
            </p>
            <div className="flex items-center justify-center gap-2 text-brand-primary-600">
              <Heart className="h-4 w-4" />
              <Link href="/contact" className="hover:underline font-medium">
                Contact our support team
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
