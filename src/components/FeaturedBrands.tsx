"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  isFeatured: boolean;
  _count: {
    products: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AllBrands() {
  const {
    data: brands,
    error,
    isLoading,
    mutate,
  } = useSWR<Brand[]>("/api/dashboard/brands?limit=10&featured=true", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true, // Refresh when tab becomes focused
    revalidateOnReconnect: true, // Refresh when reconnecting to internet
  });

  // Get only featured brands
  const featuredBrands = brands?.filter((brand) => brand.isFeatured) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">
            Featured Brands
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-4 animate-pulse"
              >
                <div className="h-20 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Featured Brands</h1>
          <div className="text-red-600 mb-4">Error: Failed to load brands</div>
          <button
            onClick={() => mutate()}
            className="px-6 py-3 bg-brand-primary-500 text-white rounded-lg hover:bg-brand-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Featured Brands
        </h1>

        {featuredBrands.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/shop?brand=${brand.slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4 text-center group"
                >
                  <div className="relative h-20 w-full mb-3">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                        <span className="text-sm text-gray-500 font-medium">
                          {brand.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-brand-neutral-800 mb-1">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {brand._count.products} products
                  </p>
                </Link>
              ))}
            </div>
            {/* View All Brands Button */}
            {brands && brands.length > featuredBrands.length && (
              <div className="text-center mt-12">
                <Link
                  href="/brands"
                  className="inline-flex items-center px-8 py-3 bg-brand-primary-500 text-white font-medium rounded-full hover:bg-brand-primary-600 transition-colors shadow-md hover:shadow-lg"
                >
                  View All Brands
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-6">
              No featured brands found.
            </p>
            {/* Show all brands button even if no featured brands exist */}
            {brands && brands.length > 0 && (
              <Link
                href="/brands"
                className="inline-flex items-center px-8 py-3 bg-brand-primary-500 text-white font-medium rounded-full hover:bg-brand-primary-600 transition-colors shadow-md hover:shadow-lg"
              >
                View All Brands
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
