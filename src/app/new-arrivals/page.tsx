"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Define product type
type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  isNew: boolean;
  category: string;
};

const allProducts: Product[] = [
  {
    id: 1,
    name: "Organic Cotton Bodysuit",
    price: 2499,
    rating: 4.8,
    reviews: 142,
    image: "/images/categories/newborn-essential.jpeg",
    colors: ["pink", "blue", "mint"],
    isNew: true,
    category: "clothing",
  },
  {
    id: 2,
    name: "Teething Toys Set",
    price: 1999,
    rating: 4.6,
    reviews: 317,
    image: "/images/categories/toys-learning.jpeg",
    colors: ["green", "yellow"],
    isNew: true,
    category: "toys",
  },
  {
    id: 3,
    name: "Stroller Organizer",
    price: 2299,
    rating: 4.5,
    reviews: 64,
    image: "/images/categories/baby-clothing.png",
    colors: ["black"],
    isNew: true,
    category: "accessories",
  },
  {
    id: 4,
    name: "Soft Baby Blanket",
    price: 1799,
    rating: 4.9,
    reviews: 89,
    image: "/images/categories/bath-skincare.png",
    colors: ["beige"],
    isNew: true,
    category: "nursery",
  },
  {
    id: 5,
    name: "Baby Bath Essentials Kit",
    price: 2999,
    rating: 4.7,
    reviews: 120,
    image: "/images/categories/moms-care.jpeg",
    colors: ["white"],
    isNew: true,
    category: "bath",
  },
  {
    id: 6,
    name: "Portable Bottle Warmer",
    price: 3499,
    rating: 4.6,
    reviews: 98,
    image: "/images/categories/nursery-decor.png",
    colors: ["gray"],
    isNew: true,
    category: "feeding",
  },
  {
    id: 7,
    name: "Organic Baby Hat",
    price: 1299,
    rating: 4.7,
    reviews: 56,
    image: "/images/categories/newborn-essential.jpeg",
    colors: ["white", "blue"],
    isNew: true,
    category: "clothing",
  },
  {
    id: 8,
    name: "Baby Carrier",
    price: 3999,
    rating: 4.8,
    reviews: 203,
    image: "/images/categories/moms-care.jpeg",
    colors: ["navy", "gray"],
    isNew: true,
    category: "accessories",
  },
  {
    id: 9,
    name: "Baby Bottle Set",
    price: 1599,
    rating: 4.5,
    reviews: 78,
    image: "/images/categories/moms-care.jpeg",
    colors: ["pink", "blue"],
    isNew: true,
    category: "feeding",
  },
  {
    id: 10,
    name: "Educational Activity Gym",
    price: 4299,
    rating: 4.9,
    reviews: 112,
    image: "/images/categories/toys-learning.jpeg",
    colors: ["multi"],
    isNew: true,
    category: "toys",
  },
  {
    id: 11,
    name: "Baby Nail Care Set",
    price: 899,
    rating: 4.4,
    reviews: 45,
    image: "/images/categories/bath-skincare.png",
    colors: ["white"],
    isNew: true,
    category: "bath",
  },
  {
    id: 12,
    name: "Nursery Night Light",
    price: 1899,
    rating: 4.7,
    reviews: 203,
    image: "/images/categories/nursery-decor.png",
    colors: ["white"],
    isNew: true,
    category: "nursery",
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isFavorite, setIsFavorite] = useState(false);

  const colorMap: { [key: string]: string } = {
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
    multi: "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
  };

  const categoryColorMap: { [key: string]: string } = {
    clothing: "bg-blue-100 text-blue-800",
    toys: "bg-green-100 text-green-800",
    accessories: "bg-purple-100 text-purple-800",
    nursery: "bg-yellow-100 text-yellow-800",
    bath: "bg-teal-100 text-teal-800",
    feeding: "bg-pink-100 text-pink-800",
  };

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
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-white/20"
    >
      <div className="relative overflow-hidden h-72 group">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
          <Link
            href={`/products/${product.id}`}
            className="w-full flex items-center justify-center bg-white text-brand-primary-600 px-4 py-3 rounded-lg font-medium hover:bg-brand-primary-50 transition-colors shadow-md"
          >
            Quick View <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute top-4 right-4 pointer-events-none"
        >
          <Heart className="h-6 w-6 text-pink-400 fill-pink-400/20" />
        </motion.div>

        {product.isNew && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
            NEW
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-brand-neutral-800 group-hover:text-brand-primary-600 transition-colors">
            {product.name}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded capitalize ${
              categoryColorMap[product.category]
            }`}
          >
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-brand-primary-600">
            {formatPrice(product.price)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className="p-2 rounded-full bg-brand-primary-50 text-brand-primary-600 hover:bg-brand-primary-100 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-pink-500 text-pink-500" : ""
                }`}
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-2 rounded-full bg-brand-primary-50 text-brand-primary-600 hover:bg-brand-primary-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center">
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
            <span className="ml-2 text-sm text-gray-500">
              ({product.reviews})
            </span>
          </div>

          <div className="flex space-x-1">
            {product.colors.map((color: string) => (
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

export default function NewArrivals() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("featured");
  const [filterOption, setFilterOption] = useState("all");
  const perPage = 8;

  // Sort products based on selected option
  const sortedProducts = [...allProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Filter products based on selected option
  const filteredProducts = sortedProducts.filter((product) => {
    if (filterOption === "all") return true;
    return product.category === filterOption;
  });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  return (
    <>
      <Header />
      <section
        ref={ref}
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-brand-primary-50 min-h-screen"
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
          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mb-16 shadow-lg"
          >
            <Image
              src="/images/global/newly-arrived.jpg"
              alt="New Arrivals Banner"
              width={1200}
              height={400}
              className="w-full h-64 object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
              <h2 className="text-4xl sm:text-5xl font-bold mb-2">
                Just Landed: New Arrivals
              </h2>
              <p className="text-lg sm:text-xl max-w-2xl">
                Shop the freshest baby essentials handpicked for your little
                one.
              </p>
            </div>
          </motion.div>

          {/* Filter/Sort Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          >
            <div className="text-sm text-brand-neutral-600">
              Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
              products
            </div>
            <div className="flex gap-3">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border border-brand-primary-100 rounded-lg bg-white text-brand-neutral-700"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Best Rated</option>
              </select>
              <select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                className="px-4 py-2 border border-brand-primary-100 rounded-lg bg-white text-brand-neutral-700"
              >
                <option value="all">All Categories</option>
                <option value="clothing">Clothing</option>
                <option value="toys">Toys & Learning</option>
                <option value="feeding">Feeding</option>
                <option value="nursery">Nursery</option>
                <option value="bath">Bath & Skincare</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </motion.div>

          {/* Product Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {paginatedProducts.map((product, index) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-16 flex justify-center items-center gap-2"
            >
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-full bg-white border border-brand-primary-100 text-brand-primary-600 hover:bg-brand-primary-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full ${
                    page === i + 1
                      ? "bg-brand-primary-600 text-white"
                      : "bg-white text-brand-primary-600 hover:bg-brand-primary-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-full bg-white border border-brand-primary-100 text-brand-primary-600 hover:bg-brand-primary-50 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 bg-brand-primary-600 text-white p-3 rounded-full shadow-lg z-10"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      </section>
      <Footer />
    </>
  );
}
