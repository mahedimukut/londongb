"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import {
  Star,
  ShoppingCart,
  ChevronDown,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Check,
  X,
  Sliders,
  Loader2,
  Heart,
  Eye,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "../context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  ageRange: string | null;
  categoryId: string;
  brandId: string | null;
  category: {
    name: string;
    slug: string;
  };
  brand: {
    name: string;
    logo: string | null;
  } | null;
  images: {
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }[];
  colors: {
    id: string;
    name: string;
    hexCode: string | null;
  }[];
  specifications: {
    id: string;
    brand: string | null;
    countryOfOrigin: string | null;
    productType: string | null;
    materials: string | null;
    packContains: string | null;
    weight: string | null;
    dimensions: string | null;
    careInstructions: string | null;
    safetyFeatures: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

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

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  rating: number;
  isFeatured: boolean;
  _count: {
    products: number;
  };
};

type ProductsResponse = {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

const priceRanges = [
  { id: "0-1000", name: "Under ৳1000", min: 0, max: 1000 },
  { id: "1000-2000", name: "৳1000 - ৳2000", min: 1000, max: 2000 },
  { id: "2000-5000", name: "৳2000 - ৳5000", min: 2000, max: 5000 },
  { id: "5000-10000", name: "৳5000 - ৳10000", min: 5000, max: 10000 },
  { id: "10000+", name: "Over ৳10000", min: 10000, max: 100000 },
];

// Sorting options
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "featured", label: "Featured" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "rating", label: "Highest Rated" },
];

// SWR Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Skeleton Components
const ProductCardSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => {
  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 border border-brand-neutral-200 rounded-lg animate-pulse">
        <div className="w-full sm:w-48 h-48 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-neutral-200 rounded-lg overflow-hidden animate-pulse flex flex-col h-full">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const CategorySkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>
      ))}
    </div>
  </div>
);

const FilterSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductCard = ({
  product,
  viewMode,
}: {
  product: Product;
  viewMode: "grid" | "list";
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, state } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT" })
      .format(price)
      .replace("BDT", "৳");

  const isInWishlist = state.wishlist.some(
    (item) => item.productId === product.id
  );

  const handleAddToCart = async () => {
    if (product.stock === 0) return;

    setIsAddingToCart(true);

    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url || "/placeholder-product.jpg",
        slug: product.slug,
        stock: product.stock,
        maxQuantity: Math.min(product.stock, 10),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1500);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        const wishlistItem = state.wishlist.find(
          (item) => item.productId === product.id
        );
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id);
        }
      } else {
        await addToWishlist({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0]?.url || "/placeholder-product.jpg",
          slug: product.slug,
          rating: product.rating,
          reviewCount: product.reviewCount,
          stock: product.stock,
          isInStock: product.stock > 0,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="flex flex-col sm:flex-row gap-4 p-4 border border-brand-neutral-200 rounded-lg hover:shadow-md transition-all"
      >
        <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden group">
          <Image
            src={primaryImage?.url || "/placeholder-product.jpg"}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-brand-primary-600 text-white text-xs px-2 py-1 rounded">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="absolute top-2 left-2 bg-brand-gold-500 text-white text-xs px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
              OUT OF STOCK
            </span>
          )}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center gap-1 bg-white text-brand-primary-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-brand-primary-50 transition-colors shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-4 w-4" />
              Quick View
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href={`/products/${product.slug}`}
                className="font-medium text-lg hover:text-brand-primary-600"
              >
                {product.name}
              </Link>
              <div className="flex items-center mt-1">
                {product.brand && (
                  <span className="text-sm text-gray-500 mr-2">
                    {product.brand.name}
                  </span>
                )}
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-brand-gold-400 fill-brand-gold-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleWishlistToggle}
              className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  isInWishlist ? "fill-pink-500 text-pink-500" : ""
                }`}
              />
            </button>
          </div>

          <div className="mt-2">
            <span className="text-xl font-bold text-brand-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-600 text-sm">
            Available in {product.colors.length} colors • {product.stock} in
            stock {product.ageRange && `• Age: ${product.ageRange}`}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-md flex items-center justify-center gap-2 ${
              product.stock === 0
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-brand-primary-600 hover:bg-brand-primary-700 text-white"
            }`}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white border border-brand-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all flex flex-col h-full"
    >
      <div className="relative aspect-square">
        <Image
          src={primaryImage?.url || "/placeholder-product.jpg"}
          alt={primaryImage?.alt || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-0 left-0 p-2 space-y-1">
          {product.isNew && (
            <span className="bg-brand-primary-600 text-white text-xs px-2 py-1 rounded block">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-gold-500 text-white text-xs px-2 py-1 rounded block">
              BESTSELLER
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded block">
              OUT OF STOCK
            </span>
          )}
        </div>
        <button
          onClick={handleWishlistToggle}
          className="absolute z-10 top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white shadow-sm transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isInWishlist ? "fill-pink-500 text-pink-500" : "text-gray-400"
            }`}
          />
        </button>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-1 bg-white text-brand-primary-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-brand-primary-50 transition-colors shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
            Quick View
          </Link>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <Link
            href={`/products/${product.slug}`}
            className="font-medium hover:text-brand-primary-600 line-clamp-2"
          >
            {product.name}
          </Link>
          {product.brand && (
            <p className="text-xs text-gray-500 mt-1">{product.brand.name}</p>
          )}
          {product.ageRange && (
            <p className="text-xs text-gray-500">Age: {product.ageRange}</p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-brand-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="ml-1 text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
            </div>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-brand-gold-400 fill-brand-gold-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock === 0}
          className={`mt-3 w-full py-2 rounded-md flex items-center justify-center gap-2 text-sm ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-brand-primary-50 hover:bg-brand-primary-100 text-brand-primary-600"
          }`}
        >
          {isAddingToCart ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : product.stock === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    price: [],
  });

  const productsPerPage = viewMode === "grid" ? 12 : 6;
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get URL parameters
  const categoryParam = searchParams.get("category") || "all";
  const brandParam = searchParams.get("brand") || "all";
  const sortParam = searchParams.get("sort") || "newest";
  const searchQuery = searchParams.get("search");

  // SWR hooks for data fetching
  const { data: categoriesData, isLoading: categoriesLoading } = useSWR<
    Category[]
  >("/api/dashboard/categories", fetcher, {
    revalidateOnFocus: false,
  });

  const { data: brandsData, isLoading: brandsLoading } = useSWR<Brand[]>(
    "/api/dashboard/brands",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // Build products query params
  const productsParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: productsPerPage.toString(),
    sort: selectedSort, // Add sorting parameter
  });

  if (selectedCategory && selectedCategory !== "all") {
    productsParams.append("category", selectedCategory);
  }

  if (selectedBrand && selectedBrand !== "all") {
    productsParams.append("brand", selectedBrand);
  }

  if (searchQuery) {
    productsParams.append("search", searchQuery);
  }

  if (selectedFilters.price.length > 0) {
    const priceRange = priceRanges.find(
      (range) => range.id === selectedFilters.price[0]
    );
    if (priceRange) {
      productsParams.append("minPrice", priceRange.min.toString());
      productsParams.append("maxPrice", priceRange.max.toString());
    }
  }

  const { data: productsData, isLoading: productsLoading } =
    useSWR<ProductsResponse>(
      `/api/dashboard/products?${productsParams.toString()}`,
      fetcher,
      {
        keepPreviousData: true,
        revalidateOnFocus: false,
      }
    );

  // Set initial filters from URL params
  useEffect(() => {
    if (categoryParam !== "all") {
      setSelectedCategory(categoryParam);
    }
    if (brandParam !== "all") {
      setSelectedBrand(brandParam);
    }
    if (sortParam !== "newest") {
      setSelectedSort(sortParam);
    }
  }, [categoryParam, brandParam, sortParam]);

  const products = productsData?.products || [];
  const totalProducts = productsData?.pagination.total || 0;
  const categories = categoriesData || [];
  const brands = brandsData || [];

  // Enhanced categories with both ID and slug
  const enhancedCategories = [
    {
      id: "all",
      name: "All Products",
      count: totalProducts,
      slug: "all",
    },
    ...categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      count: cat._count.products,
    })),
  ];

  // Enhanced brands with slugs
  const enhancedBrands = [
    {
      id: "all",
      slug: "all",
      name: "All Brands",
      count: totalProducts,
    },
    ...brands.map((brand) => ({
      id: brand.id,
      slug: brand.slug,
      name: brand.name,
      count: brand._count.products,
      logo: brand.logo,
    })),
  ];

  // Safe URL update without infinite loop
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (selectedBrand !== "all") {
      params.set("brand", selectedBrand);
    }
    if (selectedSort !== "newest") {
      params.set("sort", selectedSort);
    }

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    const newUrl = `?${params.toString()}`;
    const currentUrl = window.location.search;

    if (newUrl !== currentUrl) {
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${newUrl}`
      );
    }
  }, [selectedCategory, selectedBrand, selectedSort, searchQuery]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const toggleFilter = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (filterType === "price") {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = [];
        } else {
          newFilters[filterType] = [value];
        }
      }
      return newFilters;
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedFilters({ price: [] });
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedSort("newest");
    setCurrentPage(1);
    router.push("/shop");
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const activeFilterCount =
    Object.values(selectedFilters).reduce(
      (total, filters) => total + filters.length,
      0
    ) +
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedBrand !== "all" ? 1 : 0) +
    (selectedSort !== "newest" ? 1 : 0);

  const isLoading = categoriesLoading || brandsLoading || productsLoading;

  return (
    <>
      <Header />

      <div className="bg-brand-neutral-50 min-h-screen">
        <div className="relative bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Shop Page"}
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              {searchQuery
                ? `Found ${totalProducts} products matching your search`
                : "Discover everything you need in one place"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-80 flex-shrink-0">
              {isLoading ? (
                <CategorySkeleton />
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <h2 className="font-bold text-lg mb-4">Shop by Category</h2>
                  <ul className="space-y-2">
                    {enhancedCategories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => {
                            setSelectedCategory(category.slug);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                            selectedCategory === category.slug
                              ? "bg-brand-primary-50 text-brand-primary-600 font-medium"
                              : "hover:bg-brand-neutral-100"
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="text-sm text-brand-neutral-500">
                            {category.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isLoading ? (
                <CategorySkeleton />
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <h2 className="font-bold text-lg mb-4">Shop by Brand</h2>
                  <ul className="space-y-2">
                    {enhancedBrands.map((brand) => (
                      <li key={brand.id}>
                        <button
                          onClick={() => {
                            setSelectedBrand(brand.slug);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                            selectedBrand === brand.slug
                              ? "bg-brand-primary-50 text-brand-primary-600 font-medium"
                              : "hover:bg-brand-neutral-100"
                          }`}
                        >
                          <span>{brand.name}</span>
                          <span className="text-sm text-brand-neutral-500">
                            {brand.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isLoading ? (
                <FilterSkeleton />
              ) : (
                <div className="hidden md:block bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Filters</h2>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-brand-primary-600 hover:underline"
                      >
                        Clear all ({activeFilterCount})
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <ul className="space-y-2">
                      {priceRanges.map((option) => (
                        <li key={option.id}>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="price"
                              checked={selectedFilters.price.includes(
                                option.id
                              )}
                              onChange={() => toggleFilter("price", option.id)}
                              className="rounded text-brand-primary-600 focus:ring-brand-primary-500"
                            />
                            <span>{option.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-brand-neutral-600">
                  {isLoading ? (
                    <span className="inline-block h-4 bg-gray-200 rounded w-48 animate-pulse"></span>
                  ) : (
                    `Showing ${products.length} of ${totalProducts} products`
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sorting Dropdown */}
                  <select
                    value={selectedSort}
                    onChange={(e) => {
                      setSelectedSort(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-brand-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-1 px-3 py-2 border border-brand-neutral-200 rounded-lg"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="bg-brand-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center border border-brand-neutral-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-brand-primary-50 text-brand-primary-600"
                          : "bg-white"
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-brand-primary-50 text-brand-primary-600"
                          : "bg-white"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== "all" && (
                      <span className="bg-brand-primary-50 text-brand-primary-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        Category:{" "}
                        {
                          enhancedCategories.find(
                            (c) => c.slug === selectedCategory
                          )?.name
                        }
                        <button onClick={() => setSelectedCategory("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedBrand !== "all" && (
                      <span className="bg-brand-primary-50 text-brand-primary-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        Brand:{" "}
                        {
                          enhancedBrands.find((b) => b.slug === selectedBrand)
                            ?.name
                        }
                        <button onClick={() => setSelectedBrand("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedSort !== "newest" && (
                      <span className="bg-brand-primary-50 text-brand-primary-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        Sort:{" "}
                        {
                          sortOptions.find((s) => s.value === selectedSort)
                            ?.label
                        }
                        <button onClick={() => setSelectedSort("newest")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="bg-brand-primary-50 text-brand-primary-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        Search: {searchQuery}
                        <button onClick={() => router.push("/shop")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedFilters.price.map((value) => (
                      <span
                        key={`price-${value}`}
                        className="bg-brand-primary-50 text-brand-primary-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        Price: {priceRanges.find((p) => p.id === value)?.name}
                        <button onClick={() => toggleFilter("price", value)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isLoading ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {[...Array(productsPerPage)].map((_, i) => (
                    <ProductCardSkeleton key={i} viewMode={viewMode} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-brand-neutral-600 mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-brand-primary-600 text-white rounded-md hover:bg-brand-primary-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {totalPages > 1 && !isLoading && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full border border-brand-neutral-200 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-full ${
                              currentPage === pageNum
                                ? "bg-brand-primary-600 text-white"
                                : "hover:bg-brand-primary-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-10 rounded-full hover:bg-brand-primary-50"
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full border border-brand-neutral-200 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsFilterOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 right-0 w-full max-w-sm h-full bg-white z-50 shadow-xl overflow-y-auto"
            >
              <div className="p-4 border-b border-brand-neutral-200 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 rounded-full hover:bg-brand-neutral-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-brand-primary-600 hover:underline"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-sm text-brand-primary-600 hover:underline"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {enhancedCategories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Brands</h3>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {enhancedBrands.map((brand) => (
                      <option key={brand.slug} value={brand.slug}>
                        {brand.name} ({brand.count})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Sort By</h3>
                  <select
                    value={selectedSort}
                    onChange={(e) => {
                      setSelectedSort(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <ul className="space-y-2">
                    {priceRanges.map((option) => (
                      <li key={option.id}>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            checked={selectedFilters.price.includes(option.id)}
                            onChange={() => toggleFilter("price", option.id)}
                            className="rounded text-brand-primary-600 focus:ring-brand-primary-500"
                          />
                          <span>{option.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-brand-primary-600 text-white p-3 rounded-full shadow-lg z-30 hover:bg-brand-primary-700 transition-colors"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <Footer />
    </>
  );
}
