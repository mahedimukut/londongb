"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, Ribbon, Sparkles, Star, ArrowRight } from "lucide-react";

export default function GiftsAndBundles() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-pink-500/20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl h-96 lg:h-[550px] group"
          >
            <Image
              src="/images/gifts/gift-bundle-hero.jpg"
              alt="Luxury Baby Gift Bundle"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-purple-800/30 to-transparent" />
            <div className="absolute top-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2">
              <Ribbon className="h-5 w-5" />
              Editor's Choice
            </div>
          </motion.div>

          {/* Content section */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-center text-pink-200 uppercase tracking-wider text-sm font-semibold gap-3">
              <Gift className="h-6 w-6 text-pink-300" />
              Premium Gift Collections
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-pink-300 to-white bg-clip-text text-transparent">
                Exquisite Baby Gifts
              </span>
              <br />
              <span className="text-white">That Spark Joy</span>
            </h2>

            <p className="text-purple-100 text-xl leading-relaxed max-w-lg">
              Handcrafted luxury gift sets for unforgettable moments.
            </p>

            {/* Ratings */}
            <div className="flex items-center text-yellow-300 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-300" />
              ))}
              <span className="ml-2 text-white font-medium">
                4.9/5 • 240+ Reviews
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              {/* Primary Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Link
                  href="/gift-bundles"
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 overflow-hidden">
                    <span className="absolute top-0 left-0 w-full h-full">
                      <span className="shine-effect"></span>
                    </span>
                  </span>
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    Shop Luxury Gifts
                    <ArrowRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 pointer-events-none"
                >
                  <Sparkles className="text-yellow-300 h-6 w-6" />
                </motion.div>
              </motion.div>

              {/* Secondary Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Link
                  href="/custom-gifts"
                  className="flex items-center justify-center px-8 py-4 bg-white/5 border-2 border-white/20 text-white font-medium text-lg rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Ribbon className="h-5 w-5 text-pink-300" />
                    Customize Yours
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 pt-6 text-sm text-purple-100">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <div className="text-green-300">✓</div>
                <span>Free Gift Wrapping</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <div className="text-green-300">✓</div>
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shine 3s ease-in-out infinite;
          transform: skewX(-25deg);
        }

        @keyframes shine {
          0% {
            left: -100%;
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            left: 150%;
            opacity: 0;
          }
        }

        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.3),
            0 4px 6px -4px rgba(236, 72, 153, 0.3);
        }

        .hover\\:shadow-xl:hover {
          box-shadow: 0 20px 25px -5px rgba(236, 72, 153, 0.3),
            0 8px 10px -6px rgba(236, 72, 153, 0.3);
        }
      `}</style>
    </section>
  );
}
