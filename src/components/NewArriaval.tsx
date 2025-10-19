"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, ArrowRight, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { useCart } from "../app/context/CartContext";

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
  createdAt: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const NewArrivalCard = ({ product }: { product: Product }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { state, addToCart, addToWishlist, removeFromWishlist } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    const isInWishlist = state.wishlist.some(
      (item) => item.productId === product.id
    );
    setIsFavorite(isInWishlist);
  }, [state.wishlist, product.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  const averageRating = product.rating || 4.5;
  const reviewCount = product.reviews || Math.floor(Math.random() * 100) + 10;

  // Calculate how new the product is
  const getDaysAgo = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysAgo = getDaysAgo(product.createdAt);
  const isVeryNew = daysAgo <= 3;

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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200"
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
              />
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-sm">No Image</div>
            </div>
          )}

          {/* New Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-medium px-2 py-1 rounded shadow-sm ${
                isVeryNew
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              }`}
            >
              {isVeryNew ? "🔥 Just In" : "🆕 New"}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
            <button
              onClick={handleFavorite}
              disabled={isAddingToWishlist}
              className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                } ${isAddingToWishlist ? "animate-pulse" : ""}`}
              />
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="bg-gradient-to-r from-black to-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:from-gray-800 hover:to-black transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            <div className="absolute top-3 right-3">
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 leading-tight text-sm">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Quick Add to Cart for Mobile */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="lg:hidden bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
            ) : (
              <ShoppingCart className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Days Ago */}
        <div className="mt-2">
          <span className="text-xs text-gray-400">
            Added {daysAgo === 1 ? "today" : `${daysAgo} days ago`}
          </span>
        </div>

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

export default function NewArrivals() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // Use SWR for data fetching with real-time updates
  const {
    data: responseData,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/dashboard/products?limit=15&new=true", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true, // Refresh when tab becomes focused
    revalidateOnReconnect: true, // Refresh when reconnecting to internet
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
  });

  // Extract products from response data
  const products = responseData?.products || [];

  const handleRefresh = async () => {
    const toastId = toast.loading("Refreshing new arrivals...", {
      position: "bottom-right",
    });

    try {
      await mutate();
      toast.update(toastId, {
        render: "New arrivals refreshed! 🆕",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.update(toastId, {
        render: "Failed to refresh new arrivals",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-600 mb-4">Loading new arrivals...</p>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          </div>
          {/* Loading skeleton grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-100 animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <p className="text-red-600 mb-4">Failed to load new arrivals</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/shop"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🆕</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-2">
            Discover our latest products and be the first to get them
          </p>
        </div>

        {/* Products Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product: Product) => (
            <NewArrivalCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🆕</div>
            <p className="text-gray-500 text-lg mb-2">No new arrivals found.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Refresh
              </button>
              <Link
                href="/shop"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Shop All Products
              </Link>
            </div>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all font-medium"
            >
              View All New Arrivals
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
