"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Truck,
  Shield,
  CreditCard,
  RotateCcw,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

type FAQCategory = "shipping" | "returns" | "products" | "payments";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("shipping");
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqData: Record<
    FAQCategory,
    Array<{ question: string; answer: string }>
  > = {
    shipping: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 3-5 business days within Bangladesh. For international orders, delivery times vary between 7-14 business days depending on the destination.",
      },
      {
        question: "What are your shipping options?",
        answer:
          "We offer standard shipping (3-5 days), express shipping (1-2 days), and same-day delivery in Dhaka for orders placed before 12 PM.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination and will be calculated at checkout.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive a tracking number via email. You can track your package using our order tracking page or the courier's website.",
      },
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer:
          "We accept returns within 30 days of delivery for unused, unwashed items with original tags attached. Some items like diapers and feeding bottles are final sale unless defective.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Visit our Returns Center, enter your order number and email address, then follow the instructions. You'll receive a return label if applicable.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Once we receive your return, refunds are processed within 3-5 business days. The time it takes for the credit to appear in your account depends on your bank.",
      },
      {
        question: "Who pays for return shipping?",
        answer:
          "For returns due to our error, we cover return shipping. For other returns, the customer is responsible unless you choose to return the item to one of our physical stores.",
      },
    ],
    products: [
      {
        question: "Are your products safe for newborns?",
        answer:
          "Absolutely! All our products meet or exceed international safety standards. We specially mark items recommended for newborns with a 'Newborn Safe' badge.",
      },
      {
        question: "Where are your products manufactured?",
        answer:
          "We source from trusted manufacturers worldwide, with many items made in Bangladesh supporting local artisans. All products meet our strict quality and safety standards regardless of origin.",
      },
      {
        question: "How do I know what size to order?",
        answer:
          "Each product page includes detailed size charts. For clothing, we recommend measuring your baby and comparing to our charts as brands may vary. When in doubt, size up!",
      },
      {
        question: "Do you offer organic products?",
        answer:
          "Yes! Look for our 'Organic Collection' filter to find certified organic clothing, bedding, and feeding products. All organic items are clearly labeled.",
      },
    ],
    payments: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit/debit cards, bKash, Nagad, Rocket, and bank transfers. We also offer cash on delivery within Bangladesh.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes! We use SSL encryption and never store your full payment details. All transactions are processed through PCI-compliant payment gateways.",
      },
      {
        question: "Do you offer installment plans?",
        answer:
          "Yes, through selected partners. Look for the 'Pay in Installments' option at checkout for eligible items over ৳5,000.",
      },
      {
        question: "Why was my card declined?",
        answer:
          "This is usually due to your bank's security measures. Contact your bank to authorize the transaction, or try an alternative payment method.",
      },
    ],
  };

  const supportOptions = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get answers within 24 hours",
      action: "Email Us",
      link: "mailto:support@babyhaven.com",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Mon-Fri, 9AM-6PM",
      action: "Call Now",
      link: "tel:+8801234567890",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description: "Instant help during business hours",
      action: "Start Chat",
      link: "#",
      onClick: () => alert("Live chat would open here"),
    },
  ];

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-neutral-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto">
            Find quick answers to common questions about orders, products, and
            our services. Can't find what you need? Our team is happy to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-brand-neutral-900 mb-6">
                Browse Help Topics
              </h2>
              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeCategory === "shipping"
                      ? "bg-brand-primary-100 text-brand-primary-600 hover:bg-brand-primary-100"
                      : "hover:bg-brand-neutral-50 text-brand-neutral-700"
                  }`}
                  onClick={() => setActiveCategory("shipping")}
                >
                  <Truck className="h-5 w-5 mr-3" />
                  Shipping & Delivery
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeCategory === "returns"
                      ? "bg-brand-primary-100 text-brand-primary-600 hover:bg-brand-primary-100"
                      : "hover:bg-brand-neutral-50 text-brand-neutral-700"
                  }`}
                  onClick={() => setActiveCategory("returns")}
                >
                  <RotateCcw className="h-5 w-5 mr-3" />
                  Returns & Exchanges
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeCategory === "products"
                      ? "bg-brand-primary-100 text-brand-primary-600 hover:bg-brand-primary-100"
                      : "hover:bg-brand-neutral-50 text-brand-neutral-700"
                  }`}
                  onClick={() => setActiveCategory("products")}
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Products & Sizing
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeCategory === "payments"
                      ? "bg-brand-primary-100 text-brand-primary-600 hover:bg-brand-primary-100"
                      : "hover:bg-brand-neutral-50 text-brand-neutral-700"
                  }`}
                  onClick={() => setActiveCategory("payments")}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Payments & Security
                </Button>
              </nav>

              <div className="mt-8 pt-6 border-t border-brand-neutral-200">
                <h3 className="font-medium text-brand-neutral-900 mb-4">
                  Still need help?
                </h3>
                <div className="space-y-3">
                  {supportOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 hover:bg-brand-neutral-50 rounded-lg transition-colors cursor-pointer"
                      onClick={
                        option.onClick ||
                        (() => window.open(option.link, "_blank"))
                      }
                    >
                      <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                        {option.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-brand-neutral-900">
                          {option.title}
                        </h4>
                        <p className="text-sm text-brand-neutral-600">
                          {option.description}
                        </p>
                        <Button
                          variant="link"
                          className="text-brand-primary-600 p-0 h-auto hover:text-brand-primary-700"
                        >
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-primary-50 rounded-full text-brand-primary-600">
                  {activeCategory === "shipping" && (
                    <Truck className="h-5 w-5" />
                  )}
                  {activeCategory === "returns" && (
                    <RotateCcw className="h-5 w-5" />
                  )}
                  {activeCategory === "products" && (
                    <HelpCircle className="h-5 w-5" />
                  )}
                  {activeCategory === "payments" && (
                    <CreditCard className="h-5 w-5" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-brand-neutral-900 capitalize">
                  {activeCategory.replace("-", " ")} Questions
                </h2>
              </div>

              <div className="space-y-4">
                {faqData[activeCategory].map((item, index) => (
                  <div
                    key={index}
                    className="border border-brand-neutral-200 rounded-lg overflow-hidden hover:border-brand-neutral-300 transition-colors"
                  >
                    <button
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-brand-neutral-50 transition-colors"
                      onClick={() => toggleQuestion(index)}
                    >
                      <h3 className="font-medium text-brand-neutral-900">
                        {item.question}
                      </h3>
                      {openQuestion === index ? (
                        <ChevronUp className="h-5 w-5 text-brand-neutral-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-brand-neutral-500" />
                      )}
                    </button>
                    {openQuestion === index && (
                      <div className="p-4 pt-0 text-brand-neutral-600">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Help Section */}
            <div className="mt-8 bg-brand-primary-50 rounded-xl p-8 text-center border border-brand-primary-100">
              <h3 className="text-xl font-bold text-brand-neutral-900 mb-2">
                Didn't find your answer?
              </h3>
              <p className="text-brand-neutral-600 mb-6 max-w-2xl mx-auto">
                Our customer care team is ready to help with any questions about
                our products, your order, or anything else!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white"
                  asChild
                >
                  <Link href={"/contact"}>Contact Us</Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-brand-primary-600 border-brand-primary-600 hover:bg-brand-primary-50"
                  asChild
                >
                  <a href="tel:+8801234567890">Call Support</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
