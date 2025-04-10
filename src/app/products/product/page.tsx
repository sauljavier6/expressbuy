// app/products/product/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ProductClientPage from "./ProductClientPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ProductClientPage />
    </Suspense>
  );
}
