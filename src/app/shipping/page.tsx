"use client";

import {
  Truck,
  Clock,
  Check,
  X,
  Package,
  Globe,
  CreditCard,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ShippingPage() {
  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-brand-primary-50 rounded-full text-brand-primary-600 mb-4">
            <Truck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-neutral-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto">
            We deliver happiness to your doorstep! Here's everything you need to
            know about our shipping policies.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6 mb-12">
          <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
            Shipping Methods & Delivery Times
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Shipping */}
            <div className="border border-brand-neutral-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                  <Package className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">Standard Shipping</h3>
              </div>
              <ul className="space-y-3 text-brand-neutral-700">
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-brand-neutral-400 flex-shrink-0" />
                  <span>3-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="h-5 w-5 text-brand-neutral-400 flex-shrink-0" />
                  <span>৳100 (Free on orders over ৳500)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Available nationwide</span>
                </li>
              </ul>
            </div>

            {/* Express Shipping */}
            <div className="border border-brand-neutral-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">Express Shipping</h3>
              </div>
              <ul className="space-y-3 text-brand-neutral-700">
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-brand-neutral-400 flex-shrink-0" />
                  <span>1-2 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="h-5 w-5 text-brand-neutral-400 flex-shrink-0" />
                  <span>৳250 (Free on orders over ৳1000)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Available in major cities</span>
                </li>
              </ul>
            </div>

            {/* International Shipping */}
            <div className="border border-brand-neutral-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">International Shipping</h3>
              </div>
              <ul className="space-y-3 text-brand-neutral-700">
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-brand-neutral-400 flex-shrink-0" />
                  <span>7-14 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="h-5 w-5 text-brand-neutral-400 flex-shrink-0" />
                  <span>Variable rates (calculated at checkout)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Available to select countries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Processing Time */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
            <h2 className="text-xl font-bold text-brand-neutral-900 mb-6 flex items-center gap-3">
              <Clock className="h-6 w-6 text-brand-primary-600" />
              Order Processing
            </h2>
            <div className="space-y-4 text-brand-neutral-700">
              <p>
                All orders are processed within{" "}
                <strong>1-2 business days</strong> (Monday-Friday, excluding
                public holidays) after receiving your order confirmation email.
              </p>
              <p>
                Orders placed after 2 PM or on weekends will be processed the
                next business day.
              </p>
              <p>
                You will receive a shipping confirmation email with tracking
                information once your order has been dispatched.
              </p>
            </div>
          </div>

          {/* Delivery Areas */}
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
            <h2 className="text-xl font-bold text-brand-neutral-900 mb-6 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-brand-primary-600" />
              Delivery Areas
            </h2>
            <div className="space-y-4 text-brand-neutral-700">
              <p>
                We deliver to all districts in Bangladesh. Delivery times may
                vary depending on your location:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Dhaka, Chittagong, Sylhet:</strong> Next day delivery
                  available for express shipping
                </li>
                <li>
                  <strong>Other major cities:</strong> 2-3 business days for
                  standard shipping
                </li>
                <li>
                  <strong>Remote areas:</strong> Additional 1-2 business days
                  may be required
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shipping Restrictions */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6 mb-12">
          <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
            Shipping Restrictions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-brand-neutral-900 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                What We Can Ship
              </h3>
              <ul className="space-y-3 text-brand-neutral-700 pl-7">
                <li>All baby clothing and accessories</li>
                <li>Toys and learning materials</li>
                <li>Feeding supplies (excluding liquids)</li>
                <li>Nursery decor items</li>
                <li>Bath and skincare products (non-hazardous)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-brand-neutral-900 flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                Shipping Limitations
              </h3>
              <ul className="space-y-3 text-brand-neutral-700 pl-7">
                <li>No hazardous materials (certain cleaning products)</li>
                <li>No perishable items</li>
                <li>
                  International restrictions on certain baby care products
                </li>
                <li>Oversized items may have special shipping requirements</li>
                <li>Some rural areas may have limited service</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tracking & Support */}
        <div className="bg-brand-primary-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
            Track Your Order
          </h2>
          <p className="text-brand-neutral-700 mb-6 max-w-3xl">
            Once your order has shipped, you'll receive a tracking number via
            email. Use our tracking system to follow your package's journey to
            your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter your tracking number"
              className="flex-1 px-4 py-3 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
            />
            <button className="px-6 py-3 bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-md font-medium">
              Track Order
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-brand-neutral-200">
            <h3 className="font-bold text-brand-neutral-900 mb-4">
              Need Help With Your Order?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-brand-neutral-200">
                <h4 className="font-medium text-brand-neutral-900 mb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-brand-primary-600" />
                  Call Us
                </h4>
                <p className="text-brand-neutral-600">
                  Our customer service team is available to help with any
                  shipping questions.
                </p>
                <a
                  href="tel:+8801234567890"
                  className="mt-2 inline-block text-brand-primary-600 hover:underline"
                >
                  +880 1234 567890
                </a>
              </div>

              <div className="bg-white p-4 rounded-lg border border-brand-neutral-200">
                <h4 className="font-medium text-brand-neutral-900 mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-brand-primary-600" />
                  Email Us
                </h4>
                <p className="text-brand-neutral-600">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a
                  href="mailto:shipping@babyhaven.com"
                  className="mt-2 inline-block text-brand-primary-600 hover:underline"
                >
                  shipping@babyhaven.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
