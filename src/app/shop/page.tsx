import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh] space-x-2">
          <div className="w-3 h-3 bg-daffodil-yellow rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-brand-primary-600 rounded-full animate-bounce delay-150" />
          <div className="w-3 h-3 bg-brand-secondary-600 rounded-full animate-bounce delay-300" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
