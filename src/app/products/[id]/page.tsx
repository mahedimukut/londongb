export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductPageClient from "./ProductDetails";
import type { Metadata } from "next";

export async function generateStaticParams() {
  try {
    // Fetch products from your API during build
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/products?limit=100&public=true`
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.products.map((product: any) => ({
      id: product.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  try {
    // Fetch product from API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/products/${slug}?public=true`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return {
        title: "Product Not Found | Britcartbd.com",
        description: "The product you are looking for is not available.",
      };
    }

    const product = await res.json();

    if (!product) {
      return {
        title: "Product Not Found | Britcartbd.com",
        description: "The product you are looking for is not available.",
      };
    }

    // Create SEO-optimized metadata
    const title = `${product.name} | Britcartbd.com`;
    const description = product.description
      ? `${product.description.substring(0, 160)}...`
      : `Buy ${product.name} from Britcartbd.com - Your trusted online marketplace in Bangladesh. Best prices, fast delivery.`;

    const images =
      product.images && product.images.length > 0
        ? product.images.map((img: any) => img.url)
        : ["/default-product-image.jpg"];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug}`,
        images: images.map((url: any) => ({
          url,
          width: 800,
          height: 600,
          alt: product.name,
        })),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: images[0],
      },
      keywords: [
        product.name,
        product.category?.name,
        product.brand?.name,
        "buy online",
        "Bangladesh",
        "ecommerce",
        ...(product.specifications?.productType
          ? [product.specifications.productType]
          : []),
        ...(product.ageRange ? [`age ${product.ageRange}`] : []),
      ],
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Page | Britcartbd.com",
      description:
        "Browse our wide range of products at Britcartbd.com - Your trusted online marketplace.",
    };
  }
}

export default async function ProductPage({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  // Fetch product from API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/products/${slug}?public=true`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();
  const product = await res.json();
  if (!product) return notFound();

  let relatedProducts = [];

  try {
    // Try to get products from same category first
    const relatedRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/products?category=${product.categoryId}&limit=20&public=true`,
      { cache: "no-store" }
    );

    if (relatedRes.ok) {
      const relatedData = await relatedRes.json();

      if (relatedData.products && relatedData.products.length > 0) {
        // Filter out current product and limit to 15
        relatedProducts = relatedData.products
          .filter((p: any) => p.id !== product.id)
          .slice(0, 15);
      }

      // If no products in same category, try random products
      if (relatedProducts.length === 0) {
        console.log(
          "No products in same category, fetching random products..."
        );
        const randomRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/products?limit=20&public=true`,
          { cache: "no-store" }
        );

        if (randomRes.ok) {
          const randomData = await randomRes.json();
          relatedProducts = randomData.products
            ? randomData.products
                .filter((p: any) => p.id !== product.id)
                .slice(0, 15)
            : [];
        }
      }
    }
  } catch (error) {
    console.error("Error fetching related products:", error);
    relatedProducts = [];
  }

  console.log("Final related products count:", relatedProducts.length);

  return (
    <>
      <Header />
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
      <Footer />
    </>
  );
}
