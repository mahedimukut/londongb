"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  Heart,
  Star,
  Baby,
  X,
  ChevronRight,
  Trash2,
  LogOut,
  Settings,
  Package,
  ChevronDown,
} from "lucide-react";
import Announcement from "./Announcement";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount] = useState(5);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();

  // Sample cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Organic Cotton Bodysuit",
      price: 2499,
      quantity: 1,
      image: "/images/products/baby-clothing.png",
      color: "Pink",
      size: "0-3 Months",
    },
    {
      id: 2,
      name: "Smart Baby Monitor",
      price: 12999,
      quantity: 1,
      image: "/images/products/bath-skincare.png",
      color: "White",
    },
    {
      id: 3,
      name: "Teething Toys Set",
      price: 1999,
      quantity: 2,
      image: "/images/products/moms-care.jpeg",
      color: "Green",
    },
  ]);

  // Close search/menu/cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when cart/menu is open
  useEffect(() => {
    if (cartOpen || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileMenuOpen]);

  const navItems = [
    {
      name: "Shop",
      href: "/shop",
      icon: <Baby className="w-5 h-5" />,
    },
    {
      name: "New Arrivals",
      href: "/new-arrivals",
      icon: <Star className="w-5 h-5" />,
    },
    {
      name: "For Moms",
      href: "/for-moms",
      icon: <Heart className="w-5 h-5" />,
    },
    { name: "Sale", href: "/sale" },
    { name: "Brands", href: "/brands" },
    { name: "Gifts", href: "/gifts" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    setCartCount(cartCount - 1);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <Announcement />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              className="p-2 -ml-2 rounded-md text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center flex-1 md:flex-none">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-display font-bold text-brand-primary-600">
                LondonGB
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8 mx-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className="text-lg font-medium text-brand-neutral-700 hover:text-brand-primary-600 transition-colors flex items-center gap-1"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search container */}
            <div className="relative" ref={searchRef}>
              <button
                className={`p-2.5 rounded-md text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-colors ${
                  searchOpen ? "bg-brand-primary-50 text-brand-primary-600" : ""
                }`}
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <span className="sr-only">Search</span>
                <Search className="w-6 h-6" aria-hidden="true" />
              </button>

              {/* Search input appears next to icon */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-brand-neutral-200 z-50 overflow-hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-3 text-base focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-neutral-500 hover:text-brand-neutral-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link href={"/wishlist"} className="relative">
              <button className="p-2.5 rounded-md text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-colors relative">
                <span className="sr-only">Wishlist</span>
                <Heart className="w-6 h-6" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-brand-primary-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Profile/Login Button */}
            <div className="relative" ref={profileRef}>
              {status === "authenticated" ? (
                <button
                  className="p-2.5 rounded-md text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-colors flex items-center gap-1"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="p-2.5 rounded-md text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-colors"
                >
                  <User className="w-6 h-6" />
                </button>
              )}

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-brand-neutral-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-brand-neutral-200">
                    <div className="flex items-center gap-3">
                      {session?.user?.image && (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-neutral-900 truncate">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-brand-neutral-500 truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-md transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-md transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-md transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-md transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </div>

                  <div className="p-2 border-t border-brand-neutral-200">
                    <button
                      onClick={() => {
                        signOut();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="p-2.5 rounded-md text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-colors relative"
              onClick={() => setCartOpen(true)}
            >
              <span className="sr-only">Cart</span>
              <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-brand-primary-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-white"
          ref={mobileMenuRef}
        >
          {/* Mobile menu header */}
          <div className="sticky top-0 z-10 bg-white border-b border-brand-neutral-200 px-4 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-display font-bold text-brand-primary-600">
                LondonGB
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-brand-neutral-700 hover:bg-brand-primary-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile menu content */}
          <div className="h-[calc(100vh-80px)] overflow-y-auto px-4 py-6">
            {/* Mobile search bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-brand-neutral-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-brand-neutral-200 rounded-lg bg-brand-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-primary-300 focus:bg-white"
                placeholder="Search products..."
              />
            </div>

            {/* Mobile navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-lg font-medium text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-brand-primary-500">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile account links */}
            <div className="mt-8 pt-6 border-t border-brand-neutral-200">
              {status === "authenticated" ? (
                <>
                  <div className="flex items-center px-4 py-3 mb-4">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                    ) : (
                      <User className="w-8 h-8 mr-3 text-brand-primary-500" />
                    )}
                    <div>
                      <p className="font-medium text-brand-neutral-900">
                        {session.user?.name}
                      </p>
                      <p className="text-sm text-brand-neutral-500">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/account"
                    className="flex items-center px-4 py-3 text-lg font-medium text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3 text-brand-primary-500" />
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center px-4 py-3 text-lg font-medium text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-5 h-5 mr-3 text-brand-primary-500" />
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signIn("google");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-lg font-medium text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors"
                >
                  <FcGoogle className="w-5 h-5 mr-3" />
                  Sign in with Google
                </button>
              )}

              <Link
                href="/wishlist"
                className="flex items-center px-4 py-3 text-lg font-medium text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5 mr-3 text-brand-primary-500" />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-brand-primary-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setCartOpen(false)}
          ></div>

          {/* Cart panel */}
          <div
            className="absolute inset-y-0 right-0 max-w-full flex"
            ref={cartRef}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="w-screen max-w-md h-full flex flex-col bg-white shadow-xl"
            >
              {/* Cart header */}
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-brand-neutral-900">
                    Shopping cart
                  </h2>
                  <button
                    type="button"
                    className="-mr-2 p-2 text-brand-neutral-400 hover:text-brand-neutral-500"
                    onClick={() => setCartOpen(false)}
                  >
                    <span className="sr-only">Close panel</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="mx-auto h-12 w-12 text-brand-neutral-400" />
                        <h3 className="mt-2 text-lg font-medium text-brand-neutral-900">
                          Your cart is empty
                        </h3>
                        <p className="mt-1 text-brand-neutral-500">
                          Start adding some items to your cart
                        </p>
                        <div className="mt-6">
                          <Link
                            href="/shop"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary-600 hover:bg-brand-primary-700"
                            onClick={() => setCartOpen(false)}
                          >
                            Continue Shopping
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <ul className="-my-6 divide-y divide-brand-neutral-200">
                        {cartItems.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-brand-neutral-200 rounded-md overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-brand-neutral-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">
                                    {formatPrice(item.price)}
                                  </p>
                                </div>
                                {item.color && (
                                  <p className="mt-1 text-sm text-brand-neutral-500">
                                    Color: {item.color}
                                  </p>
                                )}
                                {item.size && (
                                  <p className="mt-1 text-sm text-brand-neutral-500">
                                    Size: {item.size}
                                  </p>
                                )}
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center border border-brand-neutral-200 rounded-md">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="px-3 py-1 text-brand-neutral-600 hover:bg-brand-neutral-50"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="px-3 py-1 text-brand-neutral-600 hover:bg-brand-neutral-50"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-brand-primary-600 hover:text-brand-primary-500 flex items-center"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-brand-neutral-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-brand-neutral-900">
                    <p>Subtotal</p>
                    <p>{formatPrice(subtotal)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-brand-neutral-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/checkout"
                      className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-primary-600 hover:bg-brand-primary-700"
                      onClick={() => setCartOpen(false)}
                    >
                      Checkout
                    </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-brand-neutral-500">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        className="text-brand-primary-600 font-medium hover:text-brand-primary-500"
                        onClick={() => setCartOpen(false)}
                      >
                        Continue Shopping
                        <ChevronRight className="w-4 h-4 inline ml-1" />
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
