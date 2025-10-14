"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import { Shield, Heart, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/account";
  const [isLoading, setIsLoading] = useState(true);

  // Redirect authenticated users
  useEffect(() => {
    if (status === "authenticated") {
      router.push(returnUrl);
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, router, returnUrl]);

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: returnUrl });
  };

  // Loading effect while checking session
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-primary-50 to-brand-sky-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-16 h-16 border-4 border-t-brand-primary-600 border-b-brand-primary-300 rounded-full mb-4"
          />
          <p className="text-brand-neutral-600">Checking authentication...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-primary-50 to-brand-sky-50 flex justify-center">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brand-neutral-600 hover:text-brand-primary-600 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-brand-neutral-200"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-brand-neutral-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-brand-neutral-500 text-sm">
                Sign in to your BritCartBD.com account
              </p>
            </div>

            {/* Social Login Buttons */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSignIn("google")}
              className="w-full flex items-center justify-center gap-3 bg-white border border-brand-neutral-300 rounded-xl py-4 px-6 text-brand-neutral-700 font-medium hover:shadow-md transition-all duration-200 mb-4 group"
            >
              <FcGoogle className="h-6 w-6" />
              <span className="group-hover:text-brand-neutral-800 transition-colors">
                Continue with Google
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSignIn("facebook")}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#1877F2] text-[#1877F2] rounded-xl py-4 px-6 font-medium hover:bg-[#f5f8ff] hover:shadow-md transition-all duration-200 mb-8 group"
            >
              <FaFacebook className="h-6 w-6" />
              <span className="group-hover:text-[#1666D9] transition-colors">
                Continue with Facebook
              </span>
            </motion.button>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-brand-neutral-500">
                  Why create an account?
                </span>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <Benefit
                icon={<Shield className="h-5 w-5 text-brand-primary-600" />}
                title="Secure & Protected"
                description="Your personal information and data are protected with bank-level security encryption."
              />
              <Benefit
                icon={<Heart className="h-5 w-5 text-brand-primary-600" />}
                title="Personalized Experience"
                description="Get product recommendations based on your age, developmental stage, and your preferences."
              />
              <Benefit
                icon={<Package className="h-5 w-5 text-brand-primary-600" />}
                title="Faster Checkout & Tracking"
                description="Save your addresses, track orders in real-time, and manage returns with just a few clicks."
              />
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-xs text-brand-neutral-500 leading-relaxed">
              By continuing, you agree to BritCartBD.com{" "}
              <a
                href="/terms"
                className="text-brand-primary-600 hover:underline font-medium"
              >
                terms of service
              </a>
              ,{" "}
              <a
                href="/privacy"
                className="text-brand-primary-600 hover:underline font-medium"
              >
                privacy policy
              </a>
              , and{" "}
              <a
                href="/cookies"
                className="text-brand-primary-600 hover:underline font-medium"
              >
                cookie policy
              </a>
            </p>

            {/* Support Link */}
            <div className="mt-4 pt-4 border-t border-brand-neutral-200">
              <p className="text-xs text-brand-neutral-500">
                Need help?{" "}
                <a
                  href="/contact"
                  className="text-brand-primary-600 hover:underline font-medium"
                >
                  Contact our support team
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// Benefit Component
const Benefit = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="bg-brand-primary-100 p-2 rounded-full flex-shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-semibold text-brand-neutral-900 mb-1">
        {title}
      </h4>
      <p className="text-xs text-brand-neutral-500 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

export default LoginPage;
