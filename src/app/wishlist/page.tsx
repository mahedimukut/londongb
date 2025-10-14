"use client";

import {
  Heart,
  X,
  ShoppingCart,
  ArrowRight,
  Share2,
  Trash2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "../context/CartContext";

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  slug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isInStock: boolean;
  addedAt: string;
  colors?: string[];
  sizes?: string[];
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMovingToCart, setIsMovingToCart] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { addToCart, addToWishlist, removeFromWishlist, state } = useCart();

  // Set client-side flag to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load wishlist data
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true);
        await loadRecommendedItems();
      } catch (error) {
        console.error("Error loading wishlist:", error);
        toast.error("Failed to load wishlist", {
          position: "bottom-right",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Sync with context state
  useEffect(() => {
    setWishlistItems(state.wishlist);
  }, [state.wishlist]);

  const loadRecommendedItems = async () => {
    try {
      const response = await fetch(
        "/api/dashboard/products?limit=4&isFeatured=true"
      );
      if (response.ok) {
        const data = await response.json();
        setRecommendedItems(
          data.products.map((product: any) => ({
            id: `rec-${product.id}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0]?.url || "/placeholder-product.jpg",
            slug: product.slug,
            rating: product.rating,
            reviewCount: product.reviewCount,
            stock: product.stock,
            isInStock: product.stock > 0,
            addedAt: new Date().toISOString(),
          }))
        );
      }
    } catch (error) {
      console.error("Error loading recommended items:", error);
    }
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

  // Safe date formatting that works on both server and client
  const formatDate = (dateString: string) => {
    if (!isClient) {
      return "Loading..."; // Server-side fallback
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const removeItems = async () => {
    if (selectedItems.length === 0) return;

    const toastId = toast.loading(`Removing ${selectedItems.length} items...`, {
      position: "bottom-right",
    });

    setIsRemoving(true);
    try {
      for (const itemId of selectedItems) {
        await removeFromWishlist(itemId);
      }
      setSelectedItems([]);
      toast.update(toastId, {
        render: `${selectedItems.length} items removed from wishlist`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error removing items:", error);
      toast.update(toastId, {
        render: "Failed to remove items. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const removeSingleItem = async (itemId: string, itemName: string) => {
    const toastId = toast.loading("Removing item...", {
      position: "bottom-right",
    });

    try {
      await removeFromWishlist(itemId);
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      toast.update(toastId, {
        render: `"${itemName}" removed from wishlist`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast.update(toastId, {
        render: "Failed to remove item. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  const moveToCart = async (item: WishlistItem) => {
    const toastId = toast.loading(`Adding "${item.name}" to cart...`, {
      position: "bottom-right",
    });

    setIsMovingToCart(item.id);
    try {
      await addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        slug: item.slug,
        stock: item.stock,
        maxQuantity: Math.min(item.stock, 10),
      });
      await removeFromWishlist(item.id);
      toast.update(toastId, {
        render: `"${item.name}" added to cart!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast.update(toastId, {
        render: "Failed to add item to cart. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsMovingToCart(null);
    }
  };

  const addRecommendedToWishlist = async (item: WishlistItem) => {
    const toastId = toast.loading(`Adding "${item.name}" to wishlist...`, {
      position: "bottom-right",
    });

    try {
      await addToWishlist({
        productId: item.productId,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        slug: item.slug,
        rating: item.rating,
        reviewCount: item.reviewCount,
        stock: item.stock,
        isInStock: item.isInStock,
      });
      toast.update(toastId, {
        render: `"${item.name}" added to wishlist!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.update(toastId, {
        render: "Failed to add item to wishlist. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  const shareWishlist = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Wishlist - BritCartBD",
          text: "Check out my wishlist on BritCartBD",
          url: window.location.href,
        })
        .then(() => {
          toast.success("Wishlist shared successfully!", {
            position: "bottom-right",
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const selectAllItems = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
      toast.info("All items unselected", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id));
      toast.info(`All ${wishlistItems.length} items selected`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  // Skeleton Loader
  const WishlistSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-brand-neutral-100 overflow-hidden animate-pulse"
        >
          <div className="p-4 flex justify-between">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="px-4">
            <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
          </div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

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
            <div className="text-brand-neutral-500 mt-2">
              {isLoading ? (
                <span className="inline-block h-4 bg-gray-200 rounded w-24 animate-pulse"></span>
              ) : (
                `${wishlistItems.length} ${
                  wishlistItems.length === 1 ? "item" : "items"
                }`
              )}
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === wishlistItems.length &&
                    wishlistItems.length > 0
                  }
                  onChange={selectAllItems}
                  className="rounded text-brand-primary-600 focus:ring-brand-primary-500"
                />
                <span className="text-sm text-brand-neutral-600">
                  Select all
                </span>
              </div>

              <button
                onClick={shareWishlist}
                disabled={isRemoving}
                className="flex items-center px-4 py-2 border border-brand-neutral-200 rounded-lg text-brand-neutral-700 hover:bg-brand-neutral-50 transition-colors disabled:opacity-50"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>

              {selectedItems.length > 0 && (
                <button
                  onClick={removeItems}
                  disabled={isRemoving}
                  className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {isRemoving ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5 mr-2" />
                  )}
                  Remove ({selectedItems.length})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && <WishlistSkeleton />}

        {/* Empty State */}
        <AnimatePresence>
          {!isLoading && wishlistItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
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
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-brand-primary-600 hover:bg-brand-primary-700 transition-colors"
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Items */}
        <AnimatePresence>
          {!isLoading && wishlistItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
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
                      onClick={() => removeSingleItem(item.id, item.name)}
                      disabled={isRemoving}
                      className="p-1 rounded-full text-brand-neutral-400 hover:bg-brand-neutral-50 hover:text-brand-neutral-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product Image */}
                  <Link href={`/products/${item.slug}`} className="block px-4">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-brand-neutral-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:opacity-90 transition-opacity"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {!item.isInStock && (
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
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-medium text-brand-neutral-800 hover:text-brand-primary-600 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(item.rating)
                                ? "text-brand-gold-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-brand-neutral-500 ml-1">
                        ({item.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-2">
                      <span className="text-lg font-semibold text-brand-primary-600">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <span className="ml-2 text-sm text-brand-neutral-500 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.isInStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.isInStock
                          ? `${item.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => moveToCart(item)}
                        disabled={!item.isInStock || isMovingToCart === item.id}
                        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium ${
                          item.isInStock
                            ? "bg-brand-primary-600 text-white hover:bg-brand-primary-700"
                            : "bg-brand-neutral-100 text-brand-neutral-400 cursor-not-allowed"
                        } transition-colors disabled:opacity-50`}
                      >
                        {isMovingToCart === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : item.isInStock ? (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        ) : (
                          "Notify Me"
                        )}
                      </button>
                    </div>

                    {/* Added Date - Fixed for hydration */}
                    <p className="mt-2 text-xs text-brand-neutral-500">
                      Added {formatDate(item.addedAt)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations Section */}
        {!isLoading &&
          wishlistItems.length > 0 &&
          recommendedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold text-brand-neutral-800 mb-6">
                You might also like
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-brand-neutral-100 overflow-hidden transition-all"
                  >
                    <div className="p-4">
                      <Link href={`/products/${item.slug}`}>
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-brand-neutral-50">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover hover:opacity-90 transition-opacity"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="p-4 pt-0">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-medium text-brand-neutral-800 hover:text-brand-primary-600 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(item.rating)
                                  ? "text-brand-gold-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-brand-neutral-500 ml-1">
                          ({item.reviewCount})
                        </span>
                      </div>

                      <p className="mt-1 text-lg font-semibold text-brand-primary-600">
                        {formatPrice(item.price)}
                      </p>

                      <button
                        onClick={() => addRecommendedToWishlist(item)}
                        className="mt-3 w-full flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium bg-brand-primary-600 text-white hover:bg-brand-primary-700 transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Add to Wishlist
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
