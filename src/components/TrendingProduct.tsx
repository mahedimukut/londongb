"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, ArrowRight, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

const trendingProducts = [
  {
    id: 1,
    name: "Organic Cotton Bodysuit",
    price: 2499,
    rating: 4.8,
    reviews: 142,
    image: "/images/categories/newborn-essential.jpeg",
    colors: ["pink", "blue", "mint"],
    isNew: true,
    discount: 15,
  },
  {
    id: 2,
    name: "Smart Baby Monitor",
    price: 12999,
    rating: 4.9,
    reviews: 89,
    image: "/images/categories/feeding-nursing.jpeg",
    colors: ["white"],
    isBestSeller: true,
  },
  {
    id: 3,
    name: "Convertible Baby Carrier",
    price: 8999,
    rating: 4.7,
    reviews: 203,
    image: "/images/categories/diapering.jpeg",
    colors: ["gray", "navy"],
    discount: 20,
  },
  {
    id: 4,
    name: "Teething Toys Set",
    price: 1999,
    rating: 4.6,
    reviews: 317,
    image: "/images/categories/toys-learning.jpeg",
    colors: ["green", "yellow"],
    isNew: true,
  },
  {
    id: 5,
    name: "Nursing Pillow",
    price: 3999,
    rating: 4.8,
    reviews: 156,
    image: "/images/categories/bath-skincare.png",
    colors: ["beige"],
    isBestSeller: true,
  },
  {
    id: 6,
    name: "Baby Memory Book",
    price: 2999,
    rating: 4.9,
    reviews: 42,
    image: "/images/categories/nursery-decor.png",
    colors: ["ivory"],
    discount: 10,
  },
  {
    id: 7,
    name: "Baby Bottle Set",
    price: 3499,
    rating: 4.7,
    reviews: 178,
    image: "/images/categories/moms-care.jpeg",
    colors: ["clear", "blue"],
  },
  {
    id: 8,
    name: "Stroller Organizer",
    price: 2299,
    rating: 4.5,
    reviews: 64,
    image: "/images/categories/baby-clothing.png",
    colors: ["black"],
    isNew: true,
  },
];

type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
};

const ProductCard = ({ product }: { product: Product }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isFavorite, setIsFavorite] = useState(false);

  const colorMap: Record<string, string> = {
    pink: "bg-pink-500",
    blue: "bg-blue-500",
    mint: "bg-teal-300",
    white: "bg-white border border-gray-200",
    gray: "bg-gray-400",
    navy: "bg-blue-800",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    beige: "bg-amber-100",
    ivory: "bg-ivory-100",
    clear: "bg-gray-100",
    black: "bg-black",
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-white/20"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden h-72">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          quality={90}
        />

        {/* Hover CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
          <Link
            href={`/products/${product.id}`}
            className="w-full flex items-center justify-center bg-white text-brand-primary-600 px-4 py-3 rounded-lg font-medium hover:bg-brand-primary-50 transition-colors shadow-md"
          >
            Quick View <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          {product.isNew && (
            <span className="bg-brand-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              BESTSELLER
            </span>
          )}
          {product.discount && (
            <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-brand-neutral-800 mb-2 group-hover:text-brand-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-xl font-bold text-brand-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.discount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.price * (1 + product.discount / 100))}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full bg-brand-primary-50 text-brand-primary-600 hover:bg-brand-primary-100 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-pink-500 text-pink-500" : ""
                }`}
              />
            </button>
            <button className="p-2 rounded-full bg-brand-primary-50 text-brand-primary-600 hover:bg-brand-primary-100 transition-colors">
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Rating & Colors */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              ({product.reviews})
            </span>
          </div>

          <div className="flex space-x-1">
            {product.colors.map((color) => (
              <span
                key={color}
                className={`h-4 w-4 rounded-full ${colorMap[color]}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TrendingProducts() {
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed to false to ensure it triggers every time
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-brand-primary-50 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-brand-primary-100/30 blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-brand-primary-200/20 blur-3xl"></div>
      </div>

      {/* Floating sparkles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute text-yellow-300"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        >
          <Sparkles size={20} className="opacity-70" />
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center bg-brand-primary-100 text-brand-primary-600 px-5 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Trending Now
          </motion.div>
          <h2 className="text-4xl font-bold text-brand-neutral-800 mb-4">
            <span className="bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 bg-clip-text text-transparent">
              Parents' Favorite
            </span>{" "}
            Picks
          </h2>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto text-lg">
            Discover the most loved baby products this season
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trendingProducts.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-16"
        >
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white font-medium rounded-full text-base shadow-lg hover:shadow-xl transition-all group"
          >
            <span className="mr-2">Explore All Products</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
