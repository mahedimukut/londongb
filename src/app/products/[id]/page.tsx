// app/products/[id]/page.tsx
import { allProducts } from "@/app/allProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default function ProductPage({ params }: PageProps) {
  const productId = parseInt(params.id);
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return notFound();

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-brand-neutral-900">
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                {product.isNew && (
                  <Badge className="bg-brand-secondary-500">New</Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-brand-gold-400">Best Seller</Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-brand-primary-500">Featured</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-2xl font-semibold text-brand-neutral-800">
              £{product.price}
              {product.originalPrice && (
                <span className="line-through text-base text-brand-neutral-400">
                  £{product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-sm text-brand-neutral-600">
              <Star className="w-4 h-4 text-brand-gold-400 fill-brand-gold-400" />
              <span>{product.rating}</span> |{" "}
              <span>{product.reviews} reviews</span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-brand-neutral-700">
                Available Colors:
              </h3>
              <div className="flex gap-2 mt-1">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 border-brand-neutral-300`}
                    style={{ backgroundColor: color }}
                    title={color}
                  ></span>
                ))}
              </div>
            </div>

            <div className="text-sm text-brand-neutral-600">
              <p>
                <strong>Stock:</strong>{" "}
                {product.stock > 0 ? product.stock : "Out of stock"}
              </p>
              {product.ageRange && (
                <p>
                  <strong>Age:</strong> {product.ageRange}
                </p>
              )}
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-brand-neutral-700">{product.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Specifications</h2>
              <ul className="list-disc ml-5 space-y-1 text-brand-neutral-700 text-sm">
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
                  <strong>Pack Includes:</strong>{" "}
                  {product.specifications.packContains}
                </li>
              </ul>
            </div>

            <div>
              <Button
                size="lg"
                className="w-full md:w-auto bg-brand-primary-500 hover:bg-brand-primary-600"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-brand-neutral-900">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <Link
                href={`/products/${related.id}`}
                key={related.id}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={related.image}
                    alt={related.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-brand-neutral-900 line-clamp-2">
                    {related.name}
                  </h3>
                  <div className="text-brand-neutral-700 text-sm">
                    £{related.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
