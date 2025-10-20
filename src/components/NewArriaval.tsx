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
  reviewCount: number;
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
  const reviewCount = product.reviewCount || 0;

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
          reviewCount: product.reviewCount || 0,
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

  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand-neutral-100 hover:border-brand-neutral-200 flex flex-col h-full"
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
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-neutral-50">
                  <Loader2 className="h-6 w-6 text-brand-neutral-400 animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-brand-neutral-100 flex items-center justify-center">
              <div className="text-brand-neutral-400 text-sm">No Image</div>
            </div>
          )}

          {/* New Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded shadow-sm ${
                isVeryNew
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white"
              }`}
            >
              {isVeryNew ? "🔥 Just In" : "🆕 New"}
            </span>
          </div>

          {/* Additional Badges */}
          <div className="absolute top-2 left-2 mt-8 flex flex-col gap-1 items-start">
            {product.isBestSeller && (
              <span className="bg-brand-gold-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                BEST
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="bg-green-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>

          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Desktop Heart Icon - Top Right */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col gap-1">
            <button
              onClick={handleFavorite}
              disabled={isAddingToWishlist}
              className="bg-white/80 rounded-full p-1.5 shadow-sm hover:bg-white hover:shadow-md transition-all disabled:opacity-50"
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-brand-neutral-600"
                } ${isAddingToWishlist ? "animate-pulse" : ""}`}
              />
            </button>
          </div>

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
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-brand-neutral-500 mb-1 uppercase tracking-wide truncate">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-brand-neutral-800 mb-2 hover:text-brand-primary-600 transition-colors line-clamp-2 leading-tight text-sm">
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
                    ? "fill-brand-gold-400 text-brand-gold-400"
                    : "fill-brand-neutral-200 text-brand-neutral-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-brand-neutral-500">
            ({reviewCount})
          </span>
        </div>

        {/* Price and Actions Row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-brand-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-brand-neutral-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Actions - Heart and Cart */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Mobile Heart Icon */}
            <button
              onClick={handleFavorite}
              disabled={isAddingToWishlist}
              className="bg-brand-neutral-100 hover:bg-brand-neutral-200 p-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-brand-neutral-600"
                } ${isAddingToWishlist ? "animate-pulse" : ""}`}
              />
            </button>

            {/* Mobile Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="bg-brand-primary-600 text-white p-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary-700"
            >
              {isAddingToCart ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Days Ago */}
        <div className="mt-2">
          <span className="text-xs text-brand-neutral-400">
            Added {daysAgo === 1 ? "today" : `${daysAgo} days ago`}
          </span>
        </div>

        {/* You Save */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="mt-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
            Save {formatPrice(product.originalPrice - product.price)}
          </div>
        )}

        {/* Stock Status Text */}
        {isOutOfStock && (
          <div className="mt-2">
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              Currently unavailable
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
      <section className="py-12 md:py-16 px-3 sm:px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">🆕</div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-neutral-800 mb-3 md:mb-4">
              New Arrivals
            </h2>
            <p className="text-brand-neutral-600 text-sm md:text-base mb-3 md:mb-4">
              Loading new arrivals...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-brand-neutral-400" />
            </div>
          </div>
          {/* Loading skeleton grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-brand-neutral-100 animate-pulse flex flex-col h-full"
              >
                <div className="aspect-square bg-brand-neutral-200 rounded-t-lg"></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-brand-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-brand-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-brand-neutral-200 rounded w-1/3"></div>
                  <div className="h-2 bg-brand-neutral-200 rounded w-2/3"></div>
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
      <section className="py-12 md:py-16 px-3 sm:px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl md:text-4xl mb-3 md:mb-4">🆕</div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-neutral-800 mb-3 md:mb-4">
            New Arrivals
          </h2>
          <p className="text-red-600 mb-3 md:mb-4 text-sm md:text-base">
            Failed to load new arrivals
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-brand-neutral-800 transition-colors text-sm md:text-base"
            >
              Try Again
            </button>
            <Link
              href="/shop"
              className="px-4 py-2 border border-brand-neutral-300 text-brand-neutral-700 rounded-lg hover:border-brand-neutral-400 hover:bg-brand-neutral-50 transition-colors text-sm md:text-base"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-12 md:py-16 px-3 sm:px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="text-3xl md:text-4xl mb-3 md:mb-4">🆕</div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-neutral-800 mb-3 md:mb-4">
            New Arrivals
          </h2>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto text-sm md:text-base">
            Discover our latest products and be the first to get them
          </p>
        </div>

        {/* Products Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-6">
          {products.map((product: Product) => (
            <NewArrivalCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <div className="text-brand-neutral-400 text-3xl md:text-4xl mb-3 md:mb-4">
              🆕
            </div>
            <p className="text-brand-neutral-500 text-base md:text-lg mb-2">
              No new arrivals found.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-brand-neutral-500 text-white rounded-lg hover:bg-brand-neutral-600 transition-colors text-sm md:text-base"
              >
                Refresh
              </button>
              <Link
                href="/shop"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-brand-neutral-800 transition-colors text-sm md:text-base"
              >
                Shop All Products
              </Link>
            </div>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-8 md:mt-12">
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center px-6 py-2 md:px-8 md:py-3 border border-brand-neutral-300 text-brand-neutral-700 rounded-lg hover:border-brand-neutral-400 hover:bg-brand-neutral-50 transition-all font-medium text-sm md:text-base"
            >
              View All New Arrivals
              <ArrowRight className="h-4 w-4 ml-1 md:ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
