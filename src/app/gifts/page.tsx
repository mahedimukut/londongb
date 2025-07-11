"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  Gift,
  Heart,
  ChevronRight,
  Sparkles,
  Ribbon,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const gifts = [
  {
    id: 1,
    name: "Luxury Baby Shower Gift Box",
    image: "/images/gifts/gift-1.jpg",
    price: 5499,
    originalPrice: 6999,
    rating: 5,
    reviews: 128,
    tags: ["Bestseller", "Premium"],
    description: "Curated luxury items for the perfect baby shower present",
    delivery: "Free next-day delivery",
    discount: 21,
  },
  {
    id: 2,
    name: "Newborn Essentials Basket",
    image: "/images/gifts/gift-2.jpg",
    price: 4599,
    originalPrice: 5999,
    rating: 4.5,
    reviews: 86,
    tags: ["Practical"],
    description: "Everything a new parent needs in one beautiful package",
    delivery: "Free standard delivery",
    discount: 23,
  },
  {
    id: 3,
    name: "First Birthday Deluxe Set",
    image: "/images/gifts/gift-3.jpg",
    price: 6799,
    originalPrice: 7999,
    rating: 4.9,
    reviews: 64,
    tags: ["New"],
    description: "Celebrate the first milestone with our premium collection",
    delivery: "Free next-day delivery",
    discount: 15,
  },
  {
    id: 4,
    name: "Organic Cotton Gift Pouch",
    image: "/images/gifts/gift-4.jpg",
    price: 2499,
    originalPrice: 3499,
    rating: 4.6,
    reviews: 42,
    tags: ["Eco-friendly"],
    description: "Sustainable and soft organic cotton essentials",
    delivery: "Free standard delivery",
    discount: 29,
  },
  {
    id: 5,
    name: "Personalized Baby Blanket Set",
    image: "/images/gifts/gift-1.jpg",
    price: 3899,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 93,
    tags: ["Customizable"],
    description:
      "Custom embroidered blanket with baby's name and birth details",
    delivery: "Free 3-day delivery",
    discount: 22,
  },
  {
    id: 6,
    name: "Wooden Toy Collection",
    image: "/images/gifts/gift-2.jpg",
    price: 5299,
    originalPrice: 6499,
    rating: 4.7,
    reviews: 57,
    tags: ["Montessori"],
    description: "Handcrafted wooden toys for developmental play",
    delivery: "Free standard delivery",
    discount: 18,
  },
  {
    id: 7,
    name: "Milestone Memory Box",
    image: "/images/gifts/gift-4.jpg",
    price: 3299,
    originalPrice: 4299,
    rating: 4.9,
    reviews: 78,
    tags: ["Keepsake"],
    description: "Preserve precious memories from birth to first years",
    delivery: "Free next-day delivery",
    discount: 23,
  },
  {
    id: 8,
    name: "Bath Time Bliss Set",
    image: "/images/gifts/gift-3.jpg",
    price: 2899,
    originalPrice: 3999,
    rating: 4.5,
    reviews: 36,
    tags: ["Spa"],
    description: "Organic bath products for a soothing baby spa experience",
    delivery: "Free standard delivery",
    discount: 28,
  },
];

