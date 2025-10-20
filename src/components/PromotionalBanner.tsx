"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: { url: string }[];
  discountPercentage: number;
};

export default function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hotProduct, setHotProduct] = useState<Product | null>(null);

  // Fetch the most discounted product
  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        const response = await fetch("/api/hot-deals");
        const products: Product[] = await response.json();

        if (products.length > 0) {
          const mostDiscounted = products.reduce((max, product) =>
            product.discountPercentage > max.discountPercentage ? product : max
          );
          setHotProduct(mostDiscounted);
        }
      } catch (error) {
        console.error("Error fetching hot deals:", error);
      }
    };

    if (isVisible) {
      fetchHotDeals();
    }
  }, [isVisible]);

  // Show banner after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      const isDismissed = localStorage.getItem("promoBannerDismissed");
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    localStorage.setItem("promoBannerDismissed", "true");
    setTimeout(() => setIsVisible(false), 300);
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{
              scale: isClosing ? 0.9 : 1,
              y: isClosing ? 20 : 0,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md border border-gray-100"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all"
              aria-label="Close promotional banner"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>

            {/* Content */}
            <div className="p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-1.5 rounded-full">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Hot Deal Alert!
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {hotProduct ? (
                    <>Save {hotProduct.discountPercentage}% Today</>
                  ) : (
                    <>Limited Time Offer</>
                  )}
                </h3>

                <p className="text-sm text-gray-600">
                  {hotProduct ? (
                    <>Don't miss this amazing discount</>
                  ) : (
                    <>Exclusive savings waiting for you</>
                  )}
                </p>
              </div>

              {/* Product Card */}
              {hotProduct && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          hotProduct.images[0]?.url ||
                          "/placeholder-product.jpg"
                        }
                        alt={hotProduct.name}
                        fill
                        className="object-cover"
                        quality={80}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {hotProduct.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-base font-bold text-red-600">
                          {formatPrice(hotProduct.price)}
                        </span>
                        {hotProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(hotProduct.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col gap-2">
                <Link
                  href="/hot-deals"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span>View All Hot Deals</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  onClick={handleClose}
                  className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="bg-gray-50 border-t border-gray-100 px-5 py-2">
              <p className="text-xs text-gray-500 text-center">
                Limited stock available
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
