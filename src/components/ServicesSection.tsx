"use client";

import { Truck, ShieldCheck, RefreshCw, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesSection() {
  const services = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Fast Delivery",
      id: "delivery",
      color: "bg-brand-primary-50",
      textColor: "text-brand-primary-600",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Secure Payment",
      id: "payment",
      color: "bg-brand-secondary-50",
      textColor: "text-brand-secondary-600",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Easy Returns",
      id: "returns",
      color: "bg-brand-sky-50",
      textColor: "text-brand-sky-600",
    },
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: "Authentic Brands",
      id: "authentic",
      color: "bg-brand-gold-50",
      textColor: "text-brand-gold-600",
    },
  ];

  return (
    <section className="py-8 md:py-10 bg-white border-t border-b border-brand-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Responsive Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              whileHover={{
                y: -3,
                backgroundColor: service.color.replace("50", "100"),
              }}
              className={`${service.color} rounded-xl p-4 md:p-5 flex items-center space-x-3 transition-all`}
            >
              <div
                className={`p-2 rounded-lg ${service.textColor.replace(
                  "600",
                  "100"
                )}`}
              >
                {service.icon}
              </div>
              <h3
                className={`${service.textColor} text-sm md:text-base font-medium`}
              >
                {service.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