export default function GiftsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const itemsPerPage = 8;
  const paginated = gifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white text-brand-neutral-900">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-purple-100 to-pink-50 py-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-purple-200/30 blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-pink-200/20 blur-3xl animate-float-delay"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-blue-100/20 blur-2xl animate-float-delay-2"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg"
            >
              <Gift className="h-5 w-5 mr-2" />
              <span className="relative">
                Thoughtful Presents
                <Sparkles className="absolute -top-3 -right-4 h-4 w-4 text-yellow-300" />
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-purple-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Perfect Gifts
              </span>{" "}
              for Little Ones
            </h1>
            <p className="mt-2 text-xl text-purple-700 max-w-2xl mx-auto">
              Handpicked bundles to celebrate life's precious beginnings and
              special milestones.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-block"
            >
              <Link
                href="#gift-collection"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all transform hover:shadow-xl"
              >
                Explore Collection
                <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div id="gift-collection" className="max-w-7xl mx-auto px-4 py-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center relative mb-4">
              <Ribbon className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold text-purple-900">
                Our Gift Collection
              </h2>
              <Sparkles className="h-5 w-5 text-yellow-400 ml-2" />
            </div>
            <p className="text-lg text-purple-600 max-w-2xl mx-auto">
              Each gift is carefully curated to bring joy and create lasting
              memories.
            </p>
          </div>

          {/* Enhanced Gift Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginated.map((gift) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredCard(gift.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Discount Badge */}
                {gift.originalPrice && (
                  <div className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {gift.discount}% OFF
                  </div>
                )}

                <div className="relative bg-white border border-purple-100 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={gift.image}
                      alt={gift.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Quick View Button */}
                    <motion.div
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ y: 20 }}
                      animate={{
                        y: hoveredCard === gift.id ? 0 : 20,
                        opacity: hoveredCard === gift.id ? 1 : 0,
                      }}
                    >
                      <Link
                        href={`/gifts/${gift.id}`}
                        className="whitespace-nowrap bg-white text-purple-700 font-medium py-2 px-4 rounded-full shadow-sm hover:bg-purple-50 transition-colors"
                      >
                        Quick View
                      </Link>
                    </motion.div>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(gift.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all ${
                      wishlist.includes(gift.id)
                        ? "bg-red-100 text-red-500"
                        : "bg-white text-gray-400 hover:text-red-500"
                    } z-10 group-hover:bg-white/90`}
                  >
                    <Heart
                      className={`h-5 w-5 transition-all ${
                        wishlist.includes(gift.id)
                          ? "fill-current scale-110"
                          : "group-hover:scale-110"
                      }`}
                    />
                  </button>

                  {/* Tags */}
                  {gift.tags.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                      {gift.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                            tag === "Bestseller"
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900"
                              : tag === "New"
                              ? "bg-gradient-to-r from-blue-400 to-blue-300 text-blue-900"
                              : tag === "Eco-friendly"
                              ? "bg-gradient-to-r from-green-400 to-green-300 text-green-900"
                              : "bg-gradient-to-r from-purple-400 to-purple-300 text-purple-900"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-xl text-purple-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {gift.name}
                    </h3>
                    <p className="text-sm text-purple-600 mb-4 line-clamp-2 flex-grow">
                      {gift.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(gift.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-purple-600">
                        ({gift.reviews} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-end gap-2">
                        <span className="font-bold text-2xl text-purple-900">
                          ৳{(gift.price / 100).toFixed(2)}
                        </span>
                        {gift.originalPrice && (
                          <span className="text-sm text-gray-500 line-through mb-0.5">
                            ৳{(gift.originalPrice / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center text-sm text-purple-600 mb-5">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {gift.delivery}
                      </span>
                    </div>

                    {/* View Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-auto"
                    >
                      <Link
                        href={`/gifts/${gift.id}`}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          {gifts.length > itemsPerPage && (
            <div className="flex justify-center mt-16 gap-2">
              <motion.button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-1 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
              >
                Previous
              </motion.button>

              {Array.from({
                length: Math.ceil(gifts.length / itemsPerPage),
              }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}

              <motion.button
                onClick={() =>
                  setCurrentPage((p) =>
                    p * itemsPerPage < gifts.length ? p + 1 : p
                  )
                }
                disabled={
                  currentPage === Math.ceil(gifts.length / itemsPerPage)
                }
                whileHover={{
                  scale:
                    currentPage === Math.ceil(gifts.length / itemsPerPage)
                      ? 1
                      : 1.05,
                }}
                whileTap={{
                  scale:
                    currentPage === Math.ceil(gifts.length / itemsPerPage)
                      ? 1
                      : 0.95,
                }}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-1 ${
                  currentPage === Math.ceil(gifts.length / itemsPerPage)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
              >
                Next
              </motion.button>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 10s ease-in-out 2s infinite;
        }
        .animate-float-delay-2 {
          animation: float 12s ease-in-out 4s infinite;
        }
      `}</style>
    </>
  );
}
