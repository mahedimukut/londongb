import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse text-center p-10 text-gray-500">
          Loading shop...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
