"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Clock,
  Zap,
  ChevronRight,
  Tag,
  Gift,
  Truck,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = {
  id: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  category: string;
  isNew: boolean;
  stock: number;
};

const saleProducts: Product[] = [
  {
    id: 1,
    name: "Organic Cotton Bodysuit (Pack of 3)",
    originalPrice: 3499,
    salePrice: 2499,
    rating: 4.8,
    reviews: 142,
    image: "/images/categories/newborn-essential.jpeg",
    colors: ["pink", "blue", "mint"],
    category: "clothing",
    isNew: true,
    stock: 5,
  },
  {
    id: 2,
    name: "Teething Toys Set (4 Pieces)",
    originalPrice: 2999,
    salePrice: 1999,
    rating: 4.6,
    reviews: 317,
    image: "/images/categories/toys-learning.jpeg",
    colors: ["green", "yellow"],
    category: "toys",
    isNew: false,
    stock: 12,
  },
  {
    id: 3,
    name: "Premium Nursing Pillow",
    originalPrice: 4599,
    salePrice: 3299,
    rating: 4.9,
    reviews: 89,
    image: "/images/categories/moms-care.jpeg",
    colors: ["gray", "blue"],
    category: "nursing",
    isNew: true,
    stock: 3,
  },
  {
    id: 4,
    name: "Baby Bath Essentials Kit",
    originalPrice: 3999,
    salePrice: 2999,
    rating: 4.7,
    reviews: 120,
    image: "/images/categories/bath-skincare.png",
    colors: ["white"],
    category: "bath",
    isNew: false,
    stock: 8,
  },
  {
    id: 5,
    name: "Portable Bottle Warmer",
    originalPrice: 4299,
    salePrice: 3499,
    rating: 4.6,
    reviews: 98,
    image: "/images/categories/feeding-nursing.jpeg",
    colors: ["gray"],
    category: "feeding",
    isNew: true,
    stock: 2,
  },
  {
    id: 6,
    name: "Baby Carrier (Ergonomic)",
    originalPrice: 5999,
    salePrice: 3999,
    rating: 4.8,
    reviews: 203,
    image: "/images/categories/nursery-decor.png",
    colors: ["navy", "gray"],
    category: "accessories",
    isNew: false,
    stock: 7,
  },
];

const SaleCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const seconds = prev.seconds - 1;
        const minutes = seconds < 0 ? prev.minutes - 1 : prev.minutes;
        const hours = minutes < 0 ? prev.hours - 1 : prev.hours;

        return {
          hours: hours < 0 ? 0 : hours,
          minutes: minutes < 0 ? 59 : minutes,
          seconds: seconds < 0 ? 59 : seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-7xl mx-auto flex items-center justify-center gap-3 mb-6 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md border border-white"
    >
      <div className="flex items-center bg-red-600 text-white px-3 py-1 rounded-full">
        <Zap className="h-4 w-4 mr-1" fill="white" />
        <span className="font-bold text-sm">FLASH SALE</span>
      </div>
      <span className="font-bold text-gray-700">ENDS IN:</span>
      <div className="flex gap-1 font-mono">
        <span className="bg-red-600 text-white px-2 py-1 rounded-md shadow-sm">
          {timeLeft.hours.toString().padStart(2, "0")}
        </span>
        <span className="text-red-600 font-bold">:</span>
        <span className="bg-red-600 text-white px-2 py-1 rounded-md shadow-sm">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-red-600 font-bold">:</span>
        <span className="bg-red-600 text-white px-2 py-1 rounded-md shadow-sm">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const discountPercent = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sale Badge */}
      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
        {discountPercent}% OFF
      </div>

      {/* New Badge */}
      {product.isNew && (
        <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
          NEW
        </div>
      )}

      {/* Low Stock Warning */}
      {product.stock < 5 && (
        <div className="absolute top-12 left-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full shadow-sm">
          Only {product.stock} left!
        </div>
      )}

      <div className="relative h-60 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-gray-400 hover:text-pink-500 transition-colors"
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                isFavorite ? "fill-pink-500 text-pink-500 scale-110" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="mb-4">
          <span className="text-gray-400 line-through mr-2 text-sm">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="text-red-600 font-bold text-lg">
            {formatPrice(product.salePrice)}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

const CategoryPill = ({
  category,
  activeCategory,
  onClick,
}: {
  category: string;
  activeCategory: string;
  onClick: () => void;
}) => {
  const isActive = activeCategory === category;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-2 rounded-full mr-2 transition-all ${
        isActive
          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
      }`}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </motion.button>
  );
};

const BenefitCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-start"
  >
    <div className="bg-pink-100 p-2 rounded-full mr-3">
      <Icon className="h-5 w-5 text-pink-600" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </motion.div>
);

export default function SalePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts =
    activeCategory === "all"
      ? saleProducts
      : saleProducts.filter((product) => product.category === activeCategory);

  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-r from-pink-500 to-purple-500 py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] bg-repeat"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block"
            >
              <span className="bg-white text-pink-700 px-4 py-2 rounded-full text-sm font-bold inline-flex items-center shadow-lg">
                <Zap className="h-4 w-4 mr-2" fill="#ec4899" />
                LIMITED TIME OFFER
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md"
            >
              Summer Baby Sale
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-sm"
            >
              Up to 50% off on must-have baby & mom essentials. Limited time
              only!
            </motion.p>
            <SaleCountdown />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <BenefitCard
              icon={Tag}
              title="Huge Discounts"
              description="Up to 50% off on selected items"
            />
            <BenefitCard
              icon={Truck}
              title="Free Shipping"
              description="On all orders over ৳2000"
            />
            <BenefitCard
              icon={Gift}
              title="Free Gift"
              description="With purchases over ৳5000"
            />
            <BenefitCard
              icon={Shield}
              title="Secure Payment"
              description="100% secure checkout"
            />
          </div>
        </section>

        {/* Category Navigation */}
        <section className="max-w-7xl mx-auto px-4 py-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10 shadow-sm">
          <div className="flex overflow-x-auto pb-4 scrollbar-hide">
            {[
              "all",
              "clothing",
              "toys",
              "nursing",
              "bath",
              "feeding",
              "accessories",
            ].map((category) => (
              <CategoryPill
                key={category}
                category={category}
                activeCategory={activeCategory}
                onClick={() => setActiveCategory(category)}
              />
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No products found in this category
              </h3>
              <button
                onClick={() => setActiveCategory("all")}
                className="text-pink-600 font-medium hover:underline"
              >
                View all sale items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Don't Miss Out On These Deals!
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              The sale ends soon. Shop now before these items are gone!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/shop"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center"
              >
                Shop All Deals <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
