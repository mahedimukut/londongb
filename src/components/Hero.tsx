"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Pause,
  Sparkles,
  Zap,
  TrendingUp,
  Star,
  Users,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const heroImages = [
  {
    src: "/images/hero/Banner-2.jpg",
    title: "Elevate Your Daily",
    highlight: "Beauty Routine",
    cta: "Shop Beauty",
    badge: "NEW ARRIVALS",
    gradient: "from-purple-600/30 to-pink-600/30",
    stats: [
      { icon: Star, value: "4.9/5", label: "Beauty Rating" },
      { icon: Users, value: "10K+", label: "Happy Customers" },
    ],
    color: "from-purple-400 to-pink-400",
  },
  {
    src: "/images/hero/Banner-3.jpg",
    title: "Transform Your",
    highlight: "Wellness Journey",
    cta: "Explore Wellness",
    badge: "BESTSELLER",
    gradient: "from-blue-600/30 to-cyan-600/30",
    stats: [
      { icon: Award, value: "Premium", label: "Quality Products" },
      { icon: Zap, value: "Fast", label: "Wellness Results" },
    ],
    color: "from-blue-400 to-cyan-400",
  },
  {
    src: "/images/hero/hero-image.jpg",
    title: "Curate Your Perfect",
    highlight: "Lifestyle",
    cta: "Discover Style",
    badge: "LIMITED EDITION",
    gradient: "from-emerald-600/30 to-teal-600/30",
    stats: [
      { icon: TrendingUp, value: "50K+", label: "Lovers" },
      { icon: Sparkles, value: "Trending", label: "This Week" },
    ],
    color: "from-emerald-400 to-teal-400",
  },
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentContent = heroImages[currentImageIndex];

  return (
    <section className="relative bg-black h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
      {/* Floating Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.03)_25px,transparent_26px),linear-gradient(transparent_24px,rgba(255,255,255,0.03)_25px,transparent_26px)] bg-[size:50px_50px] animate-pulse" />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 25 - 12.5, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${20 + Math.random() * 70}%`,
          }}
        />
      ))}

      {/* Hero Content Wrapper */}
      <div className="relative w-full h-full">
        {/* Background Image Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentContent.src}
              alt="Hero banner"
              fill
              className="object-cover object-center"
              priority
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${currentContent.gradient} mix-blend-soft-light`}
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* Main Content */}
        <div className="relative flex flex-col justify-center h-full z-10 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28">
          <div className="flex flex-col xl:flex-row justify-between items-center xl:items-start gap-12">
            {/* Left Text Section */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8 }}
              className="text-center xl:text-left max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-lg border border-white/30 px-5 py-2.5 rounded-2xl shadow-lg mb-4">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-white font-bold text-sm tracking-wider">
                  {currentContent.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mb-6">
                {currentContent.title} <br />
                <span
                  className={`bg-gradient-to-r ${currentContent.color} bg-clip-text text-transparent`}
                >
                  {currentContent.highlight}
                </span>
              </h1>

              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-4 bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 text-lg">
                  {currentContent.cta}
                </span>
                <ArrowRight className="h-6 w-6 relative z-10 transition-transform group-hover:translate-x-1 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
            </motion.div>

            {/* Right Side Stats (visible on xl+) */}
            <div className="hidden xl:block">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-8"
              >
                {/* Stats Card */}
                <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    {currentContent.stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div
                          className={`p-3 bg-gradient-to-br ${currentContent.color}/20 rounded-2xl border border-white/20`}
                        >
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {stat.value}
                          </div>
                          <div className="text-white/70 text-sm font-medium">
                            {stat.label}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-3">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-1.5 rounded-full transition-all duration-500 ${
                        index === currentImageIndex
                          ? `bg-gradient-to-r ${currentContent.color} shadow-lg scale-110`
                          : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 xl:hidden flex items-center gap-4 z-20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white/15 backdrop-blur-lg border border-white/30 p-3 rounded-full hover:bg-white/25 transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </button>

          <div className="flex gap-2 bg-white/15 backdrop-blur-lg border border-white/30 px-3 py-2 rounded-full shadow-lg">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white scale-125 shadow-sm"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
