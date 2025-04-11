'use client';

import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import ProductClientPage from './ProductClientPage';

export default function Page() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const productTypeIdFromUrl = searchParams.get("productTypeId");

  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ProductClientPage
        categoryIdFromUrl={categoryIdFromUrl}
        productTypeIdFromUrl={productTypeIdFromUrl}
      />
    </Suspense>
  );
}