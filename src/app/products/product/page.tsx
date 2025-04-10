// app/products/product/page.tsx
import { Suspense } from "react";
import ProductClientPage from "./ProductClientPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ProductClientPage />
    </Suspense>
  );
}
