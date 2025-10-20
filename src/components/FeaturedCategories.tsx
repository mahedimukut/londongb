"use client";

import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useRef, useCallback } from "react";
import useSWR from "swr";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  _count?: {
    products: number;
  };
};

// Color variations for category cards
const colorSchemes = [
  { bgColor: "bg-brand-primary-50", textColor: "text-brand-primary-600" },
  { bgColor: "bg-brand-secondary-50", textColor: "text-brand-secondary-600" },
  { bgColor: "bg-brand-sky-50", textColor: "text-brand-sky-600" },
  { bgColor: "bg-brand-gold-100", textColor: "text-brand-gold-600" },
  { bgColor: "bg-brand-primary-100", textColor: "text-brand-primary-700" },
  { bgColor: "bg-brand-secondary-100", textColor: "text-brand-secondary-700" },
  { bgColor: "bg-brand-sky-100", textColor: "text-brand-sky-700" },
  { bgColor: "bg-brand-gold-100", textColor: "text-brand-gold-700" },
  { bgColor: "bg-purple-50", textColor: "text-purple-600" },
  { bgColor: "bg-pink-50", textColor: "text-pink-600" },
  { bgColor: "bg-blue-50", textColor: "text-blue-600" },
  { bgColor: "bg-green-50", textColor: "text-green-600" },
  { bgColor: "bg-orange-50", textColor: "text-orange-600" },
  { bgColor: "bg-teal-50", textColor: "text-teal-600" },
  { bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
  { bgColor: "bg-rose-50", textColor: "text-rose-600" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CategoryCard = ({
  category,
  colorScheme,
}: {
  category: Category;
  colorScheme: { bgColor: string; textColor: string };
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="min-w-[140px] md:min-w-[280px] px-1 md:px-2 flex-shrink-0"
    >
      <Link
        href={`/shop?category=${category.slug}`}
        className="group block rounded-lg md:rounded-xl overflow-hidden shadow-sm md:shadow-card hover:shadow-md md:hover:shadow-lg transition-all duration-300"
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className="relative h-24 md:h-48"
        >
          {category.image && !imageError ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 768px) 140px, (max-width: 1200px) 280px, 280px"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs md:text-sm">No Image</span>
            </div>
          )}

          {imageLoading && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <div className="w-4 h-4 md:w-8 md:h-8 border-2 border-gray-300 border-t-brand-primary-600 rounded-full animate-spin" />
            </div>
          )}

          <motion.div
            className="absolute inset-0 bg-black/10"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.div
          className={`${colorScheme.bgColor} p-2 md:p-5`}
          whileHover={{
            backgroundColor: `${colorScheme.bgColor
              .replace("50", "100")
              .replace("100", "200")}`,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3
                className={`${colorScheme.textColor} font-medium md:font-semibold text-xs md:text-lg truncate`}
              >
                {category.name}
              </h3>
              {category._count && (
                <p className="text-gray-500 text-xs md:text-sm mt-0.5 md:mt-1">
                  {category._count.products} products
                </p>
              )}
            </div>
            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <ChevronRight
                className={`${colorScheme.textColor} h-3 w-3 md:h-5 md:w-5 flex-shrink-0`}
              />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function FeaturedCategories() {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Use SWR for data fetching with real-time updates
  const {
    data: categories = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Category[]>("/api/dashboard/categories", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true, // Refresh when tab becomes focused
    revalidateOnReconnect: true, // Refresh when reconnecting to internet
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
  });

  // Check if scroll controls are needed
  const checkScroll = useCallback(() => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      setShowControls(scrollWidth > clientWidth);
    }
  }, []);

  // Re-check scroll when categories change
  useState(() => {
    if (categories.length > 0) {
      setTimeout(checkScroll, 100); // Small delay to ensure DOM is updated
    }
  });

  // Scroll function with boundary checks
  const scroll = useCallback((direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const scrollAmount = direction === "left" ? -200 : 200;

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (isLoading) {
    return (
      <section className="pt-12 md:pt-16 pb-0 px-3 sm:px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-brand-neutral-800 mb-2 md:mb-3">
              Featured Categories
            </h2>
            <p className="text-brand-neutral-600 text-sm md:text-base max-w-2xl mx-auto">
              Loading categories...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-gray-300 border-t-brand-primary-600 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-12 md:pt-16 pb-0 px-3 sm:px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-brand-neutral-800 mb-2 md:mb-3">
              Featured Categories
            </h2>
            <p className="text-red-600 text-sm md:text-base mb-3 md:mb-4">
              Failed to load categories
            </p>
            <button
              onClick={() => mutate()}
              className="mt-2 md:mt-4 px-4 py-2 md:px-6 md:py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors text-sm md:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={sectionInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="pt-12 md:pt-16 pb-0 px-3 sm:px-4 lg:px-8 bg-white relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-6 md:mb-12"
        >
          <h2 className="text-xl md:text-3xl font-bold text-brand-neutral-800 mb-2 md:mb-3">
            Shop by Category
          </h2>
          <p className="text-brand-neutral-600 text-sm md:text-base max-w-2xl mx-auto">
            Explore our wide range of products across different categories
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence>
            {showControls && categories.length > 0 && (
              <>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scroll("left")}
                    className="bg-white rounded-full p-1.5 md:p-2 shadow-lg border border-gray-200"
                    aria-label="Scroll left"
                    style={{ transformOrigin: "center center" }}
                  >
                    <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-brand-primary-600" />
                  </motion.button>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scroll("right")}
                    className="bg-white rounded-full p-1.5 md:p-2 shadow-lg border border-gray-200"
                    aria-label="Scroll right"
                    style={{ transformOrigin: "center center" }}
                  >
                    <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-brand-primary-600" />
                  </motion.button>
                </div>
              </>
            )}
          </AnimatePresence>

          <div
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="overflow-x-auto pb-4 -mx-1 md:-mx-2 px-1 md:px-2 touch-pan-x hide-scrollbar"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={sectionInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-2 md:gap-4 w-max"
            >
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  colorScheme={colorSchemes[index % colorSchemes.length]}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-500 text-sm md:text-lg mb-3 md:mb-4">
              No categories found.
            </p>
            <Link
              href="/admin/categories"
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors text-sm md:text-base"
            >
              Add Categories
            </Link>
          </div>
        )}

        {/* Mobile indicators */}
        {categories.length > 0 && (
          <div className="md:hidden flex justify-center gap-1.5 mt-3">
            {[0, 1, 2].map((dot) => (
              <button
                key={dot}
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.scrollTo({
                      left: carouselRef.current.clientWidth * dot,
                      behavior: "smooth",
                    });
                  }
                }}
                className="w-2 h-2 rounded-full bg-brand-neutral-200 hover:bg-brand-primary-600 transition-colors"
                aria-label={`Go to slide ${dot + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
}
