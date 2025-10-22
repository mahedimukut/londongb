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
import { AiOutlineMenu } from "react-icons/ai";
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
  const [showMobileSearchResults, setShowMobileSearchResults] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(true);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

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
      setShowMobileSearchResults(false);
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
          image: product.images[0]?.url || "/images/placeholder-image.png",
          brand: product.brand,
        }));
        setSearchResults(products);
        setShowMobileSearchResults(true);
      } else {
        setSearchResults([]);
        setShowMobileSearchResults(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowMobileSearchResults(false);
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
      setShowMobileSearchResults(false);
    }
  };

  // Handle category click - navigate to shop page with category filter
  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/shop?category=${categorySlug}`);
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

      // Close mobile search results when clicking outside
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowMobileSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect with proper mobile search hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Main scroll effect for header shadow
      setScrolled(currentScrollY > 20);

      // Mobile search bar behavior - only on mobile
      if (window.innerWidth < 1024) {
        const scrollDelta = currentScrollY - lastScrollY.current;

        if (scrollDelta > 5 && currentScrollY > 100) {
          // Scrolling down fast and past 100px - hide search
          setMobileSearchVisible(false);
        } else if (scrollDelta < -5) {
          // Scrolling up fast - show search
          setMobileSearchVisible(true);
        } else if (currentScrollY <= 30) {
          // Near top - always show search
          setMobileSearchVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
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
        setShowMobileSearchResults(false);
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

  // Fixed User Avatar Component with proper Facebook image handling
  const UserAvatar = () => {
    const [imageError, setImageError] = useState(false);

    if (status === "loading") {
      return (
        <div className="w-10 h-10 bg-brand-neutral-100 rounded-full flex items-center justify-center border-2 border-brand-neutral-200">
          <Loader2 className="w-5 h-5 text-brand-neutral-400 animate-spin" />
        </div>
      );
    }

    if (status === "authenticated" && session?.user?.image && !imageError) {
      return (
        <div className="relative">
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={40}
            height={40}
            className="rounded-full border-2 border-brand-primary-200 object-cover w-10 h-10"
            onError={() => setImageError(true)}
            priority={false}
            sizes="40px"
          />
        </div>
      );
    }

    // Fallback when no image, image error, or Facebook image failed
    return (
      <div className="w-10 h-10 bg-brand-primary-100 rounded-full flex items-center justify-center border-2 border-brand-primary-200">
        <User className="w-5 h-5 text-brand-primary-600" />
      </div>
    );
  };

  // Mobile User Avatar Component for Menu Drawer
  const MobileUserAvatar = () => {
    const [imageError, setImageError] = useState(false);

    if (status === "loading") {
      return (
        <div className="w-12 h-12 bg-brand-neutral-100 rounded-full flex items-center justify-center border-2 border-brand-neutral-200">
          <Loader2 className="w-6 h-6 text-brand-neutral-400 animate-spin" />
        </div>
      );
    }

    if (status === "authenticated" && session?.user?.image && !imageError) {
      return (
        <div className="relative">
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={48}
            height={48}
            className="rounded-full border-2 border-brand-primary-200 object-cover w-12 h-12"
            onError={() => setImageError(true)}
            priority={false}
            sizes="48px"
          />
        </div>
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
    size = "default",
  }: {
    icon: React.ElementType;
    count?: number;
    onClick: () => void;
    label: string;
    className?: string;
    loading?: boolean;
    size?: "default" | "large" | "xlarge";
  }) => {
    const getButtonSize = () => {
      switch (size) {
        case "xlarge":
          return "min-h-[52px] min-w-[52px] p-3";
        case "large":
          return "min-h-[48px] min-w-[48px] p-3";
        default:
          return "min-h-[44px] min-w-[44px] p-2.5";
      }
    };

    const getIconSize = () => {
      switch (size) {
        case "xlarge":
          return "w-6 h-6";
        case "large":
          return "w-5 h-5";
        default:
          return "w-4 h-4";
      }
    };

    const buttonSize = getButtonSize();
    const iconSize = getIconSize();

    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`
          relative rounded-xl text-brand-neutral-700 hover:text-brand-primary-600 
          hover:bg-brand-primary-50 transition-all duration-200 focus:outline-none 
          focus:ring-2 focus:ring-brand-primary-300 disabled:opacity-50 
          disabled:cursor-not-allowed flex items-center justify-center touch-manipulation
          ${buttonSize} ${className}
        `}
        aria-label={label}
      >
        {loading ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : (
          <Icon className={iconSize} />
        )}
        {count !== undefined && count > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform scale-100 hover:scale-110 transition-transform min-w-[20px] border border-white text-[10px]">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <Announcement />

      <header
        className={`
          sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 
          safe-area-top
          ${
            scrolled
              ? "shadow-lg border-b border-brand-neutral-100"
              : "shadow-sm"
          }
        `}
      >
        {/* Mobile Search Bar - Hidden on scroll */}
        <AnimatePresence>
          {mobileSearchVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-b border-brand-neutral-200 bg-white overflow-hidden"
            >
              <div className="px-3 py-2">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <div className="flex-1 relative" ref={mobileSearchRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, brands, categories..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-brand-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300 focus:border-brand-primary-300 placeholder-brand-neutral-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setShowMobileSearchResults(false);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-neutral-400 hover:text-brand-neutral-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Mobile Search Results - Dropdown */}
                <AnimatePresence>
                  {showMobileSearchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute left-0 right-0 mt-1 bg-white border border-brand-neutral-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                    >
                      {searchLoading ? (
                        <div className="p-4 text-center">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto text-brand-primary-600" />
                          <p className="text-sm text-brand-neutral-500 mt-1">
                            Searching...
                          </p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="p-2">
                          {searchResults.map((result) => (
                            <Link
                              key={result.id}
                              href={`/products/${result.slug}`}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-md transition-colors group border-b border-brand-neutral-100 last:border-b-0"
                              onClick={() => {
                                setSearchQuery("");
                                setShowMobileSearchResults(false);
                              }}
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={result.image}
                                  alt={result.name}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/images/placeholder-image.png";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-xs">
                                  {result.name}
                                </p>
                                {result.brand && (
                                  <p className="text-xs text-brand-neutral-500 truncate">
                                    {result.brand.name}
                                  </p>
                                )}
                                <p className="text-xs text-brand-primary-600 font-semibold">
                                  {formatPrice(result.price)}
                                </p>
                              </div>
                            </Link>
                          ))}
                          <div className="p-2 border-t border-brand-neutral-200">
                            <button
                              type="submit"
                              onClick={handleSearchSubmit}
                              className="w-full py-2 bg-brand-primary-600 text-white rounded-md hover:bg-brand-primary-700 transition-colors font-medium text-xs"
                            >
                              View All Results
                            </button>
                          </div>
                        </div>
                      ) : searchQuery && !searchLoading ? (
                        <div className="p-4 text-center">
                          <Search className="h-6 w-6 text-brand-neutral-300 mx-auto mb-2" />
                          <p className="text-xs text-brand-neutral-500">
                            No products found
                          </p>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Header Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-4">
          <div
            className={`flex items-center justify-between ${
              showMobileSearchResults && mobileSearchVisible ? "py-2" : "py-3"
            }`}
          >
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <ActionButton
                icon={AiOutlineMenu}
                onClick={() => setMobileMenuOpen(true)}
                label="Open menu"
                size="xlarge"
              />
            </div>

            {/* Logo - Larger on mobile */}
            <div className="flex items-center flex-1 lg:flex-none justify-center lg:justify-start">
              <Link
                href="/"
                className="flex items-center group"
                aria-label="BritCartBD - Home"
              >
                <motion.span
                  className="text-2xl sm:text-3xl font-bold text-brand-primary-600 font-display lg:text-3xl"
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
                        className="flex items-center gap-1 px-4 py-2 text-lg font-semibold text-brand-neutral-700 hover:text-brand-primary-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-300 min-h-[44px]"
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
                        className="flex items-center gap-1 px-4 py-2 text-base font-semibold text-brand-neutral-700 hover:text-brand-primary-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-300 min-h-[44px]"
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
                                  className="flex items-center justify-between w-full px-3 py-3 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors duration-150 group min-h-[44px]"
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
            <div className="flex items-center gap-2">
              {/* Desktop Search */}
              <div className="hidden lg:block relative" ref={searchRef}>
                <ActionButton
                  icon={Search}
                  onClick={() => setSearchOpen(!searchOpen)}
                  label="Search products"
                  className={
                    searchOpen
                      ? "bg-brand-primary-50 text-brand-primary-600"
                      : ""
                  }
                  size="large"
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
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-neutral-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products, brands, categories..."
                            className="w-full pl-12 pr-12 py-4 text-base focus:outline-none placeholder-brand-neutral-400 bg-transparent"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setSearchOpen(false)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-neutral-400 hover:text-brand-neutral-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Close search"
                          >
                            <X className="h-5 w-5" />
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
                                    className="flex items-center gap-3 px-3 py-3 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors group border-b border-brand-neutral-100 last:border-b-0 min-h-[60px]"
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
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "/images/placeholder-image.png";
                                        }}
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
                                    className="w-full py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors font-medium"
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

              {/* Desktop Wishlist */}
              <div className="hidden lg:flex">
                <Link href="/wishlist">
                  <ActionButton
                    icon={Heart}
                    count={wishlistCount}
                    onClick={() => {}}
                    label="Wishlist"
                    size="large"
                  />
                </Link>
              </div>

              {/* Desktop Profile with User Image */}
              <div className="hidden lg:block relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  disabled={status === "loading"}
                  className="relative rounded-xl text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] min-w-[48px] flex items-center justify-center p-3"
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
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-brand-neutral-200 z-50 overflow-hidden"
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
                                className="flex items-center gap-3 px-3 py-3 text-sm text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors duration-150 min-h-[44px]"
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
                              className="flex items-center gap-3 w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 min-h-[44px]"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-4">
                          <div className="text-left mb-3">
                            <p className="text-sm text-brand-neutral-600">
                              Welcome to britcartbd.com
                            </p>
                          </div>
                          <button
                            onClick={handleSignIn}
                            className="flex items-center gap-3 w-full px-3 py-3 text-sm bg-brand-primary-600 text-white hover:bg-brand-primary-700 rounded-lg transition-colors duration-150 font-medium min-h-[44px]"
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

              {/* Mobile Wishlist */}
              <div className="flex lg:hidden">
                <Link href="/wishlist">
                  <ActionButton
                    icon={Heart}
                    count={wishlistCount}
                    onClick={() => {}}
                    label="Wishlist"
                    size="xlarge"
                  />
                </Link>
              </div>

              {/* Cart - Both desktop and mobile */}
              <ActionButton
                icon={ShoppingCart}
                count={cartCount}
                onClick={() => setCartOpen(true)}
                label="Shopping cart"
                size="xlarge"
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
              className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden overflow-y-auto safe-area-inset custom-scrollbar"
            >
              <div className="flex flex-col h-full">
                {/* Header - Logo on left, close button on right */}
                <div className="flex items-center justify-between p-4 border-b border-brand-neutral-200 bg-gradient-to-r from-brand-primary-50 to-purple-50 safe-area-top min-h-[60px]">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl font-bold text-brand-primary-600 font-display">
                      britcartbd.com
                    </span>
                  </Link>
                  <ActionButton
                    icon={X}
                    onClick={() => setMobileMenuOpen(false)}
                    label="Close menu"
                    size="xlarge"
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
                          className="flex items-center justify-between w-full px-4 py-4 text-base font-bold text-brand-neutral-800 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-xl transition-all duration-200 border-2 border-brand-primary-200 bg-white shadow-sm hover:shadow-md min-h-[60px]"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-brand-primary-500" />
                            <span className="text-lg">{item.name}</span>
                          </div>
                          <ChevronRight className="w-6 h-6 text-brand-neutral-400" />
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-4 text-base font-bold text-brand-neutral-800 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-brand-primary-200 bg-white shadow-sm hover:shadow-md min-h-[60px]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-6 h-6 text-brand-primary-500" />
                        <span className="text-lg">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-brand-neutral-200 bg-gray-50 safe-area-bottom">
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
                            className="flex items-center gap-3 px-4 py-3 text-base font-medium text-brand-neutral-700 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-lg transition-colors duration-150 border border-transparent hover:border-brand-primary-200 min-h-[44px]"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Link>
                        ))}

                        {/* Logout Button */}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 border border-transparent hover:border-red-200 min-h-[44px]"
                        >
                          <LogOut className="w-5 h-5" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="flex items-center gap-3 w-full px-4 py-4 text-base font-bold text-brand-neutral-700 hover:bg-brand-primary-50 rounded-xl transition-all duration-200 border-2 border-brand-neutral-200 hover:border-brand-primary-300 bg-white shadow-sm hover:shadow-md min-h-[60px]"
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
              className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden overflow-y-auto safe-area-inset custom-scrollbar"
            >
              <div className="flex flex-col h-full">
                {/* Categories Header */}
                <div className="flex items-center gap-3 p-4 border-b border-brand-neutral-200 bg-gradient-to-r from-brand-primary-50 to-purple-50 safe-area-top">
                  <button
                    onClick={() => setMobileCategoriesOpen(false)}
                    className="p-2 rounded-lg text-brand-neutral-700 hover:bg-white hover:text-brand-primary-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-bold text-brand-neutral-800">
                    Categories
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
                        className="flex items-center justify-between w-full px-4 py-4 text-base font-semibold text-brand-neutral-800 hover:bg-brand-primary-50 hover:text-brand-primary-600 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-brand-primary-200 bg-white shadow-sm hover:shadow-md min-h-[60px]"
                      >
                        <span className="text-lg">{category.name}</span>
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

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f472b6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899;
        }
      `}</style>
    </>
  );
};

export default Header;
