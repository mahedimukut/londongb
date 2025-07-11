"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Star, Gift, Sparkles } from "lucide-react";

const featuredBrands = [
  {
    id: 1,
    name: "Johnson's Baby",
    logo: "/images/brands/johnsons.jpg",
    href: "/brands/johnsons",
    featuredProduct: "/images/products/bath-skincare.png",
    rating: 4.8,
    featuredText: "Gentle baby care products",
  },
  {
    id: 2,
    name: "Pigeon",
    logo: "/images/brands/pigeon.png",
    href: "/brands/pigeon",
    featuredProduct: "/images/products/diapering.jpeg",
    rating: 4.6,
    featuredText: "Innovative baby feeding",
  },
  {
    id: 3,
    name: "Chicco",
    logo: "/images/brands/chicco.png",
    href: "/brands/chicco",
    featuredProduct: "/images/products/feeding-nursing.jpeg",
    rating: 4.7,
    featuredText: "Premium baby gear",
  },
  {
    id: 4,
    name: "Huggies",
    logo: "/images/brands/huggies.png",
    href: "/brands/huggies",
    featuredProduct: "/images/products/moms-care.jpeg",
    rating: 4.5,
    featuredText: "Comfortable diapers",
  },
  {
    id: 5,
    name: "Avent",
    logo: "/images/brands/avent.svg",
    href: "/brands/avent",
    featuredProduct: "/images/products/stroller-carrier.jpeg",
    rating: 4.9,
    featuredText: "Natural feeding solutions",
  },
  {
    id: 6,
    name: "Mustela",
    logo: "/images/brands/mustela.jpg",
    href: "/brands/mustela",
    featuredProduct: "/images/products/baby-clothing.png",
    rating: 4.7,
    featuredText: "Organic skincare",
  },
];

export default function FeaturedBrands() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-brand-primary-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-brand-primary-100/30 blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-brand-primary-200/20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-brand-primary-100/50 text-brand-primary-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Premium Brands
          </div>
          <h2 className="text-4xl font-bold text-brand-neutral-800 mb-4">
            Trusted by <span className="text-brand-primary-600">Parents</span>{" "}
            Worldwide
          </h2>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto text-lg">
            Carefully curated selection of premium baby care brands loved by
            families
          </p>
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredBrands.map((brand) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: brand.id * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-white/20"
            >
              <Link
                href={brand.href}
                className="flex flex-col items-center p-6"
              >
                <div className="relative h-20 w-full mb-4">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-sm font-semibold text-brand-neutral-700">
                  {brand.name}
                </span>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(brand.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    {brand.rating}
                  </span>
                </div>
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        {/* Shop by Brand CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/brands"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white font-medium rounded-full text-base shadow-md hover:shadow-lg transition-all group"
          >
            <span className="mr-2">Explore All Brands</span>
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Featured Products */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-brand-primary-50 to-white rounded-3xl p-8 shadow-inner border border-white/30"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-brand-neutral-800">
                Brand <span className="text-brand-primary-600">Highlights</span>
              </h3>
              <p className="text-brand-neutral-600">
                Discover our top-rated products from trusted brands
              </p>
            </div>
            <Link
              href="/featured"
              className="flex items-center text-brand-primary-600 hover:text-brand-primary-700 font-medium mt-4 md:mt-0"
            >
              View all featured
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBrands.slice(0, 4).map((brand) => (
              <motion.div
                key={`product-${brand.id}`}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-white/20 group"
              >
                <Link href={brand.href} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={brand.featuredProduct}
                      alt={`Featured ${brand.name} product`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/90 text-brand-primary-600 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      Featured
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-primary-600">
                        {brand.name}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-500 ml-1">
                          {brand.rating}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-brand-neutral-800 mb-2">
                      {brand.featuredText}
                    </h4>
                    <button className="w-full mt-3 px-4 py-2 bg-brand-primary-50 hover:bg-brand-primary-100 text-brand-primary-600 text-sm font-medium rounded-lg transition-colors">
                      Shop Now
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
