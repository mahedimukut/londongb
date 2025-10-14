"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  CheckCircle,
  ArrowLeft,
  Plus,
  Edit,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "../context/CartContext";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface OrderSummary {
  items: Array<{
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [shippingOption, setShippingOption] = useState<
    "inside_dhaka" | "outside_dhaka"
  >("inside_dhaka");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);

  // Validation states
  const [phoneError, setPhoneError] = useState("");
  const [bkashError, setBkashError] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    saveInfo: false,
    saveAddress: false,
  });

  // Simple Bangladeshi number validation
  const isValidBangladeshiNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, "");
    return cleanNumber.length === 11 && cleanNumber.startsWith("01");
  };

  // Phone number validation
  const validatePhoneNumber = (number: string) => {
    if (!number) {
      setPhoneError("Phone number is required");
      return false;
    }

    if (!isValidBangladeshiNumber(number)) {
      setPhoneError("Please enter 11-digit number starting with 01");
      return false;
    }

    setPhoneError("");
    return true;
  };

  // bKash number validation
  const validateBkashNumber = (number: string) => {
    if (!number) {
      setBkashError("bKash number is required");
      return false;
    }

    if (!isValidBangladeshiNumber(number)) {
      setBkashError("Please enter valid bKash number (01XXXXXXXXX)");
      return false;
    }

    setBkashError("");
    return true;
  };

  // Calculate shipping cost based on selection
  const getShippingCost = () => {
    return shippingOption === "inside_dhaka" ? 60 : 120;
  };

  // Calculate order summary based on current cart or stored order summary
  const getOrderSummary = () => {
    if (orderSummary) {
      return orderSummary;
    }

    const shipping = getShippingCost();
    const tax = 0; // No tax as per requirement
    const subtotal = state.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + shipping + tax;

    return {
      items: state.cart.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image,
      })),
      subtotal,
      shipping,
      tax,
      total,
    };
  };

  const currentSummary = getOrderSummary();

  // Check if new address form is complete
  const isNewAddressComplete = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.street &&
      formData.city &&
      formData.state &&
      formData.postalCode
    );
  };

  // Update form data when selected address changes
  useEffect(() => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      if (selectedAddress) {
        setFormData((prev) => ({
          ...prev,
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
        }));
        // Validate the phone number from selected address
        validatePhoneNumber(selectedAddress.phone);
      }
    }
  }, [selectedAddressId, addresses]);

  // Fetch user data and addresses
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);

          // Pre-fill email from user data
          setFormData((prev) => ({
            ...prev,
            email: data.user.email || "",
          }));
        } else {
          // If not authenticated, enable guest checkout
          setIsGuestCheckout(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // If error, enable guest checkout
        setIsGuestCheckout(true);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses");
        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses || []);

          // Select default address if available
          const defaultAddress = data.addresses.find(
            (addr: Address) => addr.isDefault
          );
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (data.addresses.length > 0) {
            // Select first address if no default
            setSelectedAddressId(data.addresses[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchUserData();
    fetchAddresses();
  }, []);

  // Confetti effect when order is complete
  useEffect(() => {
    if (orderComplete) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [orderComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      // Only allow numbers and auto-format to 11 digits max
      const numbersOnly = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({
        ...prev,
        [name]: numbersOnly,
      }));
      // Validate as user types
      validatePhoneNumber(numbersOnly);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleAddAddress = async () => {
    if (!isNewAddressComplete()) {
      toast.error("Please fill all required address fields", {
        position: "bottom-right",
      });
      return;
    }

    // Validate phone number before adding address
    if (!validatePhoneNumber(formData.phone)) {
      toast.error("Please enter a valid phone number", {
        position: "bottom-right",
      });
      return;
    }

    const toastId = toast.loading("Adding address...", {
      position: "bottom-right",
    });

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          isDefault: formData.saveAddress || addresses.length === 0,
        }),
      });

      if (response.ok) {
        const { address } = await response.json();
        setAddresses((prev) => [...prev, address]);
        setSelectedAddressId(address.id);

        toast.update(toastId, {
          render: "Address added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        const error = await response.json();
        toast.update(toastId, {
          render: error.error || "Failed to add address",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.update(toastId, {
        render: "Failed to add address. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate phone number first
      if (!validatePhoneNumber(formData.phone)) {
        toast.error("Please enter a valid phone number", {
          position: "bottom-right",
        });
        return;
      }

      // For guest checkout, validate all required fields
      if (isGuestCheckout) {
        if (!isNewAddressComplete()) {
          toast.error("Please fill all required fields for guest checkout", {
            position: "bottom-right",
          });
          return;
        }
      } else {
        // For logged-in users, check if we have either a selected address OR new address form data
        const hasSelectedAddress = selectedAddressId !== "";
        const hasNewAddressData = isNewAddressComplete();

        if (!hasSelectedAddress && !hasNewAddressData) {
          toast.error(
            "Please select a shipping address or complete the new address form",
            {
              position: "bottom-right",
            }
          );
          return;
        }

        // Validate email and phone for contact info
        if (!formData.email || !formData.phone) {
          toast.error("Please fill in email and phone number", {
            position: "bottom-right",
          });
          return;
        }
      }

      setStep(2);
      toast.success("Address information saved!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else if (step === 2) {
      // Validate bKash number if bKash payment method is selected
      if (paymentMethod === "bkash" && !validateBkashNumber(bkashNumber)) {
        toast.error("Please enter a valid bKash number", {
          position: "bottom-right",
        });
        return;
      }

      await handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    const toastId = toast.loading("Placing your order...", {
      position: "bottom-right",
    });

    setIsLoading(true);

    try {
      // Store order summary before clearing cart
      const shipping = getShippingCost();
      const tax = 0;
      const subtotal = state.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const total = subtotal + shipping + tax;

      const finalOrderSummary: OrderSummary = {
        items: state.cart.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          image: item.image,
        })),
        subtotal,
        shipping,
        tax,
        total,
      };

      // Map payment method to enum
      const paymentMethodEnum =
        paymentMethod === "bkash"
          ? "BKASH"
          : paymentMethod === "nagad"
          ? "NAGAD"
          : paymentMethod === "rocket"
          ? "ROCKET"
          : paymentMethod === "card"
          ? "CARD"
          : "CASH_ON_DELIVERY";

      // Prepare order items
      const orderItems = state.cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.color || "",
        size: item.size || "",
      }));

      // Create order payload
      const orderPayload: any = {
        paymentMethod: paymentMethodEnum,
        items: orderItems,
        subtotal,
        tax,
        shipping,
        discount: 0,
        total,
      };

      // Add bKash information if bKash payment
      if (paymentMethod === "bkash") {
        orderPayload.bkashNumber = bkashNumber;
        orderPayload.bkashReference = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        orderPayload.bkashTransaction = ""; // Added this field
      }

      // Add address information based on user type
      if (isGuestCheckout) {
        // Guest checkout - send guest data
        orderPayload.guestEmail = formData.email;
        orderPayload.guestShippingAddress = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        };
      } else {
        // Logged-in user - handle address creation/selection
        let addressId = selectedAddressId;

        if (!addressId && isNewAddressComplete()) {
          // Create new address first
          const addressResponse = await fetch("/api/addresses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              street: formData.street,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: formData.country,
              phone: formData.phone,
              isDefault: formData.saveAddress || addresses.length === 0,
            }),
          });

          if (!addressResponse.ok) {
            const error = await addressResponse.json();
            throw new Error(error.error || "Failed to create address");
          }

          const { address } = await addressResponse.json();
          addressId = address.id;
        }

        if (!addressId) {
          throw new Error("Please select or add a shipping address");
        }

        orderPayload.shippingAddressId = addressId;
      }

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || "Failed to create order");
      }

      const { order } = await orderResponse.json();
      setOrderNumber(order.orderNumber);
      setOrderSummary(finalOrderSummary);
      setOrderComplete(true);
      setStep(3);

      // Clear cart
      clearCart();

      toast.update(toastId, {
        render: "Order placed successfully! 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.update(toastId, {
        render:
          error instanceof Error
            ? error.message
            : "Failed to place order. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  if (state.cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-brand-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-brand-neutral-800 mb-4">
            Your cart is empty
          </h1>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-brand-primary-600 text-white font-medium rounded-md hover:bg-brand-primary-700"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-neutral-50">
      <Header />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

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
              {/* Guest Checkout Notice */}
              {isGuestCheckout && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-blue-800 font-medium">
                      Guest Checkout
                    </h3>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    You're checking out as a guest. Fill in your information
                    below to complete your order.
                  </p>
                </div>
              )}

              <h2 className="text-xl font-bold text-brand-neutral-800 mb-6">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Email *
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
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500 ${
                      phoneError ? "border-red-500" : "border-brand-neutral-300"
                    }`}
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                  />
                  {phoneError && (
                    <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-brand-neutral-800 mb-6">
                Shipping Address
              </h2>

              {/* Shipping Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-brand-neutral-700 mb-3">
                  Select Shipping Option
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-md p-4 cursor-pointer transition-all ${
                      shippingOption === "inside_dhaka"
                        ? "border-brand-primary-500 bg-brand-primary-50 shadow-sm"
                        : "border-brand-neutral-300 hover:border-brand-primary-300"
                    }`}
                    onClick={() => setShippingOption("inside_dhaka")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brand-neutral-800">
                          Inside Dhaka
                        </p>
                        <p className="text-sm text-brand-neutral-600">
                          2-3 business days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-primary-600">
                          ৳60
                        </p>
                        <div className="flex items-center mt-1">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingOption === "inside_dhaka"}
                            onChange={() => setShippingOption("inside_dhaka")}
                            className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer transition-all ${
                      shippingOption === "outside_dhaka"
                        ? "border-brand-primary-500 bg-brand-primary-50 shadow-sm"
                        : "border-brand-neutral-300 hover:border-brand-primary-300"
                    }`}
                    onClick={() => setShippingOption("outside_dhaka")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brand-neutral-800">
                          Outside Dhaka
                        </p>
                        <p className="text-sm text-brand-neutral-600">
                          3-5 business days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-primary-600">
                          ৳120
                        </p>
                        <div className="flex items-center mt-1">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingOption === "outside_dhaka"}
                            onChange={() => setShippingOption("outside_dhaka")}
                            className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Existing Addresses (only show for logged-in users) */}
              {!isGuestCheckout && addresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-brand-neutral-700 mb-3">
                    Select Saved Address
                  </h3>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-md p-4 cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? "border-brand-primary-500 bg-brand-primary-50"
                            : "border-brand-neutral-300 hover:border-brand-primary-300"
                        }`}
                        onClick={() => handleAddressSelect(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-brand-neutral-800">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-brand-neutral-600">
                              {address.street}, {address.city}, {address.state}{" "}
                              {address.postalCode}
                            </p>
                            <p className="text-sm text-brand-neutral-600">
                              {address.phone}
                            </p>
                          </div>
                          {address.isDefault && (
                            <span className="text-xs bg-brand-primary-100 text-brand-primary-800 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center my-4">
                    <span className="text-sm text-brand-neutral-500">OR</span>
                  </div>
                </div>
              )}

              {/* New Address Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-brand-neutral-800 mb-4">
                  {!isGuestCheckout && addresses.length > 0
                    ? "Add New Address"
                    : "Shipping Address"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-brand-neutral-700 mb-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-brand-neutral-700 mb-1"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-brand-neutral-700 mb-1"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-brand-neutral-300 rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-brand-neutral-700 mb-1"
                    >
                      City *
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
                      htmlFor="state"
                      className="block text-sm font-medium text-brand-neutral-700 mb-1"
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
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
                      Postal Code *
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

                {/* Save address checkbox (only for logged-in users) */}
                {!isGuestCheckout && !selectedAddressId && (
                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      name="saveAddress"
                      checked={formData.saveAddress}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500 border-brand-neutral-300 rounded"
                    />
                    <label
                      htmlFor="saveAddress"
                      className="ml-2 block text-sm text-brand-neutral-700"
                    >
                      Save this address for future orders
                    </label>
                  </div>
                )}

                {!selectedAddressId &&
                  isNewAddressComplete() &&
                  !phoneError && (
                    <div className="mb-6 p-3 bg-brand-primary-50 border border-brand-primary-200 rounded-md">
                      <p className="text-sm text-brand-primary-700">
                        ✓ Address form is complete. Click "Continue to Payment"
                        to proceed.
                      </p>
                    </div>
                  )}
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href="/shop"
                  className="flex items-center text-brand-primary-600 hover:text-brand-primary-700 font-medium"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Back to shopping
                </Link>
                <button
                  type="submit"
                  disabled={!!phoneError}
                  className="px-6 py-2 bg-brand-primary-600 text-white font-medium rounded-md hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Selected Address Display */}
              {(selectedAddress || isGuestCheckout) && (
                <div className="bg-brand-primary-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-brand-neutral-800 mb-2">
                    Shipping to:
                  </h3>
                  <p className="text-brand-neutral-600">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-brand-neutral-600">
                    {formData.street}, {formData.city}, {formData.state}{" "}
                    {formData.postalCode}
                  </p>
                  <p className="text-brand-neutral-600">{formData.phone}</p>
                  <p className="text-brand-neutral-600">{formData.email}</p>
                  {isGuestCheckout && (
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <User className="h-4 w-4 mr-1" />
                      Guest Order
                    </div>
                  )}
                </div>
              )}

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
                          bKash Mobile Number *
                        </label>
                        <input
                          type="tel"
                          id="bkashNumber"
                          name="bkashNumber"
                          value={bkashNumber}
                          onChange={(e) => {
                            const numbersOnly = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 11);
                            setBkashNumber(numbersOnly);
                            validateBkashNumber(numbersOnly);
                          }}
                          placeholder="01XXXXXXXXX"
                          maxLength={11}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-brand-primary-500 focus:border-brand-primary-500 ${
                            bkashError
                              ? "border-red-500"
                              : "border-brand-neutral-300"
                          }`}
                        />
                        {bkashError && (
                          <p className="mt-1 text-sm text-red-600">
                            {bkashError}
                          </p>
                        )}
                      </div>
                      <div className="bg-brand-primary-50 p-3 rounded-md text-sm text-brand-neutral-700">
                        <p className="font-medium mb-2">
                          bKash Payment Instructions:
                        </p>
                        <p>1. Go to your bKash Mobile Menu</p>
                        <p>2. Select "Send Money"</p>
                        <p>3. Enter Merchant Number: +880 1684-986746</p>
                        <p>
                          4. Enter Amount: ৳{currentSummary.total.toFixed(2)}
                        </p>
                        <p>
                          5. Enter Reference:{" "}
                          {Math.floor(100000 + Math.random() * 900000)}
                        </p>
                        <p className="mt-2 text-brand-primary-600 font-medium">
                          Save the reference number for verification!
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
                  disabled={
                    isLoading || (paymentMethod === "bkash" && !!bkashError)
                  }
                  className="px-6 py-2 bg-brand-primary-600 text-white font-medium rounded-md hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Placing Order..." : "Complete Order"}
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
                Thank you for your purchase. Your order #{orderNumber} has been
                placed successfully.
              </p>

              {/* Delivery Information */}
              <div className="bg-brand-neutral-50 p-4 rounded-md mb-6 text-left">
                <h3 className="font-medium text-brand-neutral-800 mb-2">
                  Delivery Information
                </h3>
                <p className="text-brand-neutral-600">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-brand-neutral-600">{formData.street}</p>
                <p className="text-brand-neutral-600">
                  {formData.city}, {formData.state} {formData.postalCode}
                </p>
                <p className="text-brand-neutral-600">{formData.phone}</p>
                <p className="text-brand-neutral-600">{formData.email}</p>
                {isGuestCheckout && (
                  <div className="mt-2 flex items-center text-sm text-blue-600">
                    <User className="h-4 w-4 mr-1" />
                    Guest Order - Please save your order number for tracking
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                {!isGuestCheckout ? (
                  <Link
                    href="/orders"
                    className="inline-block px-6 py-2 bg-brand-primary-600 text-white font-medium rounded-md hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 shadow-button"
                  >
                    View Order Details
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      // For guest users, we can show order details in a modal or redirect to a tracking page
                      toast.info(
                        "Please login with your email next time to track your order under accounts!",
                        {
                          position: "bottom-right",
                        }
                      );
                    }}
                    className="inline-block px-6 py-2 bg-brand-primary-600 text-white font-medium rounded-md hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 shadow-button"
                  >
                    Track Your Order
                  </button>
                )}
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2 border border-brand-neutral-300 text-brand-neutral-700 font-medium rounded-md hover:bg-brand-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Account Creation Offer for Guest Users */}
              {isGuestCheckout && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Create an Account for Faster Checkout Next Time!
                  </h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Save your details, track orders easily, and get exclusive
                    offers.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white rounded-lg shadow-soft p-6 h-fit sticky top-4 border border-brand-neutral-200">
          <h2 className="text-xl font-bold text-brand-neutral-800 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {currentSummary.items.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 border border-brand-neutral-200">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <div className="absolute -top-1 -right-1 bg-brand-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-brand-neutral-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-brand-neutral-600">
                    ৳{item.price}
                  </p>
                  {item.color && (
                    <p className="text-xs text-brand-neutral-500">
                      Color: {item.color}
                    </p>
                  )}
                  {item.size && (
                    <p className="text-xs text-brand-neutral-500">
                      Size: {item.size}
                    </p>
                  )}
                </div>
                <div className="text-sm font-medium text-brand-neutral-800">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-neutral-200 pt-4 mb-6">
            <div className="flex justify-between text-sm text-brand-neutral-600 mb-2">
              <span>Subtotal</span>
              <span>৳{currentSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-brand-neutral-600 mb-2">
              <span>Shipping</span>
              <span>৳{currentSummary.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-brand-neutral-600 mb-2">
              <span>Tax</span>
              <span>৳{currentSummary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-medium text-brand-neutral-800 mt-4 pt-4 border-t border-brand-neutral-200">
              <span>Total</span>
              <span>৳{currentSummary.total.toFixed(2)}</span>
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

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
