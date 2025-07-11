// app/products/[id]/page.tsx

import { allProducts } from "@/app/allProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

// ✅ Main Page — must be async & use inline `params`
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = parseInt(params.id);
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return notFound();

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-primary-700">
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.isNew && (
                  <Badge className="bg-brand-secondary-500 text-white">
                    New
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-brand-gold-400 text-white">
                    Best Seller
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-brand-sky-400 text-white">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 text-2xl font-semibold text-brand-neutral-700">
              £{product.price}
              {product.originalPrice && (
                <span className="line-through text-base text-brand-neutral-400">
                  £{product.originalPrice}
                </span>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center text-sm text-brand-neutral-500">
              <Star className="w-4 h-4 text-brand-gold-400 fill-brand-gold-400 mr-1" />
              <span>{product.rating}</span> | {product.reviews} reviews
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium text-brand-neutral-600">
                Available Colors:
              </h3>
              <div className="flex gap-2 mt-1">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className="w-6 h-6 rounded-full border border-brand-neutral-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>

            {/* Stock / Age */}
            <div className="text-sm text-brand-neutral-600">
              <p>
                <strong>Stock:</strong>{" "}
                {product.stock > 0 ? product.stock : "Out of stock"}
              </p>
              {product.ageRange && (
                <p>
                  <strong>Age Range:</strong> {product.ageRange}
                </p>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-1 text-brand-neutral-800">
                Description
              </h2>
              <p className="text-brand-neutral-700">{product.description}</p>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-lg font-semibold mb-1 text-brand-neutral-800">
                Specifications
              </h2>
              <ul className="text-sm text-brand-neutral-700 list-disc ml-6 space-y-1">
                <li>
                  <strong>Brand:</strong> {product.specifications.brand}
                </li>
                <li>
                  <strong>Type:</strong> {product.specifications.productType}
                </li>
                <li>
                  <strong>Origin:</strong>{" "}
                  {product.specifications.countryOfOrigin}
                </li>
                <li>
                  <strong>Materials:</strong> {product.specifications.materials}
                </li>
                <li>
                  <strong>Pack:</strong> {product.specifications.packContains}
                </li>
              </ul>
            </div>

            {/* Add to Cart */}
            <div>
              <Button
                size="lg"
                className="bg-brand-primary-600 hover:bg-brand-primary-700 w-full md:w-auto"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group"
                >
                  <div className="aspect-square relative overflow-hidden rounded-xl shadow-md">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="mt-2 text-sm">
                    <h3 className="font-semibold text-brand-neutral-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-brand-neutral-600">£{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
