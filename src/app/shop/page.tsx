"use client";

import { useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  ChevronDown,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Check,
  X,
  Sliders,
  Loader2,
  Heart,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  category: string;
  stock: number;
  ageRange?: string;
};

const allProducts: Product[] = [
  // Clothing (8 items)
  {
    id: 1,
    name: "Organic Cotton Bodysuits (Pack of 5)",
    price: 3499,
    originalPrice: 3999,
    rating: 4.8,
    reviews: 142,
    image: "/images/products/baby-clothing.png",
    colors: ["white", "gray", "yellow"],
    isNew: true,
    isBestSeller: true,
    category: "clothing",
    stock: 42,
    ageRange: "0-6m",
  },
  {
    id: 2,
    name: "Baby Romper with Hat Set",
    price: 1799,
    rating: 4.5,
    reviews: 87,
    image: "/images/products/bath-skincare.png",
    colors: ["blue", "pink"],
    category: "clothing",
    stock: 15,
    ageRange: "6-12m",
  },
  {
    id: 3,
    name: "Premium Baby Kimono Set",
    price: 2299,
    originalPrice: 2599,
    rating: 4.7,
    reviews: 64,
    image: "/images/products/diapering.jpeg",
    colors: ["white", "beige"],
    isNew: true,
    category: "clothing",
    stock: 28,
    ageRange: "0-3m",
  },
  {
    id: 4,
    name: "Baby Sun Hat with UV Protection",
    price: 799,
    rating: 4.3,
    reviews: 56,
    image: "/images/products/feeding-nursing.jpeg",
    colors: ["white", "blue"],
    category: "clothing",
    stock: 39,
    ageRange: "0-12m",
  },
  {
    id: 5,
    name: "Soft Sole Baby Shoes (Pair)",
    price: 1199,
    rating: 4.6,
    reviews: 92,
    image: "/images/products/moms-care.jpeg",
    colors: ["pink", "blue"],
    category: "clothing",
    stock: 25,
    ageRange: "6-12m",
  },
  {
    id: 6,
    name: "Baby Winter Jacket",
    price: 2899,
    originalPrice: 3299,
    rating: 4.7,
    reviews: 34,
    image: "/images/products/stroller-carriers.jpeg",
    colors: ["red", "navy"],
    category: "clothing",
    stock: 18,
    ageRange: "3-6m",
  },
  {
    id: 7,
    name: "Cotton Baby Socks (Pack of 6)",
    price: 699,
    rating: 4.4,
    reviews: 128,
    image: "/images/products/toys-learning.jpeg",
    colors: ["multi"],
    category: "clothing",
    stock: 50,
    ageRange: "24-36m",
  },
  {
    id: 8,
    name: "Baby Denim Overalls",
    price: 2499,
    rating: 4.5,
    reviews: 76,
    image: "/images/products/baby-clothing.png",
    colors: ["blue", "black"],
    category: "clothing",
    stock: 22,
    ageRange: "12-24m",
  },

  // Toys & Learning (6 items)
  {
    id: 9,
    name: "Montessori Wooden Activity Cube",
    price: 4999,
    rating: 4.9,
    reviews: 203,
    image: "/images/products/bath-skincare.png",
    colors: ["natural"],
    isBestSeller: true,
    category: "toys",
    stock: 8,
    ageRange: "6-24m",
  },
  {
    id: 10,
    name: "Sensory Teething Toys Set",
    price: 1299,
    rating: 4.6,
    reviews: 156,
    image: "/images/products/diapering.jpeg",
    colors: ["multi"],
    category: "toys",
    stock: 34,
    ageRange: "3-12m",
  },
  {
    id: 11,
    name: "Baby Piano Play Gym",
    price: 3599,
    originalPrice: 3999,
    rating: 4.8,
    reviews: 98,
    image: "/images/products/feeding-nursing.jpeg",
    colors: ["multi"],
    isNew: true,
    category: "toys",
    stock: 12,
    ageRange: "0-12m",
  },
  {
    id: 12,
    name: "Stacking Rings Toy",
    price: 899,
    rating: 4.5,
    reviews: 87,
    image: "/images/products/moms-care.jpeg",
    colors: ["multi"],
    category: "toys",
    stock: 45,
    ageRange: "6-18m",
  },
  {
    id: 13,
    name: "Soft Plush Rattle Set",
    price: 1499,
    rating: 4.7,
    reviews: 112,
    image: "/images/products/stroller-carriers.jpeg",
    colors: ["multi"],
    category: "toys",
    stock: 28,
    ageRange: "0-6m",
  },
  {
    id: 14,
    name: "Baby First Book Set",
    price: 1799,
    rating: 4.8,
    reviews: 65,
    image: "/images/products/toys-learning.jpeg",
    colors: ["multi"],
    category: "toys",
    stock: 37,
    ageRange: "12-24m",
  },

  // Feeding (5 items)
  {
    id: 15,
    name: "Anti-Colic Baby Bottle Set",
    price: 2799,
    originalPrice: 3299,
    rating: 4.7,
    reviews: 98,
    image: "/images/products/baby-clothing.png",
    colors: ["pink", "blue"],
    isNew: true,
    category: "feeding",
    stock: 22,
    ageRange: "0-12m",
  },
  {
    id: 16,
    name: "Insulated Baby Food Jar",
    price: 899,
    rating: 4.4,
    reviews: 45,
    image: "/images/products/bath-skincare.png",
    colors: ["green"],
    category: "feeding",
    stock: 50,
    ageRange: "6-24m",
  },
  {
    id: 17,
    name: "Baby Feeding Spoon Set",
    price: 599,
    rating: 4.3,
    reviews: 78,
    image: "/images/products/diapering.jpeg",
    colors: ["pink", "blue"],
    category: "feeding",
    stock: 60,
    ageRange: "4-24m",
  },
  {
    id: 18,
    name: "Silicone Baby Bibs (Pack of 3)",
    price: 1299,
    rating: 4.6,
    reviews: 134,
    image: "/images/products/feeding-nursing.jpeg",
    colors: ["blue", "pink", "gray"],
    category: "feeding",
    stock: 42,
    ageRange: "4-24m",
  },
  {
    id: 19,
    name: "Electric Baby Food Maker",
    price: 4599,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 56,
    image: "/images/products/moms-care.jpeg",
    colors: ["white"],
    category: "feeding",
    stock: 15,
    ageRange: "4-12m",
  },

  // Nursery (5 items)
  {
    id: 20,
    name: "Musical Mobile for Crib",
    price: 3599,
    rating: 4.8,
    reviews: 132,
    image: "/images/products/baby-clothing.png",
    colors: ["white"],
    isBestSeller: true,
    category: "nursery",
    stock: 12,
    ageRange: "0-12m",
  },
  {
    id: 21,
    name: "Organic Cotton Swaddle Blanket",
    price: 1499,
    rating: 4.9,
    reviews: 287,
    image: "/images/products/bath-skincare.png",
    colors: ["gray", "mint"],
    category: "nursery",
    stock: 37,
    ageRange: "0-6m",
  },
  {
    id: 22,
    name: "Baby Night Light Projector",
    price: 2299,
    rating: 4.7,
    reviews: 89,
    image: "/images/products/diapering.jpeg",
    colors: ["white", "blue"],
    category: "nursery",
    stock: 24,
    ageRange: "0-24m",
  },
  {
    id: 23,
    name: "Waterproof Crib Mattress",
    price: 4999,
    originalPrice: 5499,
    rating: 4.8,
    reviews: 76,
    image: "/images/products/feeding-nursing.jpeg",
    colors: ["white"],
    category: "nursery",
    stock: 9,
    ageRange: "0-24m",
  },
  {
    id: 24,
    name: "Baby Nursery Decor Set",
    price: 3299,
    rating: 4.6,
    reviews: 43,
    image: "/images/products/moms-care.jpeg",
    colors: ["neutral"],
    category: "nursery",
    stock: 18,
    ageRange: "0-24m",
  },

  // Bath & Skincare (3 items)
  {
    id: 25,
    name: "Baby Bath Tub with Support",
    price: 2299,
    originalPrice: 2699,
    rating: 4.5,
    reviews: 76,
    image: "/images/products/stroller-carriers.jpeg",
    colors: ["white"],
    isNew: true,
    category: "bath",
    stock: 18,
    ageRange: "0-12m",
  },
  {
    id: 26,
    name: "Organic Baby Shampoo Set",
    price: 1299,
    rating: 4.7,
    reviews: 143,
    image: "/images/products/toys-learning.jpeg",
    colors: ["clear"],
    category: "bath",
    stock: 42,
    ageRange: "0-24m",
  },
  {
    id: 27,
    name: "Hooded Baby Towel",
    price: 999,
    rating: 4.6,
    reviews: 98,
    image: "/images/products/baby-clothing.png",
    colors: ["blue", "pink"],
    category: "bath",
    stock: 31,
    ageRange: "0-24m",
  },

  // Gear & Accessories (3 items)
  {
    id: 28,
    name: "Lightweight Baby Stroller",
    price: 8999,
    originalPrice: 9999,
    rating: 4.8,
    reviews: 89,
    image: "/images/products/bath-skincare.png",
    colors: ["black", "navy"],
    isBestSeller: true,
    category: "gear",
    stock: 7,
    ageRange: "0-36m",
  },
  {
    id: 29,
    name: "Ergonomic Baby Carrier",
    price: 4599,
    rating: 4.9,
    reviews: 201,
    image: "/images/products/diapering.jpeg",
    colors: ["gray", "khaki"],
    category: "gear",
    stock: 14,
    ageRange: "0-24m",
  },
  {
    id: 30,
    name: "Car Seat & Stroller Combo",
    price: 12999,
    originalPrice: 14999,
    rating: 4.7,
    reviews: 67,
    image: "/images/products/moms-care.jpeg",
    colors: ["black"],
    category: "gear",
    stock: 5,
    ageRange: "0-36m",
  },
];

