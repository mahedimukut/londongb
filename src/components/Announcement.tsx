"use client";

import { MapPin, ArrowRight, Truck, ShoppingBag, Clock } from "lucide-react";
import React from "react";
import Link from "next/link";

const Announcement = () => {
  // Dynamic data configuration
  const storeInfo = {
    hours: { open: 10, close: 20 }, // 10AM - 8PM
    freeShippingThreshold: 500,
    currencySymbol: "৳",
    currentSeason: "Summer '25",
    sale: {
      active: true,
      discount: "40%",
      url: "/summer-sale",
    },
  };

  const currentHour = new Date().getHours();
  const isStoreOpen =
    currentHour >= storeInfo.hours.open && currentHour < storeInfo.hours.close;

  return (
    <div className="bg-gradient-to-r from-brand-primary-700 to-brand-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          {/* Left - Store Information */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {/* Free Shipping */}
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-primary-200" />
              <span>
                Free shipping on orders over{" "}
                <span className="font-medium">
                  {storeInfo.currencySymbol}
                  {storeInfo.freeShippingThreshold}
                </span>
              </span>
            </div>

            <div
              className="hidden sm:block w-px h-5 bg-white/30"
              aria-hidden="true"
            />

            {/* New Collection */}
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-brand-primary-200" />
              <span>
                <span className="font-medium">New Collection:</span>{" "}
                {storeInfo.currentSeason}
              </span>
            </div>

            <div
              className="hidden sm:block w-px h-5 bg-white/30"
              aria-hidden="true"
            />

            {/* Store Status */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-primary-200" />
              <span className="flex items-center gap-1.5">
                <span className="font-medium">Store:</span>
                <span className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      isStoreOpen ? "bg-green-400 animate-pulse" : "bg-red-400"
                    }`}
                    aria-hidden="true"
                  />
                  {isStoreOpen
                    ? `Open now (until ${storeInfo.hours.close}:00)`
                    : `Closed (opens at ${storeInfo.hours.open}:00)`}
                </span>
              </span>
            </div>
          </div>

          {/* Right - CTA (Conditional) */}
          {storeInfo.sale.active && (
            <div className="flex-shrink-0">
              <Link
                href={storeInfo.sale.url}
                className="group inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-xs font-medium hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <span>Seasonal Sale - Up to {storeInfo.sale.discount} Off</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
