import { allProducts } from "@/app/allProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductDetails";

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return notFound();

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 10);

  return (
    <>
      <Header />
      <ProductPageClient product={product} relatedProducts={related} />
      <Footer />
    </>
  );
}