const categories = [
  { id: "all", name: "All Products", count: allProducts.length },
  {
    id: "clothing",
    name: "Baby Clothing",
    count: allProducts.filter((p) => p.category === "clothing").length,
  },
  {
    id: "toys",
    name: "Toys & Learning",
    count: allProducts.filter((p) => p.category === "toys").length,
  },
  {
    id: "feeding",
    name: "Feeding Essentials",
    count: allProducts.filter((p) => p.category === "feeding").length,
  },
  {
    id: "nursery",
    name: "Nursery Decor",
    count: allProducts.filter((p) => p.category === "nursery").length,
  },
  {
    id: "bath",
    name: "Bath & Skincare",
    count: allProducts.filter((p) => p.category === "bath").length,
  },
  {
    id: "gear",
    name: "Baby Gear",
    count: allProducts.filter((p) => p.category === "gear").length,
  },
];

const ageRanges = [
  { id: "0-3m", name: "0-3 Months" },
  { id: "3-6m", name: "3-6 Months" },
  { id: "6-12m", name: "6-12 Months" },
  { id: "12-24m", name: "12-24 Months" },
  { id: "24-36m", name: "24-36 Months" },
];

const filters = {
  price: [
    { id: "0-1000", name: "Under ৳1000" },
    { id: "1000-2000", name: "৳1000 - ৳2000" },
    { id: "2000-5000", name: "৳2000 - ৳5000" },
    { id: "5000+", name: "Over ৳5000" },
  ],
  rating: [
    { id: "4", name: "4+ Stars" },
    { id: "3", name: "3+ Stars" },
  ],
  availability: [
    { id: "in-stock", name: "In Stock" },
    { id: "out-of-stock", name: "Out of Stock" },
  ],
  deals: [
    { id: "new", name: "New Arrivals" },
    { id: "best-seller", name: "Best Sellers" },
    { id: "discounted", name: "Discounted Items" },
  ],
  age: ageRanges,
};

