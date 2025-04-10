import { Suspense } from "react";
import ProductClientPageWrapper from "./ProductClientPageWrapper";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ProductClientPageWrapper />
    </Suspense>
  );
}
