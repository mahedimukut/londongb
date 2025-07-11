"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  Tag,
  ArrowRight,
  Sparkles,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const limitedOffers = [
  {
    id: 1,
    name: "Premium Baby Stroller",
    originalPrice: 29999,
    salePrice: 17999,
    discount: 40,
    image: "/images/deals/bath-skincare.png",
    unitsLeft: 15,
    isBestDeal: true,
  },
  {
    id: 2,
    name: "Organic Baby Clothing Set",
    originalPrice: 5999,
    salePrice: 3599,
    discount: 40,
    image: "/images/deals/diapering.jpeg",
    unitsLeft: 8,
  },
  {
    id: 3,
    name: "Smart Baby Monitor",
    originalPrice: 15999,
    salePrice: 12799,
    discount: 20,
    image: "/images/deals/feeding-nursing.jpeg",
    unitsLeft: 3,
  },
  {
    id: 4,
    name: "Convertible Car Seat",
    originalPrice: 24999,
    salePrice: 19999,
    discount: 20,
    image: "/images/deals/toys-learning.jpeg",
    unitsLeft: 5,
  },
];

export default function BestDeals() {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-brand-primary-50 overflow-hidden">
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
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center bg-brand-primary-100 text-brand-primary-600 px-5 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm"
          >
            <Zap className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-500" />
            LIMITED TIME OFFERS
          </motion.div>
          <h2 className="text-4xl font-bold text-brand-neutral-800 mb-4">
            <span className="bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 bg-clip-text text-transparent">
              Exclusive Deals
            </span>{" "}
            For Smart Parents
          </h2>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto text-lg">
            Don't miss these special discounts on premium baby products
          </p>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {limitedOffers.map((deal, index) => (
            <motion.div
              key={`${deal.id}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-white/20 relative"
            >
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(deal.id)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-pink-50 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    wishlist.includes(deal.id)
                      ? "fill-pink-500 text-pink-500"
                      : "text-gray-400 hover:text-pink-500"
                  }`}
                />
              </button>

              {/* Discount Ribbon */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                {deal.discount}% OFF
              </div>

              {/* Best Deal Badge */}
              {deal.isBestDeal && (
                <div className="absolute top-16 left-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                  BEST DEAL
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  quality={90}
                />
                {/* Hover Quick Add */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="flex items-center gap-2 bg-white text-brand-primary-600 px-4 py-2 rounded-full font-medium hover:bg-brand-primary-50 transition-colors shadow-md">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Deal Info */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-brand-neutral-800 mb-3 group-hover:text-brand-primary-600 transition-colors">
                  {deal.name}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-brand-primary-600">
                      {formatPrice(deal.salePrice)}
                    </span>
                    <span className="text-brand-neutral-400 line-through">
                      {formatPrice(deal.originalPrice)}
                    </span>
                  </div>
                  <div className="text-xs bg-brand-primary-50 text-brand-primary-600 px-2 py-1 rounded">
                    Save {formatPrice(deal.originalPrice - deal.salePrice)}
                  </div>
                </div>

                {/* Stock Indicator */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-sm text-brand-neutral-600 mb-1">
                    <span>Available: {deal.unitsLeft} units</span>
                    <span>{Math.round((deal.unitsLeft / 20) * 100)}% left</span>
                  </div>
                  <div className="h-2 w-full bg-brand-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary-500 to-brand-primary-600"
                      style={{ width: `${(deal.unitsLeft / 20) * 100}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/deals/${deal.id}`}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/deals"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white font-medium rounded-full text-base shadow-lg hover:shadow-xl transition-all group"
          >
            <span className="mr-2">View All Special Offers</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