const ProductCard = ({
  product,
  viewMode,
}: {
  product: Product;
  viewMode: "grid" | "list";
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT" })
      .format(price)
      .replace("BDT", "৳");

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 1500);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="flex flex-col sm:flex-row gap-4 p-4 border border-brand-neutral-200 rounded-lg hover:shadow-md transition-all"
      >
        <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-brand-primary-600 text-white text-xs px-2 py-1 rounded">
              NEW
            </span>
          )}

          {/* Quick View Button for List View */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Link
              href={`/products/${product.id}`}
              className="flex items-center gap-1 bg-white text-brand-primary-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-brand-primary-50 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-4 w-4" />
              Quick View
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href={`/products/${product.id}`}
                className="font-medium text-lg hover:text-brand-primary-600"
              >
                {product.name}
              </Link>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">
                  ({product.reviews})
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-1 text-gray-400 hover:text-pink-500"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-pink-500 text-pink-500" : ""
                }`}
              />
            </button>
          </div>

          <div className="mt-2">
            <span className="text-xl font-bold text-brand-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-600 text-sm">
            Available in {product.colors.length} colors • {product.stock} in
            stock • Age: {product.ageRange}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="mt-4 w-full sm:w-auto px-4 py-2 bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-md flex items-center justify-center gap-2"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  // Default grid view
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white border border-brand-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all flex flex-col h-full"
    >
      <div className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-0 left-0 p-2 space-y-1">
          {product.isNew && (
            <span className="bg-brand-primary-600 text-white text-xs px-2 py-1 rounded block">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded block">
              BESTSELLER
            </span>
          )}
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-pink-500 text-pink-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Quick View Button for Grid View */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-1 bg-white text-brand-primary-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-brand-primary-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
            Quick View
          </Link>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <Link
            href={`/products/${product.id}`}
            className="font-medium hover:text-brand-primary-600 line-clamp-2"
          >
            {product.name}
          </Link>
          <p className="text-xs text-gray-500 mt-1">Age: {product.ageRange}</p>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-brand-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-1 text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="mt-3 w-full py-2 bg-brand-primary-50 hover:bg-brand-primary-100 text-brand-primary-600 rounded-md flex items-center justify-center gap-2 text-sm"
        >
          {isAddingToCart ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    price: [],
    rating: [],
    availability: [],
    deals: [],
    age: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const productsPerPage = viewMode === "grid" ? 12 : 6;

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedFilters, currentPage]);

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    // Price filter
    if (selectedFilters.price.length > 0) {
      const priceInRange = selectedFilters.price.some((range) => {
        const [min, max] = range.split("-").map(Number);
        if (range.endsWith("+")) return product.price >= min;
        return product.price >= min && product.price <= max;
      });
      if (!priceInRange) return false;
    }

    // Rating filter
    if (selectedFilters.rating.length > 0) {
      const minRating = Math.min(...selectedFilters.rating.map(Number));
      if (product.rating < minRating) return false;
    }

    // Availability filter
    if (
      selectedFilters.availability.includes("in-stock") &&
      product.stock <= 0
    ) {
      return false;
    }
    if (
      selectedFilters.availability.includes("out-of-stock") &&
      product.stock > 0
    ) {
      return false;
    }

    // Deal filters
    if (selectedFilters.deals.includes("new") && !product.isNew) {
      return false;
    }
    if (
      selectedFilters.deals.includes("best-seller") &&
      !product.isBestSeller
    ) {
      return false;
    }
    if (
      selectedFilters.deals.includes("discounted") &&
      !product.originalPrice
    ) {
      return false;
    }

    // Age filter
    if (selectedFilters.age.length > 0 && product.ageRange) {
      if (!selectedFilters.age.includes(product.ageRange)) {
        return false;
      }
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const toggleFilter = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(
          (v) => v !== value
        );
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      return newFilters;
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <>
      <Header />

      <div className="bg-brand-neutral-50 min-h-screen">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Baby Products Shop</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Discover everything your little one needs in one place
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Shop Options */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar - Categories & Filters */}
            <div className="w-full md:w-64 flex-shrink-0">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h2 className="font-bold text-lg mb-4">Shop by Category</h2>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                          selectedCategory === category.id
                            ? "bg-brand-primary-50 text-brand-primary-600 font-medium"
                            : "hover:bg-brand-neutral-100"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-sm text-brand-neutral-500">
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Age Range */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h2 className="font-bold text-lg mb-4">Shop by Age</h2>
                <ul className="space-y-2">
                  {ageRanges.map((age) => (
                    <li key={age.id}>
                      <button
                        onClick={() => toggleFilter("age", age.id)}
                        className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                          selectedFilters.age.includes(age.id)
                            ? "bg-brand-primary-50 text-brand-primary-600 font-medium"
                            : "hover:bg-brand-neutral-100"
                        }`}
                      >
                        <span>{age.name}</span>
                        <span className="text-sm text-brand-neutral-500">
                          {
                            allProducts.filter(
                              (p) => p.ageRange && p.ageRange === age.id
                            ).length
                          }
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filters - Desktop */}
              <div className="hidden md:block bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">Filters</h2>
                  <button
                    onClick={() =>
                      setSelectedFilters({
                        price: [],
                        rating: [],
                        availability: [],
                        deals: [],
                        age: [],
                      })
                    }
                    className="text-sm text-brand-primary-600 hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                {Object.entries(filters).map(([filterType, options]) => (
                  <div key={filterType} className="mb-6">
                    <h3 className="font-medium capitalize mb-2">
                      {filterType.replace("-", " ")}
                    </h3>
                    <ul className="space-y-2">
                      {options.map((option) => (
                        <li key={option.id}>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters[filterType].includes(
                                option.id
                              )}
                              onChange={() =>
                                toggleFilter(filterType, option.id)
                              }
                              className="rounded text-brand-primary-600 focus:ring-brand-primary-500"
                            />
                            <span>{option.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Products Area */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-brand-neutral-600">
                  Showing {paginatedProducts.length} of{" "}
                  {filteredProducts.length} products
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="md:hidden flex items-center gap-1 px-3 py-2 border border-brand-neutral-200 rounded-lg"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>

                  <div className="flex items-center border border-brand-neutral-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-brand-primary-50 text-brand-primary-600"
                          : "bg-white"
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-brand-primary-50 text-brand-primary-600"
                          : "bg-white"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-primary-600" />
                </div>
              ) : paginatedProducts.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <h3 className="text-lg font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-brand-neutral-600 mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedFilters({
                        price: [],
                        rating: [],
                        availability: [],
                        deals: [],
                        age: [],
                      });
                    }}
                    className="px-4 py-2 bg-brand-primary-600 text-white rounded-md hover:bg-brand-primary-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full border border-brand-neutral-200 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, i) => {
                        // Show first, last, and surrounding pages
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-full ${
                              currentPage === pageNum
                                ? "bg-brand-primary-600 text-white"
                                : "hover:bg-brand-primary-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-10 rounded-full hover:bg-brand-primary-50"
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full border border-brand-neutral-200 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsFilterOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 right-0 w-full max-w-sm h-full bg-white z-50 shadow-xl overflow-y-auto"
            >
              <div className="p-4 border-b border-brand-neutral-200 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 rounded-full hover:bg-brand-neutral-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() =>
                      setSelectedFilters({
                        price: [],
                        rating: [],
                        availability: [],
                        deals: [],
                        age: [],
                      })
                    }
                    className="text-sm text-brand-primary-600 hover:underline"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-sm text-brand-primary-600 hover:underline"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <h3 className="font-medium capitalize mb-2">Age Range</h3>
                  <ul className="space-y-2">
                    {ageRanges.map((option) => (
                      <li key={option.id}>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.age.includes(option.id)}
                            onChange={() => toggleFilter("age", option.id)}
                            className="rounded text-brand-primary-600 focus:ring-brand-primary-500"
                          />
                          <span>{option.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {Object.entries(filters).map(([filterType, options]) => (
                  <div key={filterType}>
                    <button className="flex justify-between items-center w-full py-2">
                      <h3 className="font-medium capitalize">
                        {filterType.replace("-", " ")}
                      </h3>
                      <ChevronDown className="h-5 w-5" />
                    </button>
                    <ul className="space-y-2 mt-2">
                      {options.map((option) => (
                        <li key={option.id}>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters[filterType].includes(
                                option.id
                              )}
                              onChange={() =>
                                toggleFilter(filterType, option.id)
                              }
                              className="rounded text-brand-primary-600 focus:ring-brand-primary-500"
                            />
                            <span>{option.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-brand-primary-600 text-white p-3 rounded-full shadow-lg z-30 hover:bg-brand-primary-700 transition-colors"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <Footer />
    </>
  );
}
