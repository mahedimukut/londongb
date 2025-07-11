"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Gift, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 14,
    seconds: 56,
  });

  // Countdown timer
  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible]);

  // Show banner after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      const isDismissed = localStorage.getItem("promoBannerDismissed");
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    localStorage.setItem("promoBannerDismissed", "true");
    setTimeout(() => setIsVisible(false), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{
              scale: isClosing ? 0.9 : 1,
              y: isClosing ? 20 : 0,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl mx-4 border border-white/20"
          >
            {/* Floating sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute text-yellow-300"
                style={{
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              >
                <Sparkles size={18} />
              </motion.div>
            ))}

            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
              aria-label="Close promotional banner"
            >
              <X className="h-5 w-5 text-gray-700" />
            </motion.button>

            {/* Banner Content */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto overflow-hidden">
                <Image
                  src="/images/promos/summer-sale.jpg"
                  alt="Summer Sale - Up to 40% Off"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg z-10">
                  HOT DEAL
                </div>
              </div>

              {/* Text Section */}
              <div className="p-6 md:p-8 flex flex-col justify-center relative">
                {/* Ribbon decoration */}
                <div className="absolute -top-6 right-6 bg-pink-500 text-white px-3 py-1 text-xs font-bold rotate-12 shadow-md">
                  LIMITED TIME
                </div>

                <span className="text-sm font-semibold text-pink-500 mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  EXCLUSIVE OFFER
                </span>

                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  Summer Baby{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                    Care Sale!
                  </span>
                </h3>

                <p className="text-gray-600 mb-6 text-lg">
                  Get up to{" "}
                  <span className="font-bold text-pink-500">40% off</span> on
                  premium baby products. Stock up on essentials for the season!
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                    40% OFF
                  </span>
                  <span className="text-gray-400 ml-2 line-through text-xl">
                    Selected Items
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden"
                  >
                    <Link
                      href="/summer-sale"
                      className="relative px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span className="shine-overlay"></span>
                      <span className="relative z-10">Shop Now</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>

                  <motion.button
                    onClick={handleClose}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-500 font-medium rounded-xl transition-all duration-300"
                  >
                    Maybe Later
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-3 border-t border-pink-100">
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className="text-pink-600 font-medium">
                  Offer ends in:
                </span>
                <div className="flex gap-2 font-medium">
                  <div className="bg-white px-3 py-1 rounded-lg shadow-sm border border-pink-100 text-center">
                    <div className="text-2xl font-bold text-pink-600 font-mono">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-pink-400">HOURS</div>
                  </div>
                  <div className="text-pink-600 flex items-center text-xl">
                    :
                  </div>
                  <div className="bg-white px-3 py-1 rounded-lg shadow-sm border border-pink-100 text-center">
                    <div className="text-2xl font-bold text-pink-600 font-mono">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-pink-400">MINUTES</div>
                  </div>
                  <div className="text-pink-600 flex items-center text-xl">
                    :
                  </div>
                  <div className="bg-white px-3 py-1 rounded-lg shadow-sm border border-pink-100 text-center">
                    <div className="text-2xl font-bold text-pink-600 font-mono">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-pink-400">SECONDS</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add to your global CSS
const styles = `
  .shine-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.3) 50%,
      rgba(255,255,255,0) 100%
    );
    transform: skewX(-20deg) translateX(-150%);
    transition: transform 0.8s;
  }
  .group:hover .shine-overlay {
    transform: skewX(-20deg) translateX(250%);
  }
`;

<style jsx global>
  {styles}
</style>;
