import { allProducts } from "@/app/allProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ChevronLeft,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = parseInt(params.id);
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return notFound();

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm mb-6">
          <Link href="/" className="text-brand-primary-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-brand-neutral-400">/</span>
          <Link href="/shop" className="text-brand-primary-600 hover:underline">
            Shop
          </Link>
          <span className="mx-2 text-brand-neutral-400">/</span>
          <span className="text-brand-neutral-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-5 h-5 text-brand-primary-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCw className="w-5 h-5 text-brand-primary-600" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-5 h-5 text-brand-primary-600" />
                <span>2-Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {/* Title & Badges */}
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-brand-neutral-900">
                  {product.name}
                </h1>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Heart className="w-5 h-5 text-brand-neutral-400 hover:text-brand-primary-600" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {product.isNew && (
                  <Badge className="bg-brand-primary-600 text-white">
                    New Arrival
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-brand-secondary-500 text-white">
                    Bestseller
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-brand-gold-400 text-white">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-brand-neutral-100 px-2 py-1 rounded-full">
                <div className="flex">
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
                <span className="ml-1 text-sm font-medium">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-brand-neutral-500">
                {product.reviews} reviews
              </span>
              <button className="text-sm text-brand-primary-600 hover:underline">
                Write a review
              </button>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-brand-neutral-900">
                  £{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-brand-neutral-400 line-through">
                    £{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="ml-2 bg-brand-primary-100 text-brand-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-brand-neutral-500">
                or 4 interest-free payments of £{(product.price / 4).toFixed(2)}{" "}
                with
              </p>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-brand-neutral-700">
                Color: <span className="font-normal">{product.colors[0]}</span>
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 ${
                      color === product.colors[0]
                        ? "border-brand-primary-600"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>

            {/* Simple Add to Cart (since you don't have the component) */}
            <div className="space-y-3">
              <div className="flex items-center border border-brand-neutral-200 rounded-lg w-24">
                <button className="px-3 py-2 text-lg">-</button>
                <span className="flex-1 text-center">1</span>
                <button className="px-3 py-2 text-lg">+</button>
              </div>
              <Button
                size="lg"
                className="w-full bg-brand-primary-600 hover:bg-brand-primary-700"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="p-4 bg-brand-neutral-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 mt-0.5 text-brand-primary-600" />
                <div>
                  <p className="font-medium">Free delivery</p>
                  <p className="text-sm text-brand-neutral-600">
                    Order now and get it by{" "}
                    {new Date(
                      Date.now() + 3 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="border-b border-brand-neutral-200 pb-4">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-brand-neutral-700">{product.description}</p>
              </div>

              <div className="border-b border-brand-neutral-200 pb-4">
                <h3 className="text-lg font-medium mb-2">Specifications</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between py-2 border-b border-brand-neutral-100">
                    <span className="text-brand-neutral-600">Brand</span>
                    <span className="font-medium">
                      {product.specifications.brand}
                    </span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-brand-neutral-100">
                    <span className="text-brand-neutral-600">Origin</span>
                    <span className="font-medium">
                      {product.specifications.countryOfOrigin}
                    </span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-brand-neutral-100">
                    <span className="text-brand-neutral-600">Materials</span>
                    <span className="font-medium">
                      {product.specifications.materials}
                    </span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span className="text-brand-neutral-600">Includes</span>
                    <span className="font-medium">
                      {product.specifications.packContains}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-brand-neutral-900">
              Customer Reviews
            </h2>
            <Button
              variant="outline"
              className="border-brand-primary-600 text-brand-primary-600 hover:bg-brand-primary-50"
            >
              Write a Review
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Review Summary */}
            <div className="bg-brand-neutral-50 p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold">{product.rating}</div>
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
                    Based on {product.reviews} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-6">
              {[1, 2].map((review) => (
                <div
                  key={review}
                  className="border-b border-brand-neutral-200 pb-6"
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
                  <p className="text-brand-neutral-600 mb-2">
                    {review === 1
                      ? "This product exceeded my expectations. My baby loves it and it's very durable."
                      : "The materials are high quality and it's exactly as described. Would recommend!"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group"
                >
                  <div className="aspect-square relative overflow-hidden rounded-xl bg-brand-neutral-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform p-4"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium text-brand-neutral-800 group-hover:text-brand-primary-600 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold text-brand-neutral-900">
                        £{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-brand-neutral-400 line-through">
                          £{product.originalPrice}
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
      <Footer />
    </>
  );
}
