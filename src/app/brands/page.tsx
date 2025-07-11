"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, ChevronRight, Sparkles, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const brands = [
  {
    id: 1,
    name: "Johnson's Baby",
    logo: "/images/brands/johnsons.jpg",
    rating: 4.8,
    description: "Gentle baby care products",
    href: "/brands/johnsons",
    featured: true,
  },
  {
    id: 2,
    name: "Pigeon",
    logo: "/images/brands/pigeon.png",
    rating: 4.6,
    description: "Innovative baby feeding solutions",
    href: "/brands/pigeon",
  },
  {
    id: 3,
    name: "Chicco",
    logo: "/images/brands/chicco.png",
    rating: 4.7,
    description: "Premium baby gear and accessories",
    href: "/brands/chicco",
    featured: true,
  },
  {
    id: 4,
    name: "Huggies",
    logo: "/images/brands/huggies.png",
    rating: 4.5,
    description: "Comfortable diapers for babies",
    href: "/brands/huggies",
  },
  {
    id: 5,
    name: "Avent",
    logo: "/images/brands/avent.svg",
    rating: 4.9,
    description: "Natural feeding solutions",
    href: "/brands/avent",
    featured: true,
  },
  {
    id: 6,
    name: "Mustela",
    logo: "/images/brands/mustela.jpg",
    rating: 4.7,
    description: "Organic skincare for babies",
    href: "/brands/mustela",
  },
  {
    id: 7,
    name: "Fisher-Price",
    logo: "/images/brands/chicco.png",
    rating: 4.6,
    description: "Educational toys and gear",
    href: "/brands/fisher-price",
  },
  {
    id: 8,
    name: "NUK",
    logo: "/images/brands/pigeon.png",
    rating: 4.5,
    description: "German quality baby products",
    href: "/brands/nuk",
  },
  {
    id: 9,
    name: "Babyganics",
    logo: "/images/brands/huggies.png",
    rating: 4.4,
    description: "Plant-based baby essentials",
    href: "/brands/babyganics",
  },
  {
    id: 10,
    name: "Skip Hop",
    logo: "/images/brands/johnsons.jpg",
    rating: 4.7,
    description: "Stylish baby accessories",
    href: "/brands/skip-hop",
  },
];

export default function BrandPage() {
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-200/30 blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-purple-200/20 blur-3xl animate-float-delay"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-pink-100/20 blur-2xl animate-float-delay-2"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg"
            >
              <Award className="h-5 w-5 mr-2" />
              <span className="relative">
                Trusted Brands
                <Sparkles className="absolute -top-3 -right-4 h-4 w-4 text-yellow-300" />
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
                Premium Brands
              </span>{" "}
              for Your Baby
            </h1>
            <p className="mt-2 text-xl text-blue-700 max-w-2xl mx-auto">
              Discover trusted brands that parents love for their quality and
              safety.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Brand Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredBrand(brand.id)}
                onHoverEnd={() => setHoveredBrand(null)}
                className="relative group"
              >
                <div className="relative bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden h-full flex flex-col p-5">
                  {/* Featured Badge */}
                  {brand.featured && (
                    <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      Featured
                    </div>
                  )}

                  {/* Brand Logo */}
                  <div className="relative h-32 w-full mb-5">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </motion.div>
                  </div>

                  {/* Brand Info */}
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-blue-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-blue-600 mb-4">
                      {brand.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(brand.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-blue-600 ml-1">
                        {brand.rating}
                      </span>
                    </div>

                    {/* View Button */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link
                        href={brand.href}
                        className="flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-full transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-8 text-center shadow-xl"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Can't Find Your Favorite Brand?
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto mb-6">
              Let us know which brands you'd like to see in our collection, and
              we'll work to add them!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-full shadow-md transition-all"
              >
                Request a Brand
                <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
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
