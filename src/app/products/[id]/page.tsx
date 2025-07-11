import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  Heart,
  Check,
  Info,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { allProducts } from "@/app/allProducts";

// ✅ Define static params for build
export function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

// ✅ Define props type
interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.id);
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return notFound();

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/shop"
          className="flex items-center text-brand-primary-600 hover:text-brand-primary-800 transition-colors mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg h-[550px] flex items-center justify-center p-2">
            <div className="relative w-full h-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              {product.isNew && (
                <span className="bg-brand-primary-600 text-white text-xs px-2.5 py-1 rounded-full">
                  NEW
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full">
                  BESTSELLER
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-brand-primary-600">
                {new Intl.NumberFormat("bn-BD", {
                  style: "currency",
                  currency: "BDT",
                })
                  .format(product.price)
                  .replace("BDT", "৳")}
              </p>
              {product.originalPrice && (
                <p className="text-lg text-gray-500 line-through">
                  {new Intl.NumberFormat("bn-BD", {
                    style: "currency",
                    currency: "BDT",
                  })
                    .format(product.originalPrice)
                    .replace("BDT", "৳")}
                </p>
              )}
            </div>

            <div className="py-3">
              <p className="text-gray-700">
                {product.description ||
                  "Premium quality baby product designed for comfort and safety."}
              </p>
            </div>

            <div className="space-y-2 py-3">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Age: {product.ageRange || "Not specified"}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Colors: {product.colors.join(", ")}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>
                  {product.stock > 0 ? (
                    <span className="text-green-600">
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="text-rose-600">Out of Stock</span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="flex-1 bg-brand-primary-600 hover:bg-brand-primary-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button className="flex-1 border-2 border-brand-primary-600 text-brand-primary-600 hover:bg-brand-primary-50 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Heart className="h-5 w-5" />
                Wishlist
              </button>
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-brand-primary-600" />
                <h3 className="font-medium text-lg">Product Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Brand</p>
                  <p>{product.specifications.brand}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Origin</p>
                  <p>{product.specifications.countryOfOrigin}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Materials</p>
                  <p>{product.specifications.materials}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Includes</p>
                  <p>{product.specifications.packContains}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You can keep review and related product sections here */}
      </div>
      <Footer />
    </>
  );
}
