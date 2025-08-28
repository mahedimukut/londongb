"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { Shield, Mail, Heart, ArrowRight } from "lucide-react";

const GoogleLoginPage = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-brand-primary-50 to-brand-sky-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-brand-neutral-200"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-brand-neutral-900 mb-2">
                Sign In
              </h2>
              <p className="text-brand-neutral-500 text-sm">
                Choose your preferred sign-in method
              </p>
            </div>

            {/* Google Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-3 bg-white border border-brand-neutral-300 rounded-xl py-4 px-6 text-brand-neutral-700 font-medium hover:shadow-md transition-all duration-200 mb-6"
            >
              <FcGoogle className="h-6 w-6" />
              <span>Continue with Google</span>
            </motion.button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-brand-neutral-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email Sign In Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn("email")}
              className="w-full flex items-center justify-center gap-3 bg-brand-primary-600 text-white rounded-xl py-4 px-6 font-medium hover:bg-brand-primary-700 transition-all duration-200 mb-6"
            >
              <Mail className="h-5 w-5" />
              <span>Sign in with Email</span>
              <ArrowRight className="h-5 w-5 ml-auto" />
            </motion.button>

            {/* Benefits List */}
            <div className="space-y-4 pt-6 border-t border-brand-neutral-200">
              <h3 className="text-sm font-semibold text-brand-neutral-900 mb-3">
                Why sign in?
              </h3>

              <div className="flex items-start gap-3">
                <div className="bg-brand-primary-100 p-1 rounded-full mt-0.5">
                  <Shield className="h-4 w-4 text-brand-primary-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-brand-neutral-900">
                    Secure Account
                  </h4>
                  <p className="text-xs text-brand-neutral-500">
                    Your data is protected with industry-standard security
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-brand-primary-100 p-1 rounded-full mt-0.5">
                  <Heart className="h-4 w-4 text-brand-primary-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-brand-neutral-900">
                    Personalized Experience
                  </h4>
                  <p className="text-xs text-brand-neutral-500">
                    Get recommendations based on your baby's age and needs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-brand-primary-100 p-1 rounded-full mt-0.5">
                  <svg
                    className="h-4 w-4 text-brand-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-brand-neutral-900">
                    Order Tracking
                  </h4>
                  <p className="text-xs text-brand-neutral-500">
                    Track your orders and manage returns easily
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-6"
          >
            <p className="text-xs text-brand-neutral-500">
              By continuing, you agree to our{" "}
              <a
                href="/returns"
                className="text-brand-primary-600 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-brand-primary-600 hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default GoogleLoginPage;
