"use client";

import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const paymentMethods = [
    { src: "/images/payments/bKash.png", alt: "bKash Payment" },
    { src: "/images/payments/cod.jpg", alt: "Cash on Delivery" },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "FAQs", href: "/faq" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Shipping Information", href: "/shipping" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-brand-primary-300" />,
      main: "+880 1684-986746",
      sub: "Sat-Thu, 9AM-10PM",
    },
    {
      icon: <Mail className="h-5 w-5 text-brand-primary-300" />,
      main: "support@britcartbd.com",
      sub: "Response within 24 hours",
    },
    {
      icon: <MapPin className="h-5 w-5 text-brand-primary-300" />,
      main: "123 Baby Lane, Dhaka 1212",
      sub: "Bangladesh",
    },
  ];

  // Enhanced Chatbot Configuration
  const agentImages = [
    "/images/chatbot/agent1.jpg",
    "/images/chatbot/agent2.webp",
    "/images/chatbot/agent3.jpg",
  ];
  const agentNames = ["Sarah", "Ayesha", "Fatima"];

  const [currentAgent, setCurrentAgent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  // Attractive automated message with emojis and offers
  const whatsappMessage = encodeURIComponent(
    `👋 Hello from LondonGB! \n\nI'm ${agentNames[currentAgent]}, your baby care specialist. \n\n✨ *Special Offer*: Get 15% OFF your first order with code WELCOME15! \n\nHow can I help you today? \n\n1️⃣ Product recommendations \n2️⃣ Order status \n3️⃣ Shipping questions \n4️⃣ Other inquiries`
  );

  // Rotate agent images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAgent((prev) => (prev + 1) % agentImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [agentImages.length]);

  // Stop pulsing after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Enhanced Floating WhatsApp Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <Link
          href={`https://wa.me/8801234567890?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Animated chat bubble */}
          {isPulsing && (
            <div className="absolute -top-20 -right-5 bg-white text-brand-neutral-900 text-sm px-3 py-2 rounded-lg shadow-xl w-48 animate-pulse">
              <div className="font-bold mb-1">Need help? 😊</div>
              <div className="text-xs">We're here for you!</div>
              <div className="absolute bottom-0 right-4 w-3 h-3 bg-white transform rotate-45 translate-y-1/2"></div>
            </div>
          )}

          {/* Main Chatbot Button */}
          <div
            className={`relative w-16 h-16 rounded-full overflow-hidden shadow-xl transition-all duration-300 hover:scale-110 ${
              isPulsing ? "ring-4 ring-brand-primary-400" : ""
            }`}
          >
            <Image
              src={agentImages[currentAgent]}
              alt="Chat with us"
              width={64}
              height={64}
              className="object-cover"
              priority
            />
            {/* Online status indicator */}
            <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
          </div>

          {/* Hover Tooltip */}
          {isHovering && (
            <div className="absolute -top-12 right-0 bg-brand-primary-600 text-white text-xs px-3 py-1 rounded-full shadow-md whitespace-nowrap animate-bounce">
              Chat with us! 💬
            </div>
          )}

          {/* WhatsApp Badge */}
          <div
            className={`absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 border-2 border-white ${
              isPulsing ? "animate-ping-slow" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Footer Content */}
      <footer className="bg-brand-neutral-900 text-white">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center">
                <h2 className="text-2xl font-bold text-white">BritCartBD</h2>
              </Link>
              <p className="text-brand-neutral-300 text-sm leading-relaxed">
                Your trusted partner for premium baby care products in
                Bangladesh. We deliver quality, safety, and comfort for your
                little ones.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 bg-brand-neutral-800 px-3 py-1.5 rounded-full">
                  <Shield className="h-4 w-4 text-brand-primary-300" />
                  <span className="text-xs">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 bg-brand-neutral-800 px-3 py-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4 text-brand-primary-300" />
                  <span className="text-xs">100% Authentic</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-brand-neutral-300 hover:text-brand-primary-300 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">
                Contact Us
              </h3>
              <ul className="space-y-4">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-brand-neutral-100 text-sm">
                        {item.main}
                      </p>
                      <p className="text-brand-neutral-500 text-xs mt-1">
                        {item.sub}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">
                Newsletter
              </h3>
              <p className="text-brand-neutral-300 text-sm mb-4">
                Subscribe for parenting tips, exclusive offers, and 10% off your
                first order.
              </p>
              <form className="space-y-3">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-brand-neutral-800 border-brand-neutral-700 text-white placeholder-brand-neutral-500 focus:ring-1 focus:ring-brand-primary-500"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-brand-primary-600 hover:bg-brand-primary-700 transition-colors"
                >
                  Subscribe
                </Button>
              </form>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-brand-neutral-200">
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      className="h-9 w-9 rounded-full bg-brand-neutral-800 flex items-center justify-center hover:bg-brand-primary-600 transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="bg-brand-neutral-950 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Payment Methods */}
              <div className="flex items-center gap-2">
                <span className="text-brand-neutral-400 text-sm mr-2">
                  We accept:
                </span>
                <div className="flex gap-2">
                  {paymentMethods.map((method, index) => (
                    <Image
                      key={index}
                      src={method.src}
                      alt={method.alt}
                      width={90}
                      height={24}
                      className="h-6 w-auto"
                    />
                  ))}
                </div>
              </div>

              {/* Copyright */}
              <div className="text-brand-neutral-500 text-sm text-center md:text-left">
                © {new Date().getFullYear()} LondonGB. All rights reserved.
              </div>

              {/* Developer Credit */}
              <div className="flex items-center space-x-2 text-brand-neutral-500 text-sm">
                <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
                <span>Made with love by</span>
                <Link
                  href="https://antstudio.agency"
                  className="hover:text-brand-primary-300 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  antStudio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Add these styles to your global CSS */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-ping-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </>
  );
}
