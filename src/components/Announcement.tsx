"use client";

import {
  ArrowRight,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import React from "react";
import Link from "next/link";

const Announcement = () => {
  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/britcartbd",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/britcartbd",
      color: "hover:text-pink-400",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/britcartbd",
      color: "hover:text-blue-300",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com/britcartbd",
      color: "hover:text-red-400",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-brand-primary-700 to-brand-primary-600 text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-2.5 flex items-center justify-between text-sm">
          {/* Left - Interesting Text with Social Icons */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                🚀 Save up to 20% on all products with "GET20OFF" code
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-colors duration-200 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right - Hot Deals Button */}
          <div className="flex-shrink-0">
            <Link
              href="/hot-deals"
              className="group inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-xs font-medium hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span>🔥 Hot Deals - Limited Time</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
