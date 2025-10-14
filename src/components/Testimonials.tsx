"use client";

import Image from "next/image";
import {
  Star,
  StarHalf,
  Quote,
  Sparkles,
  Heart,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    location: "Dhaka",
    rating: 5,
    photo: "/images/testimonials/sarah.jpg",
    review:
      "The baby products are absolutely wonderful! From diapers to feeding supplies, everything is top quality and safe for my little one.",
    date: "2 weeks ago",
    featured: "Baby Products",
  },
  {
    id: 2,
    name: "Rahim A.",
    location: "Chittagong",
    rating: 4.5,
    photo: "/images/testimonials/rahim.jpg",
    review:
      "Amazing skincare products! My skin has never looked better. The moisturizers and serums are worth every taka.",
    date: "1 month ago",
    featured: "Skin Care",
  },
  {
    id: 3,
    name: "Nusrat J.",
    location: "Sylhet",
    rating: 5,
    photo: "/images/testimonials/nusrat.jpg",
    review:
      "The health and beauty range is fantastic! Natural ingredients that actually work. My go-to for personal care essentials.",
    date: "3 weeks ago",
    featured: "Health & Beauty",
  },
  {
    id: 4,
    name: "Karim M.",
    location: "Khulna",
    rating: 5,
    photo: "/images/testimonials/rahmina.jpg",
    review:
      "Great electronics selection! Bought a smartphone and headphones - both authentic products with excellent performance.",
    date: "2 months ago",
    featured: "Electronics",
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < fullStars ? (
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ) : i === fullStars && hasHalfStar ? (
            <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ) : (
            <Star className="h-5 w-5 text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-brand-primary-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-brand-primary-100/30 blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-brand-primary-200/20 blur-3xl"></div>
      </div>

      {/* Floating hearts */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            y: [0, -40],
            x: Math.random() > 0.5 ? [0, 20] : [0, -20],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute text-pink-300"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        >
          <Heart className="h-6 w-6 fill-pink-300/20" />
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center bg-white text-brand-primary-600 px-6 py-2 rounded-full shadow-sm mb-6 border border-brand-primary-100"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Customer Stories</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-brand-neutral-800 mb-4">
            Trusted by <span className="text-brand-primary-600">Thousands</span>{" "}
            Across Bangladesh
          </h2>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto text-lg">
            Discover why customers love shopping with us for all their lifestyle
            needs - from baby care to electronics and beyond
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-white/20 group"
            >
              {/* Featured badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                {testimonial.featured}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md mr-4">
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-neutral-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-brand-neutral-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>

                <StarRating rating={testimonial.rating} />

                <blockquote className="mt-6 text-brand-neutral-700 relative">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-brand-primary-100 rotate-180 z-0" />
                  <p className="relative z-10 italic">"{testimonial.review}"</p>
                  <Quote className="absolute -bottom-2 -right-2 h-6 w-6 text-brand-primary-100 z-0" />
                </blockquote>

                <div className="mt-6 pt-4 border-t border-brand-neutral-100 flex justify-between items-center">
                  <span className="text-xs text-brand-neutral-500">
                    {testimonial.date}
                  </span>
                  <Link
                    href={`/shop?category=${testimonial.featured
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-xs text-brand-primary-600 hover:text-brand-primary-700 font-medium flex items-center"
                  >
                    Shop {testimonial.featured}
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
