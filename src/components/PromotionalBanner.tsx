"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Zap, Tag } from "lucide-react";
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

  // Show banner with smart logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchAndShowBanner = async () => {
        try {
          const response = await fetch("/api/hot-deals");
          const products: Product[] = await response.json();

          if (products.length > 0) {
            const currentHotProduct = products.reduce((max, product) =>
              product.discountPercentage > max.discountPercentage
                ? product
                : max
            );

            // Get previous banner data
            const bannerData = JSON.parse(
              localStorage.getItem("promoBannerData") || "{}"
            );

            // Conditions for showing banner
            const neverSeenBefore = !bannerData.lastProductId;
            const newHotProduct =
              bannerData.lastProductId !== currentHotProduct.id;
            const sevenDaysPassed =
              bannerData.lastSeen &&
              Date.now() - bannerData.lastSeen > 7 * 24 * 60 * 60 * 1000;
            const betterDiscount =
              currentHotProduct.discountPercentage >
              (bannerData.lastDiscount || 0);

            // Show banner if any condition is met
            const shouldShow =
              neverSeenBefore ||
              newHotProduct ||
              sevenDaysPassed ||
              betterDiscount;

            if (shouldShow) {
              setHotProduct(currentHotProduct);
              setIsVisible(true);
            }
          }
        } catch (error) {
          console.error("Error checking hot deals:", error);
        }
      };

      fetchAndShowBanner();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);

    // Save current product info to localStorage
    if (hotProduct) {
      localStorage.setItem(
        "promoBannerData",
        JSON.stringify({
          lastProductId: hotProduct.id,
          lastSeen: Date.now(),
          lastDiscount: hotProduct.discountPercentage,
        })
      );
    }

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

  const calculateSavings = (original: number, current: number) => {
    return original - current;
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
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 mb-4 border border-red-100">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
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
                      {/* Discount Badge */}
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        -{hotProduct.discountPercentage}%
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                        {hotProduct.name}
                      </h4>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(hotProduct.price)}
                          </span>
                          {hotProduct.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(hotProduct.originalPrice)}
                            </span>
                          )}
                        </div>

                        {hotProduct.originalPrice && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              Save{" "}
                              {formatPrice(
                                calculateSavings(
                                  hotProduct.originalPrice,
                                  hotProduct.price
                                )
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons - Optimized for Conversion */}
              <div className="space-y-3">
                {hotProduct ? (
                  <>
                    {/* Primary CTA - Direct to Product */}
                    <Link
                      href={`/products/${hotProduct.slug}`}
                      onClick={handleClose}
                      className="block w-full text-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>Get This Deal</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <div className="text-xs font-normal opacity-90 mt-1">
                        Save {hotProduct.discountPercentage}% • Limited Time
                      </div>
                    </Link>

                    {/* Secondary CTA - All Hot Deals */}
                    <Link
                      href="/hot-deals"
                      onClick={handleClose}
                      className="block w-full text-center border-2 border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
                    >
                      View All Hot Deals
                    </Link>
                  </>
                ) : (
                  /* Fallback when no product */
                  <Link
                    href="/hot-deals"
                    onClick={handleClose}
                    className="block w-full text-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>View Hot Deals</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                )}

                {/* Tertiary Action */}
                <button
                  onClick={handleClose}
                  className="block w-full text-center text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="bg-gray-50 border-t border-gray-100 px-5 py-3">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Zap className="h-3 w-3" />
                <span>Limited stock • Prices may change</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
