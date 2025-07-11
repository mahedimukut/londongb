import { allProducts } from "@/app/allProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// ✅ REMOVE manual PageProps type and make function `async`
export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = parseInt(params.id);
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return notFound();

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* your redesigned layout from earlier */}
        {/* or I can reinsert the full design again if needed */}
      </main>
      <Footer />
    </>
  );
}
