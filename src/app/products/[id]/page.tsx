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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params promise
  const { id } = await params;
  const productId = parseInt(id);
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return notFound();

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Rest of your component remains the same...
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Your existing JSX */}
      </main>
      <Footer />
    </>
  );
}
