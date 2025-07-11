"use client";

import {
  Heart,
  X,
  ShoppingCart,
  ArrowRight,
  Share2,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WishlistPage = () => {
  // Sample wishlist data
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Organic Cotton Bodysuit",
      price: 2499,
      image: "/images/products/baby-clothing.png",
      colors: ["Pink", "Blue", "Mint"],
      sizes: ["0-3M", "3-6M", "6-12M"],
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Baby Monitor",
      price: 12999,
      image: "/images/products/bath-skincare.png",
      colors: ["White"],
      inStock: true,
    },
    {
      id: 3,
      name: "Convertible Baby Carrier",
      price: 8999,
      image: "/images/products/feeding-nursing.jpeg",
      colors: ["Gray", "Navy"],
      sizes: ["Standard", "Plus"],
      inStock: false,
      restockDate: "2023-12-15",
    },
    {
      id: 4,
      name: "Teething Toys Set",
      price: 1999,
      image: "/images/products/moms-care.jpeg",
      colors: ["Green", "Yellow"],
      inStock: true,
    },
  ]);
  const [recommendedItems, setRecommendedItems] = useState([
    {
      id: 1,
      name: "Organic Cotton Bodysuit",
      price: 2499,
      image: "/images/products/baby-clothing.png",
    },
    {
      id: 2,
      name: "Smart Baby Monitor",
      price: 12999,
      image: "/images/products/bath-skincare.png",
    },
    {
      id: 3,
      name: "Convertible Baby Carrier",
      price: 8999,
      image: "/images/products/feeding-nursing.jpeg",
    },
    {
      id: 4,
      name: "Teething Toys Set",
      price: 1999,
      image: "/images/products/moms-care.jpeg",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const removeItems = () => {
    setWishlistItems(
      wishlistItems.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
  };

  const moveToCart = (id: number) => {
    // Implement your cart addition logic here
    console.log(`Moving item ${id} to cart`);
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const shareWishlist = () => {
    // Implement share functionality
    console.log("Sharing wishlist");
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-neutral-800">
              Your Wishlist
            </h1>
            <p className="text-brand-neutral-500 mt-2">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"}
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button
                onClick={shareWishlist}
                className="flex items-center px-4 py-2 border border-brand-neutral-200 rounded-lg text-brand-neutral-700 hover:bg-brand-neutral-50 transition-colors"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
              {selectedItems.length > 0 && (
                <button
                  onClick={removeItems}
                  className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Remove ({selectedItems.length})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <Heart className="mx-auto h-12 w-12 text-brand-neutral-300" />
            <h3 className="mt-4 text-lg font-medium text-brand-neutral-900">
              Your wishlist is empty
            </h3>
            <p className="mt-2 text-brand-neutral-500">
              Start adding items you love by clicking the ♡ icon
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-brand-primary-600 hover:bg-brand-primary-700"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Wishlist Items */}
        {wishlistItems.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`group bg-white rounded-xl shadow-sm hover:shadow-md border border-brand-neutral-100 overflow-hidden transition-all ${
                  selectedItems.includes(item.id)
                    ? "ring-2 ring-brand-primary-500"
                    : ""
                }`}
              >
                {/* Item Header */}
                <div className="p-4 flex justify-between items-start">
                  <button
                    onClick={() => toggleSelectItem(item.id)}
                    className={`w-5 h-5 rounded border ${
                      selectedItems.includes(item.id)
                        ? "bg-brand-primary-500 border-brand-primary-500"
                        : "border-brand-neutral-300 hover:border-brand-primary-500"
                    } flex items-center justify-center transition-colors`}
                  >
                    {selectedItems.includes(item.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setWishlistItems(
                        wishlistItems.filter((i) => i.id !== item.id)
                      );
                      setSelectedItems(
                        selectedItems.filter((id) => id !== item.id)
                      );
                    }}
                    className="p-1 rounded-full text-brand-neutral-400 hover:bg-brand-neutral-50 hover:text-brand-neutral-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Image */}
                <Link href={`/products/${item.id}`} className="block px-4">
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-brand-neutral-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-brand-neutral-700 shadow-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4 pt-2">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-medium text-brand-neutral-800 hover:text-brand-primary-600 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-lg font-semibold text-brand-primary-600">
                    {formatPrice(item.price)}
                  </p>

                  {/* Color/Size Options */}
                  <div className="mt-3 space-y-2">
                    {item.colors && (
                      <div>
                        <p className="text-xs text-brand-neutral-500">
                          Colors:
                        </p>
                        <div className="flex space-x-2 mt-1">
                          {item.colors.map((color) => (
                            <span
                              key={color}
                              className="w-4 h-4 rounded-full border border-brand-neutral-200"
                              style={{
                                backgroundColor:
                                  color === "White"
                                    ? "#fff"
                                    : color.toLowerCase(),
                              }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {item.sizes && (
                      <div>
                        <p className="text-xs text-brand-neutral-500">Sizes:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.sizes.map((size) => (
                            <span
                              key={size}
                              className="px-2 py-0.5 text-xs border border-brand-neutral-200 rounded-md"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => moveToCart(item.id)}
                      disabled={!item.inStock}
                      className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium ${
                        item.inStock
                          ? "bg-brand-primary-600 text-white hover:bg-brand-primary-700"
                          : "bg-brand-neutral-100 text-brand-neutral-400 cursor-not-allowed"
                      } transition-colors`}
                    >
                      {item.inStock ? (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </>
                      ) : (
                        "Notify Me"
                      )}
                    </button>
                  </div>

                  {!item.inStock && item.restockDate && (
                    <p className="mt-2 text-xs text-brand-neutral-500">
                      Restocking on{" "}
                      {new Date(item.restockDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recommendations Section */}
        {wishlistItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-brand-neutral-800 mb-6">
              You might also like
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md border border-brand-neutral-100 overflow-hidden transition-all"
                >
                  <div className="p-4">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-brand-neutral-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-brand-neutral-300">
                          <Heart className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <h3 className="font-medium text-brand-neutral-800 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-lg font-semibold text-brand-primary-600">
                      {formatPrice(item.price)}
                    </p>
                    <button className="mt-3 w-full flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium bg-brand-primary-600 text-white hover:bg-brand-primary-700 transition-colors">
                      <Heart className="w-4 h-4 mr-2" />
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
