// components/Header.tsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  Heart,
  X,
  ChevronRight,
  LogOut,
  Settings,
  Package,
  ChevronDown,
  Home,
  Tag,
  Flame,
  ShoppingCart,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Announcement from "./Announcement";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../app/context/CartContext";
import { CartDrawer } from "./Cart/CartDrawer";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: {
    products: number;
  };
};

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand?: {
    name: string;
  };
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useCart();

  const { cartCount, wishlistCount } = state;

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/dashboard/categories");
        if (response.ok) {
          const categoriesData = await response.json();
          setDynamicCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Calculate scrollbar width on mount
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    setScrollbarWidth(scrollbarWidth);
  }, []);

  // Navigation items
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    {
      name: "Categories",
      href: "/categories",
      icon: Tag,
      hasDropdown: true,
    },
    { name: "Hot Deals", href: "/hot-deals", icon: Flame },
    { name: "Preorder", href: "/preorder", icon: Package },
  ];

  // Real search functionality
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `/api/dashboard/products?search=${encodeURIComponent(query)}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        const products = data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images[0]?.url || "/placeholder-product.jpg",
          brand: product.brand,
        }));
        setSearchResults(products);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Handle search submission - navigate to shop page with search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Handle category click - navigate to shop page with category filter
  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/shop?category=${categorySlug}`);
    setCategoriesDropdownOpen(false);
    setMobileCategoriesOpen(false);
    setMobileMenuOpen(false);
  };

  // Handle brand click - navigate to shop page with brand filter
  const handleBrandClick = (brandSlug: string) => {
    router.push(`/shop?brand=${brandSlug}`);
    setCategoriesDropdownOpen(false);
    setMobileCategoriesOpen(false);
    setMobileMenuOpen(false);
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targets = [
        { ref: searchRef, state: setSearchOpen },
        { ref: mobileMenuRef, state: setMobileMenuOpen },
        { ref: profileRef, state: setProfileDropdownOpen },
        { ref: categoriesRef, state: setCategoriesDropdownOpen },
      ];

      targets.forEach(({ ref, state }) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          state(false);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect with throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock with proper cleanup
  useEffect(() => {
    const shouldLock = mobileMenuOpen || cartOpen;

    if (shouldLock) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [mobileMenuOpen, cartOpen, scrollbarWidth]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setCartOpen(false);
        setSearchOpen(false);
        setProfileDropdownOpen(false);
        setCategoriesDropdownOpen(false);
        setMobileCategoriesOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Utility functions
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  }, []);

  // Handle sign in - redirect to login page with return URL
  const handleSignIn = () => {
    const returnUrl = pathname || "/";
    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Handle sign out
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // User Avatar Component with better session handling
  const UserAvatar = () => {
    if (status === "loading") {
      return (
        <div className="w-10 h-10 bg-brand-neutral-100 rounded-full flex items-center justify-center border-2 border-brand-neutral-200">
          <Loader2 className="w-5 h-5 text-brand-neutral-400 animate-spin" />
        </div>
      );
    }

    if (status === "authenticated" && session?.user?.image) {
      return (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          width={40}
          height={40}
          className="rounded-full border-2 border-brand-primary-200 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }

    return (
      <div className="w-10 h-10 bg-brand-primary-100 rounded-full flex items-center justify-center border-2 border-brand-primary-200">
        <User className="w-5 h-5 text-brand-primary-600" />
      </div>
    );
  };

  // Mobile User Avatar Component
  const MobileUserAvatar = () => {
    if (status === "loading") {
      return (
        <div className="w-12 h-12 bg-brand-neutral-100 rounded-full flex items-center justify-center border-2 border-brand-neutral-200">
          <Loader2 className="w-6 h-6 text-brand-neutral-400 animate-spin" />
        </div>
      );
    }

    if (status === "authenticated" && session?.user?.image) {
      return (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          width={48}
          height={48}
          className="rounded-full border-2 border-brand-primary-200 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }

    return (
      <div className="w-12 h-12 bg-brand-primary-100 rounded-full flex items-center justify-center border-2 border-brand-primary-200">
        <User className="w-6 h-6 text-brand-primary-600" />
      </div>
    );
  };

  // Action buttons component for reusability
  const ActionButton = ({
    icon: Icon,
    count,
    onClick,
    label,
    className = "",
    loading = false,
  }: {
    icon: React.ElementType;
    count?: number;
    onClick: () => void;
    label: string;
    className?: string;
    loading?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative p-2 rounded-lg text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={label}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand-primary-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center transform scale-100 hover:scale-110 transition-transform">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );

  return (
    <>
      <Announcement />

      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-lg border-b border-brand-neutral-100" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <ActionButton
                icon={Menu}
                onClick={() => setMobileMenuOpen(true)}
                label="Open menu"
              />
            </div>

            {/* Logo */}
            <div className="flex items-center ml-1 flex-1 lg:flex-none">
              <Link
                href="/"
                className="flex items-center group"
                aria-label="BritCartBD - Home"
              >
                <motion.span
                  className="text-2xl font-bold text-brand-primary-600 font-display"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  britcartbd.com
                </motion.span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 mx-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="relative"
                    ref={item.hasDropdown ? categoriesRef : null}
                  >
                    {item.hasDropdown ? (
                      <button
                        onClick={() =>
                          setCategoriesDropdownOpen(!categoriesDropdownOpen)
                        }
                        className="flex items-center gap-1 px-4 py-2 text-base font-semibold text-brand-neutral-700 hover:text-brand-primary-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                        aria-expanded={categoriesDropdownOpen}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            categoriesDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 px-4 py-2 text-base font-semibold text-brand-neutral-700 hover:text-brand-primary-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    )}

                    {/* Dynamic Categories Dropdown */}
                    <AnimatePresence>
                      {item.hasDropdown && categoriesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-brand-neutral-200 z-50 overflow-hidden"
                        >
                          <div className="p-2">
                            {categoriesLoading ? (
                              <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-brand-primary-600" />
                              </div>
                            ) : dynamicCategories.length > 0 ? (
                              dynamicCategories.map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() =>
                                    handleCategoryClick(category.slug)
                                  }
                                  className="flex items-center justify-between w-full px-3 py-3 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors duration-150 group"
                                >
                                  <span className="font-medium">
                                    {category.name}
                                  </span>
                                  <span className="text-xs text-brand-neutral-400 group-hover:text-brand-primary-400">
                                    {category._count.products}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-3 text-sm text-brand-neutral-500 text-center">
                                No categories found
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <div className="relative" ref={searchRef}>
                <ActionButton
                  icon={Search}
                  onClick={() => setSearchOpen(!searchOpen)}
                  label="Search products"
                  className={
                    searchOpen
                      ? "bg-brand-primary-50 text-brand-primary-600"
                      : ""
                  }
                />

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-brand-neutral-200 z-50 overflow-hidden"
                    >
                      <form onSubmit={handleSearchSubmit}>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-neutral-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products, brands, categories..."
                            className="w-full pl-11 pr-12 py-3 text-sm focus:outline-none placeholder-brand-neutral-400"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setSearchOpen(false)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-neutral-400 hover:text-brand-neutral-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Search Results */}
                        {searchQuery && (
                          <div className="border-t border-brand-neutral-200 max-h-96 overflow-y-auto">
                            {searchLoading ? (
                              <div className="p-6 text-center">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary-600" />
                                <p className="text-sm text-brand-neutral-500 mt-2">
                                  Searching products...
                                </p>
                              </div>
                            ) : searchResults.length > 0 ? (
                              <div className="p-2">
                                {searchResults.map((result) => (
                                  <Link
                                    key={result.id}
                                    href={`/products/${result.slug}`}
                                    className="flex items-center gap-3 px-3 py-3 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors group border-b border-brand-neutral-100 last:border-b-0"
                                    onClick={() => {
                                      setSearchOpen(false);
                                      setSearchQuery("");
                                    }}
                                  >
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={result.image}
                                        alt={result.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">
                                        {result.name}
                                      </p>
                                      {result.brand && (
                                        <p className="text-xs text-brand-neutral-500 mt-1">
                                          {result.brand.name}
                                        </p>
                                      )}
                                      <p className="text-sm text-brand-primary-600 font-semibold mt-1">
                                        {formatPrice(result.price)}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                                <div className="p-3 border-t border-brand-neutral-200">
                                  <button
                                    type="submit"
                                    className="w-full py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-medium"
                                  >
                                    View All Search Results
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-6 text-center">
                                <Search className="h-12 w-12 text-brand-neutral-300 mx-auto mb-3" />
                                <p className="text-sm text-brand-neutral-500 mb-2">
                                  No products found for "{searchQuery}"
                                </p>
                                <p className="text-xs text-brand-neutral-400">
                                  Try different keywords or browse categories
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist">
                <ActionButton
                  icon={Heart}
                  count={wishlistCount}
                  onClick={() => {}}
                  label="Wishlist"
                />
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  disabled={status === "loading"}
                  className="relative p-2 rounded-lg text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="User account"
                >
                  <UserAvatar />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-brand-neutral-200 z-50 overflow-hidden"
                    >
                      {status === "authenticated" && session?.user ? (
                        <>
                          <div className="p-4 border-b border-brand-neutral-100 bg-gradient-to-r from-brand-primary-50 to-purple-50">
                            <div className="flex items-center gap-3">
                              <UserAvatar />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-brand-neutral-900 truncate">
                                  {session.user.name || "User"}
                                </p>
                                <p className="text-xs text-brand-neutral-500 truncate">
                                  {session.user.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-2">
                            {[
                              {
                                href: "/account",
                                icon: User,
                                label: "My Account",
                              },
                              {
                                href: "/orders",
                                icon: Package,
                                label: "My Orders",
                              },
                              {
                                href: "/wishlist",
                                icon: Heart,
                                label: "Wishlist",
                              },
                              {
                                href: "/settings",
                                icon: Settings,
                                label: "Settings",
                              },
                            ].map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors duration-150"
                                onClick={() => setProfileDropdownOpen(false)}
                              >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                              </Link>
                            ))}
                          </div>

                          <div className="p-2 border-t border-brand-neutral-100">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-4">
                          <div className="text-center mb-3">
                            <p className="text-sm text-brand-neutral-600">
                              Welcome to britcartbd.com
                            </p>
                          </div>
                          <button
                            onClick={handleSignIn}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm bg-brand-primary-600 text-white hover:bg-brand-primary-700 rounded-lg transition-colors duration-150 font-medium"
                          >
                            <User className="w-4 h-4" />
                            Sign In / Register
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <ActionButton
                icon={ShoppingCart}
                count={cartCount}
                onClick={() => setCartOpen(true)}
                label="Shopping cart"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-brand-neutral-200 bg-gradient-to-r from-brand-primary-50 to-purple-50">
                  <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold text-brand-primary-600">
                      britcartbd.com
                    </span>
                  </Link>
                  <ActionButton
                    icon={X}
                    onClick={() => setMobileMenuOpen(false)}
                    label="Close menu"
                  />
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-3">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    if (item.hasDropdown) {
                      return (
                        <button
                          key={item.name}
                          onClick={() => setMobileCategoriesOpen(true)}
                          className="flex items-center justify-between w-full px-4 py-4 text-lg font-bold text-brand-neutral-800 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-xl transition-all duration-200 border-2 border-brand-primary-200 bg-white shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-brand-primary-500" />
                            <span>{item.name}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-brand-neutral-400" />
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-4 text-lg font-bold text-brand-neutral-800 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-brand-primary-200 bg-white shadow-sm hover:shadow-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-6 h-6 text-brand-primary-500" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-brand-neutral-200 bg-gray-50">
                  {status === "authenticated" && session?.user ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-white rounded-xl border border-brand-primary-200 shadow-sm">
                        <MobileUserAvatar />
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-brand-neutral-900 truncate">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-sm text-brand-neutral-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[
                          { href: "/account", icon: User, label: "My Account" },
                          {
                            href: "/orders",
                            icon: Package,
                            label: "My Orders",
                          },
                          { href: "/wishlist", icon: Heart, label: "Wishlist" },
                        ].map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-base font-medium text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors duration-150 border border-transparent hover:border-brand-primary-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Link>
                        ))}

                        {/* Logout Button */}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 border border-transparent hover:border-red-200"
                        >
                          <LogOut className="w-5 h-5" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="flex items-center gap-3 w-full px-4 py-4 text-base font-bold text-brand-neutral-700 hover:bg-brand-primary-50 rounded-xl transition-all duration-200 border-2 border-brand-neutral-200 hover:border-brand-primary-300 bg-white shadow-sm hover:shadow-md"
                    >
                      <User className="w-6 h-6 text-brand-primary-500" />
                      Sign In / Register
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Categories Submenu */}
      <AnimatePresence>
        {mobileCategoriesOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setMobileCategoriesOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Categories Header */}
                <div className="flex items-center gap-3 p-4 border-b border-brand-neutral-200 bg-gradient-to-r from-brand-primary-50 to-purple-50">
                  <button
                    onClick={() => setMobileCategoriesOpen(false)}
                    className="p-2 rounded-lg text-brand-neutral-700 hover:bg-white hover:text-brand-primary-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-brand-neutral-800">
                    All Categories
                  </h2>
                </div>

                {/* Dynamic Categories List */}
                <div className="flex-1 p-4 space-y-2">
                  {categoriesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-primary-600" />
                    </div>
                  ) : dynamicCategories.length > 0 ? (
                    dynamicCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.slug)}
                        className="flex items-center justify-between w-full px-4 py-4 text-base font-semibold text-brand-neutral-800 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-brand-primary-200 bg-white shadow-sm hover:shadow-md"
                      >
                        <span>{category.name}</span>
                        <span className="px-2 py-1 text-xs bg-brand-primary-100 text-brand-primary-600 rounded-full font-bold">
                          {category._count.products}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-brand-neutral-500">
                      No categories found
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
