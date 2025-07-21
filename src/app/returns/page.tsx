"use client";

import {
  Truck,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReturnsExchangesPage() {
  const returnSteps = [
    {
      step: 1,
      icon: <HelpCircle className="h-6 w-6" />,
      title: "Initiate Return",
      description:
        "Start your return within 30 days of delivery through our Returns Center",
    },
    {
      step: 2,
      icon: <Package className="h-6 w-6" />,
      title: "Pack Your Items",
      description: "Include all original packaging, tags, and accessories",
    },
    {
      step: 3,
      icon: <Truck className="h-6 w-6" />,
      title: "Ship It Back",
      description:
        "Use the provided return label or drop off at one of our stores",
    },
    {
      step: 4,
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Receive Refund",
      description:
        "Get your refund within 3-5 business days after we process your return",
    },
  ];

  const returnConditions = [
    {
      condition: "Eligible Items",
      meets: true,
      description: "Unused, unwashed items with original tags and packaging",
    },
    {
      condition: "Time Frame",
      meets: true,
      description: "Within 30 days of delivery date",
    },
    {
      condition: "Final Sale Items",
      meets: false,
      description:
        "Diapers, feeding bottles, and personalized items cannot be returned",
    },
    {
      condition: "Defective Products",
      meets: true,
      description: "Contact us immediately for replacement or refund",
    },
  ];

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-brand-primary-50 text-brand-primary-600 p-3 rounded-full mb-4">
            <RotateCcw className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-neutral-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto">
            We want you to be completely happy with your purchase. Here's
            everything you need to know about returning or exchanging items.
          </p>
        </div>

        {/* Policy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-full text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-brand-neutral-900">
                Easy Returns
              </h2>
            </div>
            <p className="text-brand-neutral-600 mb-4">
              Most items can be returned within 30 days of delivery for a full
              refund to your original payment method.
            </p>
            <ul className="space-y-2 text-brand-neutral-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>No restocking fees</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Free returns for defective or incorrect items</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>
                  In-store returns available at all Baby Haven locations
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-brand-neutral-900">
                Simple Exchanges
              </h2>
            </div>
            <p className="text-brand-neutral-600 mb-4">
              Need a different size or color? We'll help you exchange your item
              quickly.
            </p>
            <ul className="space-y-2 text-brand-neutral-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Exchanges processed within 1-2 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>No additional shipping fees for size exchanges</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Prepaid return label included with exchange orders</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-brand-neutral-900 mb-8 text-center">
            How Returns Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {returnSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary-100 text-brand-primary-600">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 flex items-center justify-center h-6 w-6 rounded-full bg-brand-primary-600 text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-brand-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              className="bg-brand-primary-600 hover:bg-brand-primary-700"
              asChild
            >
              <a href="/returns-center">Start Your Return</a>
            </Button>
          </div>
        </div>

        {/* Conditions & Exceptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
            <h2 className="text-xl font-bold text-brand-neutral-900 mb-6">
              Return Conditions
            </h2>

            <div className="space-y-4">
              {returnConditions.map((item) => (
                <div key={item.condition} className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      item.meets
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {item.meets ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-neutral-900">
                      {item.condition}
                    </h3>
                    <p className="text-brand-neutral-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
            <h2 className="text-xl font-bold text-brand-neutral-900 mb-6">
              Refund Timeline
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-brand-neutral-900">
                    Standard Refunds
                  </h3>
                  <p className="text-brand-neutral-600">
                    Refunds are processed within 3-5 business days after we
                    receive your return. The time it takes for the credit to
                    appear in your account depends on your bank.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-brand-neutral-900">
                    Payment Methods
                  </h3>
                  <p className="text-brand-neutral-600">
                    Refunds are issued to the original payment method. Cash on
                    delivery orders will be refunded via bKash or bank transfer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-brand-neutral-900">
                    Exchange Shipping
                  </h3>
                  <p className="text-brand-neutral-600">
                    For exchanges, we'll ship your new item as soon as we
                    process your return. You'll receive tracking information via
                    email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-brand-primary-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6 text-center">
            Common Return Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="border-b border-brand-neutral-200 pb-4">
              <h3 className="font-medium text-brand-neutral-900 mb-2">
                How do I know if my item is eligible for return?
              </h3>
              <p className="text-brand-neutral-600">
                Most unused, unwashed items with original tags are eligible for
                return within 30 days. Check the product page or your packing
                slip for any special return conditions. Diapers, feeding
                bottles, and personalized items are final sale.
              </p>
            </div>

            <div className="border-b border-brand-neutral-200 pb-4">
              <h3 className="font-medium text-brand-neutral-900 mb-2">
                What if I received a damaged or incorrect item?
              </h3>
              <p className="text-brand-neutral-600">
                Contact us immediately at support@babyhaven.com with your order
                number and photos of the issue. We'll arrange for a free return
                and send a replacement right away or issue a full refund.
              </p>
            </div>

            <div className="border-b border-brand-neutral-200 pb-4">
              <h3 className="font-medium text-brand-neutral-900 mb-2">
                Can I return items to a physical store?
              </h3>
              <p className="text-brand-neutral-600">
                Yes! You can return online purchases to any Baby Haven store
                location. Bring your items with original packaging and either
                your packing slip or order confirmation email.
              </p>
            </div>

            <div className="border-b border-brand-neutral-200 pb-4">
              <h3 className="font-medium text-brand-neutral-900 mb-2">
                How long does an exchange take?
              </h3>
              <p className="text-brand-neutral-600">
                Exchanges are typically processed within 1-2 business days after
                we receive your return. You'll receive tracking information for
                your new item via email.
              </p>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-8 text-center">
          <div className="inline-flex items-center justify-center bg-brand-primary-100 text-brand-primary-600 p-3 rounded-full mb-4">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-brand-neutral-900 mb-2">
            Need Help With Your Return?
          </h2>
          <p className="text-brand-neutral-600 mb-6 max-w-2xl mx-auto">
            Our customer service team is happy to assist with any questions
            about returns or exchanges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-brand-primary-600 hover:bg-brand-primary-700"
              asChild
            >
              <a href="mailto:returns@babyhaven.com">Email Returns Team</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:+8801234567890">Call Returns Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Visit Contact Page</a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
