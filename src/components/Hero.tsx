"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  "Newborn Essentials",
  "Feeding & Nursing",
  "Diapering",
  "Toys & Learning",
  "Bath & Skincare",
  "Mom's Care",
  "Clothing & Accessories",
  "Strollers & Carriers",
  "Health & Safety",
];

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-brand-primary-50 via-white to-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-brand-primary-100/50 blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-brand-primary-200/30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-6 h-[600px]">
        {/* Sidebar - Categories with Custom Scrollbar */}
        <aside className="hidden lg:block w-64 shrink-0 h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-5 h-full flex flex-col border border-brand-primary-100/30"
          >
            <h3 className="text-lg font-semibold text-brand-primary-600 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-primary-400" />
              Shop by Category
            </h3>
            <ul className="space-y-3 flex-1 overflow-y-auto scrollbar-pink">
              {categories.map((cat, i) => (
                <motion.li
                  key={cat}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    href={`/categories/${cat
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="group text-brand-neutral-700 hover:text-brand-primary-500 flex items-center justify-between text-sm font-medium transition-all py-2 px-3 rounded-lg hover:bg-brand-primary-50"
                  >
                    <span className="transition-all group-hover:translate-x-1">
                      {cat}
                    </span>
                    <ChevronRight className="h-4 w-4 transition-all group-hover:translate-x-1 text-brand-primary-300" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link
              className="group mt-4 text-brand-primary-600 hover:text-brand-primary-700 flex items-center justify-between text-sm font-semibold transition-all py-2 px-3 rounded-lg bg-brand-primary-50 hover:bg-brand-primary-100"
              href="/categories"
            >
              <span className="transition-all group-hover:translate-x-1">
                Explore All Products
              </span>
              <ArrowRight className="h-4 w-4 transition-all group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </aside>

        {/* Hero Section - Enhanced */}
        <motion.div
          className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl h-full group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/hero/hero-image-2.jpg"
              alt="Happy mother holding her baby"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
              sizes="(max-width: 768px) 100vw, 70vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:via-black/20 lg:to-transparent" />

            {/* Floating sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute text-yellow-300"
                style={{
                  top: `${10 + Math.random() * 70}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              >
                <Sparkles size={18} className="opacity-80" />
              </motion.div>
            ))}

            <div className="absolute inset-0 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-12 py-10 z-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4"
              >
                <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                <span className="text-sm font-medium text-white">
                  Trusted by 10,000+ moms
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-2xl"
              >
                <span className="bg-gradient-to-r from-brand-primary-100 to-white bg-clip-text text-transparent">
                  Everything Baby & Mom
                </span>
                <br className="hidden sm:block" />
                <span className="text-white">Needs in One Place</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-white/90 text-lg sm:text-xl mb-8 max-w-xl drop-shadow-md"
              >
                Premium quality essentials, carefully curated for every stage of
                your baby's growth journey.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/shop"
                    className="relative px-8 py-4 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white font-bold rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center justify-center gap-3"
                  >
                    <span className="shine-overlay"></span>
                    <span className="relative z-10">Shop Now</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/new-arrivals"
                    className="relative px-8 py-4 bg-white/10 border-2 border-white/20 text-white font-medium rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden flex items-center justify-center gap-3"
                  >
                    <span className="relative z-10">New Arrivals</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-pink::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-pink::-webkit-scrollbar-track {
          background: #fce7f3;
          border-radius: 3px;
        }
        .scrollbar-pink::-webkit-scrollbar-thumb {
          background: #f9a8d4;
          border-radius: 3px;
        }
        .scrollbar-pink::-webkit-scrollbar-thumb:hover {
          background: #f472b6;
        }
        .shine-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-100%);
          opacity: 0;
          transition: opacity 0.5s;
        }
        .group:hover .shine-overlay {
          animation: shine 3s infinite;
          opacity: 1;
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          20% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
