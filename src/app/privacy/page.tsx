"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="mx-auto bg-brand-primary-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-brand-primary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-neutral-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-brand-neutral-600 max-w-2xl mx-auto">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-brand-neutral-200 p-6 md:p-8">
          <div className="prose prose-brand max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Introduction
              </h2>
              <p className="text-brand-neutral-600 mb-4">
                At BabyHaven, we are committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or make a
                purchase from us.
              </p>
              <p className="text-brand-neutral-600">
                By using our services, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-brand-neutral-800 mb-2">
                Personal Information
              </h3>
              <ul className="list-disc pl-5 text-brand-neutral-600 mb-4 space-y-2">
                <li>
                  Contact details (name, email, phone number, shipping address)
                </li>
                <li>
                  Payment information (credit card details are processed
                  securely and not stored)
                </li>
                <li>Account credentials (if you create an account)</li>
                <li>Purchase history and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-neutral-800 mb-2">
                Non-Personal Information
              </h3>
              <ul className="list-disc pl-5 text-brand-neutral-600 mb-4 space-y-2">
                <li>Browser type and version</li>
                <li>Pages visited and time spent on site</li>
                <li>IP address and general location</li>
                <li>Device information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 text-brand-neutral-600 space-y-2">
                <li>To process and fulfill your orders</li>
                <li>To communicate with you about your account or orders</li>
                <li>To improve our products and services</li>
                <li>To personalize your shopping experience</li>
                <li>To prevent fraud and enhance security</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Data Sharing and Disclosure
              </h2>
              <p className="text-brand-neutral-600 mb-4">
                We do not sell your personal information. We may share
                information with:
              </p>
              <ul className="list-disc pl-5 text-brand-neutral-600 space-y-2">
                <li>
                  Service providers (payment processors, shipping carriers)
                </li>
                <li>Legal authorities when required by law</li>
                <li>Business partners in anonymized, aggregated form</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Data Security
              </h2>
              <p className="text-brand-neutral-600 mb-4">
                We implement appropriate security measures including:
              </p>
              <ul className="list-disc pl-5 text-brand-neutral-600 space-y-2">
                <li>SSL encryption for all data transmissions</li>
                <li>Secure payment processing</li>
                <li>Regular security audits</li>
                <li>Limited access to personal data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Your Rights
              </h2>
              <p className="text-brand-neutral-600 mb-4">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-5 text-brand-neutral-600 space-y-2">
                <li>Access your personal data</li>
                <li>Request correction or deletion</li>
                <li>Object to processing</li>
                <li>Request data portability</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-brand-neutral-600 mt-4">
                To exercise these rights, please contact us using the
                information below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Cookies and Tracking
              </h2>
              <p className="text-brand-neutral-600 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-5 text-brand-neutral-600 space-y-2">
                <li>Remember your preferences</li>
                <li>Analyze site traffic</li>
                <li>Improve user experience</li>
              </ul>
              <p className="text-brand-neutral-600 mt-4">
                You can control cookies through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Children's Privacy
              </h2>
              <p className="text-brand-neutral-600">
                Our services are not directed to children under 13. We do not
                knowingly collect personal information from children. If we
                become aware of such collection, we will take steps to delete
                the information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-brand-neutral-600">
                We may update this policy periodically. The updated version will
                be posted on our website with a new "Last updated" date. We
                encourage you to review this policy regularly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-neutral-900 mb-4">
                Contact Us
              </h2>
              <p className="text-brand-neutral-600 mb-4">
                If you have questions about this Privacy Policy, please contact
                us:
              </p>
              <ul className="text-brand-neutral-600 space-y-2">
                <li>
                  Email:{" "}
                  <Link
                    href="mailto:privacy@babyhaven.com"
                    className="text-brand-primary-600 hover:underline"
                  >
                    privacy@babyhaven.com
                  </Link>
                </li>
                <li>
                  Phone:{" "}
                  <Link
                    href="tel:+8801234567890"
                    className="text-brand-primary-600 hover:underline"
                  >
                    +880 1234 567890
                  </Link>
                </li>
                <li>Address: 123 Baby Street, Dhaka 1212, Bangladesh</li>
              </ul>
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link
                    href="/contact"
                    className="text-brand-primary-600 border-brand-primary-600 hover:bg-brand-primary-50"
                  >
                    Contact Form
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
