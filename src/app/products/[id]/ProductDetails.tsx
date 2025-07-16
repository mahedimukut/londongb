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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  category: string;
  description: string;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  colors: string[];
  ageRange?: string;
  specifications: {
    brand: string;
    countryOfOrigin: string;
    materials: string;
    packContains: string;
  };
}

interface ProductPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Added to cart:", {
      productId: product.id,
      quantity,
      color: selectedColor,
    });
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log("Buy now:", {
      productId: product.id,
      quantity,
      color: selectedColor,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Add to favorites logic here
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

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
        <span className="text-brand-neutral-800">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image Section */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-4">
          {/* Main Image */}
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain rounded-sm"
              priority={currentImageIndex === 0}
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-4 mt-4 overflow-x-auto py-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(index)}
                className={`flex-shrink-0 w-24 h-24 mx-auto relative rounded-md overflow-hidden border-2 ${
                  index === currentImageIndex
                    ? "border-brand-primary-600"
                    : "border-transparent"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

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
              className="flex items-center gap-2 border-brand-neutral-300 hover:bg-brand-neutral-50"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited
                    ? "text-red-500 fill-red-500"
                    : "text-brand-neutral-600"
                }`}
              />
              <span className="text-brand-neutral-700">
                {isFavorited ? "Saved" : "Save"}
              </span>
            </Button>
          </div>
        </div>

        {/* Product Info Section */}
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
              {product.reviews} reviews
            </Link>
            <span className="text-sm text-brand-neutral-400">|</span>
            <span className="text-sm text-brand-neutral-400">
              100+ bought in past month
            </span>
          </div>

          <Separator className="bg-brand-neutral-200" />

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-neutral-900">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-brand-neutral-500 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-sm bg-brand-secondary-100 text-brand-secondary-800 px-2 py-0.5 rounded">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % off
                </span>
              )}
            </div>
            <p className="text-sm text-brand-neutral-500">
              <span className="text-brand-secondary-500">In Stock</span> - Only{" "}
              {product.stock} left
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h3 className="font-medium text-brand-neutral-900">Highlights:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-brand-neutral-700">
              <li>Premium quality materials</li>
              <li>Safe for babies and children</li>
              <li>Easy to clean and maintain</li>
              {product.ageRange && <li>Recommended for {product.ageRange}</li>}
            </ul>
          </div>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-brand-neutral-900">Color:</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      color === selectedColor
                        ? "border-brand-primary-600"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-brand-neutral-300 rounded-md w-24">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-brand-neutral-600 hover:bg-brand-neutral-100 disabled:opacity-50"
                >
                  -
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-brand-neutral-600 hover:bg-brand-neutral-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-brand-neutral-500">
                {product.stock} available
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                className="bg-brand-gold-400 hover:bg-brand-gold-500 text-brand-neutral-900 flex-1 py-6 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white flex-1 py-6 text-lg"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="border border-brand-neutral-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-brand-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-brand-neutral-900">Delivery</p>
                <p className="text-sm text-brand-neutral-600">
                  <span className="text-brand-secondary-500">
                    Free delivery
                  </span>{" "}
                  on orders over ৳500
                </p>
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
                    href="#"
                    className="text-brand-primary-600 hover:underline"
                  >
                    Details
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-brand-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-brand-neutral-900">Warranty</p>
                <p className="text-sm text-brand-neutral-600">
                  1 year manufacturer warranty
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
            <p className="text-brand-neutral-700">{product.description}</p>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="font-medium text-brand-neutral-900 mb-2">
              Specifications
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                <span className="text-brand-neutral-600">Brand</span>
                <span className="font-medium">
                  {product.specifications.brand}
                </span>
              </div>
              <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                <span className="text-brand-neutral-600">Origin</span>
                <span className="font-medium">
                  {product.specifications.countryOfOrigin}
                </span>
              </div>
              <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                <span className="text-brand-neutral-600">Materials</span>
                <span className="font-medium">
                  {product.specifications.materials}
                </span>
              </div>
              <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                <span className="text-brand-neutral-600">Package Includes</span>
                <span className="font-medium">
                  {product.specifications.packContains}
                </span>
              </div>
              {product.ageRange && (
                <div className="flex justify-between border-b border-brand-neutral-100 pb-2">
                  <span className="text-brand-neutral-600">Age Range</span>
                  <span className="font-medium">{product.ageRange}</span>
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
            Customer Reviews
          </h2>
          <Button
            variant="outline"
            className="border-brand-primary-600 text-brand-primary-600 hover:bg-brand-primary-50"
          >
            Write a Review
          </Button>
        </div>

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
                  {product.reviews} global ratings
                </p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-8">{star} star</span>
                  <div className="flex-1 h-2 bg-brand-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold-400"
                      style={{ width: `${(product.rating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-brand-neutral-600 w-8 text-right">
                    {Math.round((product.rating / 5) * product.reviews)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Cards */}
          <div className="md:col-span-2 space-y-6">
            {[1, 2].map((review) => (
              <div
                key={review}
                className="border-b border-brand-neutral-200 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-neutral-200 flex items-center justify-center text-brand-neutral-500">
                    {review === 1 ? "JD" : "SM"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {review === 1 ? "John D." : "Sarah M."}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4
                              ? "text-brand-gold-400 fill-brand-gold-400"
                              : "text-brand-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium mb-1">
                  {review === 1
                    ? "Perfect for my baby!"
                    : "Great quality product"}
                </h3>
                <p className="text-brand-neutral-600 mb-2">
                  {review === 1
                    ? "This product exceeded my expectations. My baby loves it and it's very durable. The materials feel high quality and it's easy to clean."
                    : "Exactly as described. The quality is excellent for the price. Would definitely recommend to other parents!"}
                </p>
                <p className="text-xs text-brand-neutral-400">
                  Reviewed on{" "}
                  {new Date(
                    Date.now() - review * 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-brand-neutral-900 mb-6">
            Customers also bought
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white border border-brand-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative aspect-square bg-brand-neutral-50">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform p-4"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-brand-neutral-900 group-hover:text-brand-primary-600 line-clamp-2 text-sm">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-brand-gold-400 fill-brand-gold-400"
                              : "text-brand-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-brand-neutral-500">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold text-brand-neutral-900">
                      ৳{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-brand-neutral-500 line-through ml-1">
                        ৳{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
