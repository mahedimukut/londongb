"use client";

import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, useRef, useCallback } from "react";

const categories = [
  {
    id: "cat-1",
    name: "Newborn Essentials",
    image: "/images/categories/newborn-essential.jpeg",
    href: "/categories/newborn-essentials",
    bgColor: "bg-brand-primary-50",
    textColor: "text-brand-primary-600",
  },
  {
    id: "cat-2",
    name: "Feeding & Nursing",
    image: "/images/categories/feeding-nursing.jpeg",
    href: "/categories/feeding-nursing",
    bgColor: "bg-brand-secondary-50",
    textColor: "text-brand-secondary-600",
  },
  {
    id: "cat-3",
    name: "Diapering",
    image: "/images/categories/diapering.jpeg",
    href: "/categories/diapering",
    bgColor: "bg-brand-sky-50",
    textColor: "text-brand-sky-600",
  },
  {
    id: "cat-4",
    name: "Toys & Learning",
    image: "/images/categories/toys-learning.jpeg",
    href: "/categories/toys-learning",
    bgColor: "bg-brand-gold-100",
    textColor: "text-brand-gold-600",
  },
  {
    id: "cat-5",
    name: "Bath & Skincare",
    image: "/images/categories/bath-skincare.png",
    href: "/categories/bath-skincare",
    bgColor: "bg-brand-primary-100",
    textColor: "text-brand-primary-700",
  },
  {
    id: "cat-6",
    name: "Nursery Decor",
    image: "/images/categories/nursery-decor.png",
    href: "/categories/nursery-decor",
    bgColor: "bg-brand-secondary-100",
    textColor: "text-brand-secondary-700",
  },
  {
    id: "cat-7",
    name: "Mom's Care",
    image: "/images/categories/moms-care.jpeg",
    href: "/categories/moms-care",
    bgColor: "bg-brand-sky-100",
    textColor: "text-brand-sky-700",
  },
  {
    id: "cat-8",
    name: "Baby Clothing",
    image: "/images/categories/baby-clothing.png",
    href: "/categories/baby-clothing",
    bgColor: "bg-brand-gold-100",
    textColor: "text-brand-gold-700",
  },
  {
    id: "cat-9",
    name: "Travel Gear",
    image: "/images/categories/newborn-essential.jpeg",
    href: "/categories/travel-gear",
    bgColor: "bg-brand-primary-50",
    textColor: "text-brand-primary-600",
  },
  {
    id: "cat-10",
    name: "Safety Products",
    image: "/images/categories/feeding-nursing.jpeg",
    href: "/categories/safety-products",
    bgColor: "bg-brand-secondary-50",
    textColor: "text-brand-secondary-600",
  },
  {
    id: "cat-11",
    name: "Organic Cotton",
    image: "/images/categories/diapering.jpeg",
    href: "/categories/organic-cotton",
    bgColor: "bg-brand-sky-50",
    textColor: "text-brand-sky-600",
  },
  {
    id: "cat-12",
    name: "Gift Sets",
    image: "/images/categories/toys-learning.jpeg",
    href: "/categories/gift-sets",
    bgColor: "bg-brand-gold-100",
    textColor: "text-brand-gold-600",
  },
  {
    id: "cat-13",
    name: "Strollers & Carriers",
    image: "/images/categories/bath-skincare.png",
    href: "/categories/strollers-carriers",
    bgColor: "bg-brand-primary-100",
    textColor: "text-brand-primary-700",
  },
  {
    id: "cat-14",
    name: "Feeding Accessories",
    image: "/images/categories/nursery-decor.png",
    href: "/categories/feeding-accessories",
    bgColor: "bg-brand-secondary-100",
    textColor: "text-brand-secondary-700",
  },
  {
    id: "cat-15",
    name: "Sleep Solutions",
    image: "/images/categories/moms-care.jpeg",
    href: "/categories/sleep-solutions",
    bgColor: "bg-brand-sky-100",
    textColor: "text-brand-sky-700",
  },
  {
    id: "cat-16",
    name: "Eco-Friendly Products",
    image: "/images/categories/baby-clothing.png",
    href: "/categories/eco-friendly",
    bgColor: "bg-brand-gold-100",
    textColor: "text-brand-gold-700",
  },
];

const CategoryCard = ({ category }: { category: (typeof categories)[0] }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="min-w-[280px] px-2 flex-shrink-0"
    >
      <Link
        href={category.href}
        className="group block rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300"
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className="relative h-48"
        >
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <motion.div
            className="absolute inset-0 bg-black/10"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.div
          className={`${category.bgColor} p-5`}
          whileHover={{
            backgroundColor: `${category.bgColor
              .replace("50", "100")
              .replace("100", "200")}`,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h3 className={`${category.textColor} font-semibold text-lg`}>
              {category.name}
            </h3>
            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <ChevronRight className={`${category.textColor} h-5 w-5`} />
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

  // Check if scroll controls are needed
  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollWidth, clientWidth } = carouselRef.current;
        setShowControls(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // Scroll function with boundary checks
  const scroll = useCallback((direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const scrollAmount = direction === "left" ? -300 : 300;
    const newScrollLeft = container.scrollLeft + scrollAmount;

    // Boundary checks
    if (newScrollLeft < 0) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else if (newScrollLeft > container.scrollWidth - container.clientWidth) {
      container.scrollTo({
        left: container.scrollWidth - container.clientWidth,
        behavior: "smooth",
      });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
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

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={sectionInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="pt-16 pb-0 px-4 sm:px-6 lg:px-8 bg-white relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-brand-neutral-800 mb-3">
            Featured Categories
          </h2>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto">
            Discover our carefully curated collections for your little one
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence>
            {showControls && (
              <>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scroll("left")}
                    className="bg-white rounded-full p-2 shadow-lg"
                    aria-label="Scroll left"
                    style={{ transformOrigin: "center center" }}
                  >
                    <ChevronLeft className="h-6 w-6 text-brand-primary-600" />
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
                    className="bg-white rounded-full p-2 shadow-lg"
                    aria-label="Scroll right"
                    style={{ transformOrigin: "center center" }}
                  >
                    <ChevronRight className="h-6 w-6 text-brand-primary-600" />
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
            className="overflow-x-auto pb-6 -mx-2 px-2 touch-pan-x hide-scrollbar"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={sectionInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4 w-max"
            >
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile indicators */}
        <div className="md:hidden flex justify-center gap-2 mt-4">
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
              className="w-3 h-3 rounded-full bg-brand-neutral-200 hover:bg-brand-primary-600 transition-colors"
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
