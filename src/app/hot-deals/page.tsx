"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  ArrowRight,
  Heart,
  Loader2,
  Flame,
  Zap,
  RefreshCw,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  images: { url: string }[];
  colors: { name: string; hexCode: string }[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  stock: number;
  category?: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
  discountPercentage: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Client-only wrapper for HotDealCard to prevent SSR
const ClientHotDealCard = ({ product }: { product: Product }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { state, addToCart, addToWishlist, removeFromWishlist } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client-side only after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if product is in wishlist (client-side only)
  useEffect(() => {
    if (isClient) {
      const isInWishlist = state.wishlist.some(
        (item) => item.productId === product.id
      );
      setIsFavorite(isInWishlist);
    }
  }, [state.wishlist, product.id, isClient]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  // Use fixed values for server-side, dynamic for client
  const averageRating = product.rating || 4.5;
  const reviewCount = product.reviews || 128;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.info(`"${product.name}" is out of stock`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const toastId = toast.loading(`Adding "${product.name}" to cart...`, {
      position: "bottom-right",
    });

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url || "/placeholder-product.jpg",
        color: product.colors[0]?.name || "",
        size: "",
        slug: product.slug,
        stock: product.stock,
        maxQuantity: Math.min(product.stock, 10),
      });

      toast.update(toastId, {
        render: `"${product.name}" added to cart! 🛒`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.update(toastId, {
        render: "Failed to add item to cart. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      // Remove from wishlist
      const wishlistItem = state.wishlist.find(
        (item) => item.productId === product.id
      );
      if (wishlistItem) {
        const toastId = toast.loading(
          `Removing "${product.name}" from wishlist...`,
          {
            position: "bottom-right",
          }
        );

        setIsAddingToWishlist(true);
        try {
          await removeFromWishlist(wishlistItem.id);
          setIsFavorite(false);

          toast.update(toastId, {
            render: `"${product.name}" removed from wishlist`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          toast.update(toastId, {
            render: "Failed to remove from wishlist. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 4000,
          });
        } finally {
          setIsAddingToWishlist(false);
        }
      }
    } else {
      // Add to wishlist
      const toastId = toast.loading(`Adding "${product.name}" to wishlist...`, {
        position: "bottom-right",
      });

      setIsAddingToWishlist(true);
      try {
        await addToWishlist({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0]?.url || "/placeholder-product.jpg",
          slug: product.slug,
          rating: product.rating || 0,
          reviewCount: product.reviews || 0,
          stock: product.stock,
          isInStock: product.stock > 0,
        });
        setIsFavorite(true);

        toast.update(toastId, {
          render: `"${product.name}" added to wishlist! ❤️`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.update(toastId, {
          render: "Failed to add to wishlist. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      } finally {
        setIsAddingToWishlist(false);
      }
    }
  };

  // Don't render favorite state until client-side to avoid hydration mismatch
  const favoriteIcon = isClient ? (
    <Heart
      className={`h-4 w-4 ${
        isFavorite ? "fill-red-500 text-red-500" : "text-brand-neutral-600"
      } ${isAddingToWishlist ? "animate-pulse" : ""}`}
    />
  ) : (
    <Heart className="h-4 w-4 text-brand-neutral-300" />
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-brand-neutral-100 hover:border-brand-neutral-200 flex flex-col h-full"
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden aspect-square">
          {product.images && product.images.length > 0 ? (
            <>
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                  imageLoading ? "blur-sm" : "blur-0"
                }`}
                quality={90}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-neutral-50">
                  <Loader2 className="h-6 w-6 text-brand-neutral-400 animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-brand-neutral-100 flex items-center justify-center">
              <Flame className="h-8 w-8 text-brand-neutral-400" />
            </div>
          )}

          {/* Hot Deal Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              <Zap className="h-3 w-3 inline mr-1" />
              {product.discountPercentage}% OFF
            </span>
          </div>

          {/* Additional Badges */}
          <div className="absolute top-2 left-2 mt-6 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-brand-sky-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-brand-gold-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                BEST
              </span>
            )}
          </div>

          {/* Quick Actions - Only show on client-side */}
          {isClient && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1">
              <button
                onClick={handleFavorite}
                disabled={isAddingToWishlist}
                className="bg-white rounded-full p-1.5 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                {favoriteIcon}
              </button>
            </div>
          )}

          {/* Add to Cart Button - Desktop */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="bg-gradient-to-r from-brand-neutral-900 to-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-black hover:to-brand-neutral-800 transition-all shadow-sm disabled:bg-brand-neutral-300 disabled:cursor-not-allowed"
            >
              {isAddingToCart
                ? "Adding..."
                : product.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>

          {/* Stock Status Badge */}
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 md:p-4 flex-1 flex flex-col">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-brand-neutral-500 mb-1 uppercase tracking-wide truncate">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-brand-neutral-900 mb-2 hover:text-brand-primary-600 transition-colors line-clamp-2 leading-tight text-sm">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(averageRating)
                    ? "fill-brand-gold-500 text-brand-gold-500"
                    : "fill-brand-neutral-200 text-brand-neutral-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-brand-neutral-500">
            ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-bold text-brand-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-brand-neutral-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Quick Add to Cart for Mobile */}
          {isClient && (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="md:hidden bg-brand-primary-600 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary-700"
            >
              {isAddingToCart ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ShoppingCart className="h-3 w-3" />
              )}
            </button>
          )}
        </div>

        {/* You Save */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="mt-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
            Save {formatPrice(product.originalPrice - product.price)}
          </div>
        )}

        {/* Stock Status */}
        {product.stock <= 0 && (
          <div className="mt-2">
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function HotDealsPage() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // Use SWR for data fetching with real-time updates
  const {
    data: products = [],
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR<Product[]>("/api/hot-deals", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true, // Refresh when tab becomes focused
    revalidateOnReconnect: true, // Refresh when reconnecting to internet
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
    focusThrottleInterval: 30000, // Prevent too many focus revalidations
    errorRetryCount: 3, // Retry failed requests 3 times
    loadingTimeout: 10000, // Timeout after 10 seconds
  });

  const handleRefresh = async () => {
    const toastId = toast.loading("Refreshing hot deals...", {
      position: "bottom-right",
    });

    try {
      await mutate();
      toast.update(toastId, {
        render: "Hot deals refreshed! 🔥",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.update(toastId, {
        render: "Failed to refresh hot deals",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  // Calculate max discount for stats
  const maxDiscount =
    products.length > 0
      ? Math.max(...products.map((p) => p.discountPercentage))
      : 0;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-8">
            {/* Mobile Header */}
            <div className="md:hidden bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-6 w-6" />
                <h1 className="text-xl font-bold">Hot Deals</h1>
              </div>
              <p className="text-orange-100 text-sm">
                Loading amazing discounts...
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <div className="hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="h-8 w-8 text-orange-500" />
                  <h1 className="text-3xl font-bold text-brand-neutral-900">
                    Hot Deals
                  </h1>
                </div>
                <p className="text-brand-neutral-600">
                  Loading amazing discounts...
                </p>
              </div>
              <div className="flex items-center gap-2 text-brand-neutral-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            </div>

            {/* Loading skeleton grid - 2 columns on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-brand-neutral-100 animate-pulse flex flex-col h-full"
                >
                  <div className="aspect-square bg-brand-neutral-200 rounded-t-lg"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-brand-neutral-200 rounded w-3/4"></div>
                    <div className="h-3 bg-brand-neutral-200 rounded w-1/2"></div>
                    <div className="h-4 bg-brand-neutral-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-8">
            {/* Mobile Header */}
            <div className="md:hidden bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-6 w-6" />
                <h1 className="text-xl font-bold">Hot Deals</h1>
              </div>
              <p className="text-orange-100 text-sm">
                Limited time offers with amazing discounts
              </p>
            </div>

            <div className="text-center py-8 md:py-12">
              <Flame className="h-12 w-12 md:h-16 md:w-16 text-brand-neutral-400 mx-auto mb-3 md:mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-brand-neutral-900 mb-3 md:mb-4">
                Failed to Load Hot Deals
              </h2>
              <p className="text-red-600 mb-3 md:mb-4 text-sm md:text-base">
                {error.message || "Failed to load hot deals"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-brand-neutral-800 transition-colors flex items-center gap-2 text-sm md:text-base"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                <Link
                  href="/shop"
                  className="px-4 py-2 border border-brand-neutral-300 text-brand-neutral-700 rounded-lg hover:border-brand-neutral-400 hover:bg-brand-neutral-50 transition-colors flex items-center gap-2 text-sm md:text-base"
                >
                  <ArrowRight className="h-4 w-4" />
                  Browse All
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-8">
          {/* Mobile Header */}
          <div className="md:hidden bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6" />
                <h1 className="text-xl font-bold">Hot Deals</h1>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isValidating}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <p className="text-orange-100 text-sm">
              Limited time offers with amazing discounts
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Flame className="h-8 w-8 text-orange-500" />
                <h1 className="text-3xl font-bold text-brand-neutral-900">
                  Hot Deals
                </h1>
              </div>
              <p className="text-brand-neutral-600">
                Limited time offers with amazing discounts
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isValidating && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={isValidating}
                className="flex items-center gap-2 px-4 py-2 bg-brand-neutral-100 text-brand-neutral-700 rounded-lg hover:bg-brand-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`}
                />
                {isValidating ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {products.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-lg md:rounded-xl p-3 md:p-4 mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-orange-700">
                    {products.length} hot deals
                  </span>
                  <span className="text-orange-600 hidden sm:inline">•</span>
                  <span className="text-orange-600 text-xs sm:text-sm">
                    Auto-refreshes every 30s
                  </span>
                </div>
                <div className="flex items-center gap-3 md:gap-4 text-orange-600 text-xs sm:text-sm">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3 md:h-4 md:w-4" />
                    Limited time
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 md:h-4 md:w-4" />
                    Up to {maxDiscount}% OFF
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid - 2 columns on mobile */}
          {products.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <Flame className="h-12 w-12 md:h-16 md:w-16 text-brand-neutral-400 mx-auto mb-3 md:mb-4" />
              <p className="text-brand-neutral-500 text-base md:text-lg mb-2">
                No hot deals available at the moment.
              </p>
              <p className="text-brand-neutral-400 text-sm md:text-base mb-4 md:mb-6">
                Check back later for amazing discounts!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-brand-neutral-500 text-white rounded-lg hover:bg-brand-neutral-600 transition-colors flex items-center gap-2 text-sm md:text-base"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <Link
                  href="/shop"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-brand-neutral-800 transition-colors flex items-center gap-2 text-sm md:text-base"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Shop All
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={ref}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
              >
                {products.map((product) => (
                  <ClientHotDealCard key={product.id} product={product} />
                ))}
              </div>

              {/* Bottom Refresh Section */}
              <div className="mt-8 md:mt-12 text-center">
                <div className="bg-brand-neutral-50 rounded-lg md:rounded-xl p-4 md:p-6">
                  <p className="text-brand-neutral-600 text-sm md:text-base mb-3 md:mb-4">
                    Deals updated automatically. Last refreshed just now.
                  </p>
                  <button
                    onClick={handleRefresh}
                    disabled={isValidating}
                    className="px-4 md:px-6 py-2 bg-black text-white rounded-lg hover:bg-brand-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto text-sm md:text-base"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isValidating ? "animate-spin" : ""
                      }`}
                    />
                    {isValidating ? "Refreshing..." : "Refresh Now"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
