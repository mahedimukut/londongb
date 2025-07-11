"use client";

import { useState } from "react";
import { Truck, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    saveInfo: false,
  });

  const cartItems = [
    {
      id: 1,
      name: "Luxury Baby Shower Gift Box",
      price: 5499,
      quantity: 1,
      image: "/images/products/moms-care.jpeg",
    },
    {
      id: 2,
      name: "Organic Cotton Gift Pouch",
      price: 2499,
      quantity: 2,
      image: "/images/products/diapering.jpeg",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 150;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral-50">
      <Header />

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-neutral-200 -z-10 rounded-full"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-primary-700 -z-10 rounded-full"
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>

          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber
                    ? "bg-brand-primary-600 text-white"
                    : "bg-brand-neutral-200 text-brand-neutral-600"
                }`}
              >
                {step > stepNumber ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step >= stepNumber
                    ? "text-brand-primary-600 font-medium"
                    : "text-brand-neutral-500"
                }`}
              >
                {stepNumber === 1
                  ? "Information"
                  : stepNumber === 2
                  ? "Payment"
                  : "Confirmation"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form or Confirmation */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-soft p-6 border border-brand-neutral-200"
            >
              <h2 className="text-xl font-bold text-brand-neutral-800 mb-6">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-brand-neutral-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                />
              </div>

              <h2 className="text-xl font-bold text-brand-neutral-800 mb-6">
                Shipping Address
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-brand-neutral-700 mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center mb-8">
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500 border-brand-neutral-300 rounded"
                />
                <label
                  htmlFor="saveInfo"
                  className="ml-2 block text-sm text-brand-neutral-700"
                >
                  Save this information for next time
                </label>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href="/shop"
                  className="flex items-center text-brand-primary-600 hover:text-brand-primary-700 font-medium"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Back to Shopping
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-primary-600 text-white font-medium rounded-md hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 shadow-button"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-soft p-6 border border-brand-neutral-200"
            >
              <h2 className="text-xl font-bold text-brand-neutral-800 mb-6">
                Payment Method
              </h2>

              <div className="space-y-4 mb-6">
                {/* bKash */}
                <div
                  className={`border rounded-md p-4 cursor-pointer transition-colors ${
                    paymentMethod === "bkash"
                      ? "border-brand-primary-500 bg-brand-primary-50"
                      : "border-brand-neutral-300 hover:border-brand-primary-300"
                  }`}
                  onClick={() => setPaymentMethod("bkash")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bkash"
                      name="paymentMethod"
                      checked={paymentMethod === "bkash"}
                      onChange={() => setPaymentMethod("bkash")}
                      className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500"
                    />
                    <label
                      htmlFor="bkash"
                      className="ml-3 block text-sm font-medium text-brand-neutral-700"
                    >
                      bKash
                    </label>
                    <div className="ml-auto">
                      <Image
                        src="/images/payments/bKash.png"
                        alt="bKash"
                        width={60}
                        height={30}
                        className="h-6 object-contain"
                      />
                    </div>
                  </div>
                  {paymentMethod === "bkash" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="bkashNumber"
                          className="block text-sm font-medium text-brand-neutral-700 mb-1"
                        >
                          bKash Mobile Number
                        </label>
                        <input
                          type="tel"
                          id="bkashNumber"
                          name="bkashNumber"
                          placeholder="01XXXXXXXXX"
                          className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                        />
                      </div>
                      <div className="bg-brand-primary-50 p-3 rounded-md text-sm text-brand-neutral-700">
                        <p>1. Go to your bKash Mobile Menu</p>
                        <p>2. Select "Make Payment"</p>
                        <p>3. Enter Merchant Number: 017XXXXXXXX</p>
                        <p>4. Enter Amount: ৳{total}</p>
                        <p>
                          5. Enter Reference:{" "}
                          {Math.floor(100000 + Math.random() * 900000)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div
                  className={`border rounded-md p-4 cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-brand-primary-500 bg-brand-primary-50"
                      : "border-brand-neutral-300 hover:border-brand-primary-300"
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500"
                    />
                    <label
                      htmlFor="cod"
                      className="ml-3 block text-sm font-medium text-brand-neutral-700"
                    >
                      Cash on Delivery
                    </label>
                    <Truck className="ml-auto h-5 w-5 text-brand-primary-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-brand-neutral-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-brand-neutral-300 text-brand-neutral-700 font-medium rounded-md hover:bg-brand-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-primary-600 text-white font-medium rounded-md hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 shadow-button"
                >
                  Complete Order
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="bg-white rounded-lg shadow-soft p-6 text-center border border-brand-neutral-200">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary-100 mb-4">
                <CheckCircle className="h-6 w-6 text-brand-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-brand-neutral-800 mb-2">
                Order Confirmed!
              </h2>
              <p className="text-brand-neutral-600 mb-6">
                Thank you for your purchase. Your order #
                {Math.floor(100000 + Math.random() * 900000)} has been placed
                successfully.
              </p>
              <div className="bg-brand-neutral-50 p-4 rounded-md mb-6 text-left">
                <h3 className="font-medium text-brand-neutral-800 mb-2">
                  Delivery Information
                </h3>
                <p className="text-brand-neutral-600">{formData.name}</p>
                <p className="text-brand-neutral-600">{formData.address}</p>
                <p className="text-brand-neutral-600">
                  {formData.city}, {formData.postalCode}
                </p>
                <p className="text-brand-neutral-600">{formData.phone}</p>
              </div>
              <Link
                href="/orders"
                className="inline-block px-6 py-2 bg-brand-primary-600 text-white font-medium rounded-md hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 shadow-button"
              >
                View Order Details
              </Link>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white rounded-lg shadow-soft p-6 h-fit sticky top-4 border border-brand-neutral-200">
          <h2 className="text-xl font-bold text-brand-neutral-800 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 border border-brand-neutral-200">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-brand-neutral-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-brand-neutral-600">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium text-brand-neutral-800">
                  ৳{item.price}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-neutral-200 pt-4 mb-6">
            <div className="flex justify-between text-sm text-brand-neutral-600 mb-2">
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-brand-neutral-600 mb-2">
              <span>Shipping</span>
              <span>৳{shipping}</span>
            </div>
            <div className="flex justify-between text-base font-medium text-brand-neutral-800 mt-4">
              <span>Total</span>
              <span>৳{total}</span>
            </div>
          </div>

          {step === 1 && (
            <div className="flex items-center text-sm text-brand-neutral-600 bg-brand-neutral-100 p-2 rounded-md">
              <Truck className="h-4 w-4 mr-2 text-brand-primary-500" />
              <span>Delivery in 2-3 business days</span>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
