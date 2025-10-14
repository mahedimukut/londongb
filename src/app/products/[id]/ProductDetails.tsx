"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCw,
  Share2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";

// Types based on your Prisma schema
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  ageRange: string | null;
  categoryId: string;
  brandId: string | null;
  category: {
    name: string;
  };
  brand: {
    name: string;
    logo: string | null;
  } | null;
  images: {
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }[];
  colors: {
    id: string;
    name: string;
    hexCode: string | null;
  }[];
  specifications: {
    id: string;
    brand: string | null;
    countryOfOrigin: string | null;
    productType: string | null;
    materials: string | null;
    packContains: string | null;
    weight: string | null;
    dimensions: string | null;
    careInstructions: string | null;
    safetyFeatures: string | null;
  } | null;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  user: {
    name: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  const router = useRouter();
  const { state, addToCart, addToWishlist, removeFromWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.id || ""
  );
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Skeleton loading state
  const [isLoading, setIsLoading] = useState(true);

  // Update document title for better SEO
  useEffect(() => {
    document.title = `${product.name} | Britcartbd.com`;

    // Update meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && product.description) {
      metaDescription.setAttribute(
        "content",
        product.description.length > 160
          ? `${product.description.substring(0, 160)}...`
          : product.description
      );
    }
  }, [product.name, product.description]);

  // Simulate loading (remove this in production)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // SWR for fetching reviews
  const { data: reviewsData, error: reviewsError } = useSWR(
    `/api/reviews?productId=${product.id}`,
    fetcher,
    {
      refreshInterval: 30000,
      fallbackData: { reviews: product.reviews || [] },
    }
  );

  const reviews = reviewsData?.reviews || [];

  // Check if product is in wishlist
  useEffect(() => {
    const isInWishlist = state.wishlist.some(
      (item) => item.productId === product.id
    );
    setIsFavorited(isInWishlist);
  }, [state.wishlist, product.id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT" })
      .format(price)
      .replace("BDT", "৳");

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0]?.url || "/placeholder-product.jpg",
        color: product.colors.find((c) => c.id === selectedColor)?.name || "",
        size: "",
        slug: product.slug,
        stock: product.stock,
        maxQuantity: Math.min(product.stock, 10),
      });

      toast.success("Product added to cart successfully! 🛒");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (product.stock === 0) {
      toast.error("This product is out of stock.");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0]?.url || "/placeholder-product.jpg",
        color: product.colors.find((c) => c.id === selectedColor)?.name || "",
        size: "",
        slug: product.slug,
        stock: product.stock,
        maxQuantity: Math.min(product.stock, 10),
      });

      toast.success("Product added! Redirecting to checkout...");
      setTimeout(() => {
        router.push("/checkout");
      }, 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || "",
          url: window.location.href,
        });
        toast.success("Product shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard! 📋");
    }
  };

  const handleFavorite = async () => {
    if (isFavorited) {
      const wishlistItem = state.wishlist.find(
        (item) => item.productId === product.id
      );
      if (wishlistItem) {
        setIsAddingToWishlist(true);
        try {
          await removeFromWishlist(wishlistItem.id);
          setIsFavorited(false);
          toast.success("Removed from wishlist");
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          toast.error("Failed to remove from wishlist. Please try again.");
        } finally {
          setIsAddingToWishlist(false);
        }
      }
    } else {
      setIsAddingToWishlist(true);
      try {
        await addToWishlist({
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
        });
        setIsFavorited(true);
        toast.success("Added to wishlist! ❤️");
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add to wishlist. Please try again.");
      } finally {
        setIsAddingToWishlist(false);
      }
    }
  };

  // Improved image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
    setIsImageLoading(true);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
    setIsImageLoading(true);
    setIsZoomed(false);
  };

  // Zoom effect handlers
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Determine image layout based on count
  const getImageLayout = () => {
    const imageCount = product.images.length;

    if (imageCount === 1) return "single";
    if (imageCount === 2 || imageCount === 3) return "grid";
    return "carousel";
  };

  const imageLayout = getImageLayout();

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewData.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
        }),
      });

      if (response.ok) {
        setReviewData({ rating: 0, title: "", comment: "" });
        setShowReviewForm(false);
        mutate(`/api/reviews?productId=${product.id}`);
        toast.success(
          "Thank you for your review! It will be visible after verification. ✅"
        );
      } else {
        const error = await response.json();
        toast.error(
          error.error || "Failed to submit review. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  // Get current image based on index
  const currentImage = product.images[currentImageIndex] || product.images[0];

  // Helper function to get related product image
  const getRelatedProductImage = (relatedProduct: Product) => {
    return relatedProduct.images && relatedProduct.images.length > 0
      ? relatedProduct.images[0]
      : { url: "/placeholder-product.jpg", alt: relatedProduct.name };
  };

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review: Review) => review.rating === star).length,
  }));

  const totalReviews = reviews.length;

  // Show only 15 related products
  const displayedRelatedProducts = relatedProducts.slice(0, 15);

  // Skeleton Components
  const ImageSkeleton = () => (
    <div className="relative aspect-square w-full bg-gray-200 rounded-xl animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );

  const TextSkeleton = ({ lines = 1, className = "" }) => (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse mb-2 last:mb-0"
          style={{ width: i === lines - 1 ? "80%" : "100%" }}
        ></div>
      ))}
    </div>
  );

  const ButtonSkeleton = () => (
    <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
  );

  const ReviewSkeleton = () => (
    <div className="border-b border-gray-200 pb-6 last:border-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-32"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
    </div>
  );

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <ImageSkeleton />
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <TextSkeleton lines={2} className="mb-2" />
              <div className="flex gap-2 mt-2">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Price Skeleton */}
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>

            {/* Color Selection Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Quantity & Buttons Skeleton */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <ButtonSkeleton />
                <ButtonSkeleton />
              </div>
            </div>
          </div>
        </div>

        {/* Details Section Skeleton */}
        <section className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextSkeleton lines={4} />
            <TextSkeleton lines={4} />
          </div>
        </section>

        {/* Reviews Section Skeleton */}
        <section className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <ReviewSkeleton />
              <ReviewSkeleton />
            </div>
            <div className="md:col-span-2 space-y-6">
              <ReviewSkeleton />
              <ReviewSkeleton />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-brand-neutral-500 mb-6">
        <Link href="/" className="hover:text-brand-primary-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-primary-600">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/shop?category=${product.categoryId}`}
          className="hover:text-brand-primary-600"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-neutral-800">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image Section - IMPROVED */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-4">
          {/* Main Image with Zoom Effect */}
          <div
            className={`relative aspect-square w-full overflow-hidden rounded-lg cursor-${
              isZoomed ? "zoom-out" : "zoom-in"
            } transition-all duration-300 ${
              isZoomed ? "bg-gray-100" : "bg-white"
            }`}
            onMouseMove={handleImageMouseMove}
            onClick={toggleZoom}
          >
            {currentImage && (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || product.name}
                fill
                className={`object-contain transition-all duration-500 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={{
                  transformOrigin: isZoomed
                    ? `${zoomPosition.x}% ${zoomPosition.y}%`
                    : "center center",
                }}
                priority
                onLoad={() => setIsImageLoading(false)}
              />
            )}

            {/* Zoom Indicator */}
            {!isZoomed && (
              <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            )}

            {/* Loading Overlay */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Navigation Arrows - Only for carousel layout */}
            {imageLayout === "carousel" && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Image Gallery - IMPROVED LAYOUT */}
          {product.images.length > 1 && (
            <div
              className={`mt-4 ${
                imageLayout === "grid"
                  ? "grid grid-cols-2 gap-2"
                  : imageLayout === "carousel"
                  ? "flex gap-2 overflow-x-auto py-2"
                  : "flex gap-2"
              }`}
            >
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsImageLoading(true);
                    setIsZoomed(false);
                  }}
                  className={`relative rounded-md overflow-hidden border-2 transition-all hover:scale-105 ${
                    index === currentImageIndex
                      ? "border-brand-primary-600 shadow-md"
                      : "border-transparent hover:border-brand-primary-300"
                  } ${
                    imageLayout === "grid"
                      ? "aspect-square"
                      : "w-20 h-20 flex-shrink-0"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Dot Indicators for Carousel */}
          {imageLayout === "carousel" && product.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsImageLoading(true);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-brand-primary-600 w-4"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Share & Favorite Buttons */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 border-brand-neutral-300 hover:bg-brand-neutral-50"
            >
              <Share2 className="w-4 h-4 text-brand-neutral-600" />
              <span className="text-brand-neutral-700">Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFavorite}
              disabled={isAddingToWishlist}
              className="flex items-center gap-2 border-brand-neutral-300 hover:bg-brand-neutral-50 disabled:opacity-50"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited
                    ? "text-red-500 fill-red-500"
                    : "text-brand-neutral-600"
                }`}
              />
              <span className="text-brand-neutral-700">
                {isAddingToWishlist ? "..." : isFavorited ? "Saved" : "Save"}
              </span>
            </Button>
          </div>
        </div>

        {/* Product Info Section - REMOVED HIGHLIGHTS */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-neutral-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              {product.isNew && (
                <Badge className="bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white">
                  New
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-brand-gold-500 hover:bg-brand-gold-600 text-white">
                  Bestseller
                </Badge>
              )}
              {product.brand && (
                <Badge variant="outline" className="text-brand-neutral-600">
                  {product.brand.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-brand-sky-100 px-3 py-1 rounded-full">
              <div className="flex mr-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-brand-gold-400 fill-brand-gold-400"
                        : "text-brand-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-brand-sky-600">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <Link
              href="#reviews"
              className="text-sm text-brand-primary-600 hover:underline"
            >
              {totalReviews} reviews
            </Link>
            <span className="text-sm text-brand-neutral-400">|</span>
            <span className="text-sm text-brand-neutral-400">
              SKU: {product.sku || "N/A"}
            </span>
          </div>

          <Separator className="bg-brand-neutral-200" />

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-brand-neutral-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm bg-brand-secondary-100 text-brand-secondary-800 px-2 py-0.5 rounded">
                      {discountPercentage}% off
                    </span>
                  </>
                )}
            </div>
            <p className="text-sm text-brand-neutral-500">
              <span
                className={
                  product.stock > 0
                    ? "text-brand-secondary-500"
                    : "text-red-500"
                }
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
              {product.stock > 0 && ` - ${product.stock} available`}
            </p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-brand-neutral-900">Color:</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                      color.id === selectedColor
                        ? "border-brand-primary-600 shadow-md"
                        : "border-transparent hover:border-brand-primary-300"
                    }`}
                    style={{ backgroundColor: color.hexCode || "#ccc" }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart - IMPROVED FOR MOBILE */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-brand-neutral-300 rounded-md w-24">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-brand-neutral-600 hover:bg-brand-neutral-100 disabled:opacity-50 transition-colors"
                >
                  -
                </button>
                <span className="flex-1 text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-brand-neutral-600 hover:bg-brand-neutral-100 disabled:opacity-50 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-brand-neutral-500">
                Max {product.stock} available
              </span>
            </div>

            {/* IMPROVED BUTTONS FOR MOBILE */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="bg-brand-gold-400 hover:bg-brand-gold-500 text-brand-neutral-900 flex-1 py-3 sm:py-6 text-base sm:text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {isAddingToCart
                  ? "Adding..."
                  : product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || isAddingToCart}
                className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white flex-1 py-3 sm:py-6 text-base sm:text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                {isAddingToCart ? "Adding..." : "Buy Now"}
              </Button>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="border border-brand-neutral-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-brand-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-brand-neutral-900">Delivery</p>
                <p className="text-sm text-brand-neutral-600 mt-1">
                  Delivery by{" "}
                  {new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCw className="w-5 h-5 text-brand-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-brand-neutral-900">Returns</p>
                <p className="text-sm text-brand-neutral-600">
                  Free 30-day returns.{" "}
                  <Link
                    href="/returns"
                    className="text-brand-primary-600 hover:underline"
                  >
                    Details
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="mt-12 bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
        <h2 className="text-xl font-bold text-brand-neutral-900 mb-4">
          Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Description */}
          <div>
            <h3 className="font-medium text-brand-neutral-900 mb-2">
              Description
            </h3>
            <p className="text-brand-neutral-700">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="font-medium text-brand-neutral-900 mb-2">
              Specifications
            </h3>
            <div className="space-y-3">
              {product.specifications?.brand && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">Brand</span>
                  <span className="font-medium">
                    {product.specifications.brand}
                  </span>
                </div>
              )}
              {product.specifications?.countryOfOrigin && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">Origin</span>
                  <span className="font-medium">
                    {product.specifications.countryOfOrigin}
                  </span>
                </div>
              )}
              {product.specifications?.materials && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">Materials</span>
                  <span className="font-medium">
                    {product.specifications.materials}
                  </span>
                </div>
              )}
              {product.specifications?.packContains && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">
                    Package Includes
                  </span>
                  <span className="font-medium">
                    {product.specifications.packContains}
                  </span>
                </div>
              )}
              {product.specifications?.productType && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">Product type</span>
                  <span className="font-medium">
                    {product.specifications.productType}
                  </span>
                </div>
              )}
              {product.ageRange && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">Age Range</span>
                  <span className="font-medium">{product.ageRange}</span>
                </div>
              )}
              {product.specifications?.weight && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">Weight</span>
                  <span className="font-medium">
                    {product.specifications.weight}
                  </span>
                </div>
              )}
              {product.specifications?.dimensions && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">Dimensions</span>
                  <span className="font-medium">
                    {product.specifications.dimensions}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        id="reviews"
        className="mt-12 bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-neutral-900">
            Customer Reviews ({totalReviews})
          </h2>
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
            className="border-brand-primary-600 text-brand-primary-600 hover:bg-brand-primary-50"
          >
            Write a Review
          </Button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8 p-6 border border-brand-neutral-200 rounded-lg bg-brand-neutral-50">
            <h3 className="text-lg font-medium mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewData.rating
                            ? "text-brand-gold-400 fill-brand-gold-400"
                            : "text-brand-neutral-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {reviewData.rating > 0 && (
                  <p className="text-sm text-brand-neutral-600 mt-1">
                    You selected {reviewData.rating} star
                    {reviewData.rating !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reviewTitle"
                  className="block text-sm font-medium mb-2"
                >
                  Review Title
                </label>
                <input
                  type="text"
                  id="reviewTitle"
                  value={reviewData.title}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-brand-neutral-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                  placeholder="Summarize your experience"
                  maxLength={100}
                />
              </div>

              <div>
                <label
                  htmlFor="reviewComment"
                  className="block text-sm font-medium mb-2"
                >
                  Review *
                </label>
                <textarea
                  id="reviewComment"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full p-3 border border-brand-neutral-300 rounded-md focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                  placeholder="Share details of your experience with this product. What did you like? What could be improved?"
                  required
                  maxLength={1000}
                />
                <p className="text-sm text-brand-neutral-500 mt-1">
                  {reviewData.comment.length}/1000 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={
                    reviewData.rating === 0 ||
                    !reviewData.comment.trim() ||
                    isSubmitting
                  }
                  className="bg-brand-primary-600 hover:bg-brand-primary-700 disabled:bg-gray-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewData({ rating: 0, title: "", comment: "" });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {reviewsError && (
          <div className="text-center py-8 text-red-500">
            Failed to load reviews. Please try refreshing the page.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="bg-brand-neutral-50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">
                {product.rating.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-brand-gold-400 fill-brand-gold-400"
                          : "text-brand-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-brand-neutral-600">
                  {totalReviews} global ratings
                </p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-8">{star} star</span>
                  <div className="flex-1 h-2 bg-brand-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold-400 transition-all duration-300"
                      style={{
                        width: `${
                          totalReviews > 0 ? (count / totalReviews) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-brand-neutral-600 w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Cards */}
          <div className="md:col-span-2 space-y-6">
            {totalReviews > 0 ? (
              reviews.map((review: Review) => (
                <div
                  key={review.id}
                  className="border-b border-brand-neutral-200 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary-100 flex items-center justify-center text-brand-primary-600 font-medium">
                      {review.user.name?.charAt(0) ||
                        review.user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.user.name || review.user.email.split("@")[0]}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-brand-gold-400 fill-brand-gold-400"
                                : "text-brand-neutral-300"
                            }`}
                          />
                        ))}
                        {review.isVerified && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {review.title && (
                    <h3 className="font-medium mb-1">{review.title}</h3>
                  )}
                  <p className="text-brand-neutral-600 mb-2">
                    {review.comment}
                  </p>
                  <p className="text-xs text-brand-neutral-400">
                    Reviewed on{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-brand-neutral-300 mx-auto mb-4" />
                <p className="text-brand-neutral-600 mb-2">
                  No reviews yet for this product.
                </p>
                <p className="text-sm text-brand-neutral-500">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products - SHOW 15 PRODUCTS */}
      {displayedRelatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-brand-neutral-900 mb-6">
            Customers also bought ({displayedRelatedProducts.length} products)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedRelatedProducts.map((relatedProduct) => {
              const relatedImage = getRelatedProductImage(relatedProduct);
              const relatedDiscount =
                relatedProduct.originalPrice &&
                relatedProduct.originalPrice > relatedProduct.price
                  ? Math.round(
                      ((relatedProduct.originalPrice - relatedProduct.price) /
                        relatedProduct.originalPrice) *
                        100
                    )
                  : 0;

              return (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white border border-brand-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square bg-brand-neutral-50">
                    <Image
                      src={relatedImage.url}
                      alt={relatedImage.alt || relatedProduct.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                      loading="lazy"
                    />
                    {relatedProduct.isNew && (
                      <Badge className="absolute top-2 left-2 bg-brand-primary-600 text-white text-xs">
                        NEW
                      </Badge>
                    )}
                    {relatedDiscount > 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                        -{relatedDiscount}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-brand-neutral-900 group-hover:text-brand-primary-600 line-clamp-2 text-sm mb-1 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    {relatedProduct.brand && (
                      <p className="text-xs text-brand-neutral-500 mb-2">
                        {relatedProduct.brand.name}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(relatedProduct.rating)
                                ? "text-brand-gold-400 fill-brand-gold-400"
                                : "text-brand-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-brand-neutral-500">
                        ({relatedProduct.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-neutral-900">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.originalPrice &&
                        relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-xs text-brand-neutral-500 line-through">
                            {formatPrice(relatedProduct.originalPrice)}
                          </span>
                        )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
