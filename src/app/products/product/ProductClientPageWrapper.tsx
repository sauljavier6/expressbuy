'use client';

import { useSearchParams } from 'next/navigation';
import ProductClientPage from './ProductClientPage';

export default function ProductClientPageWrapper() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const productTypeIdFromUrl = searchParams.get("productTypeId");

  return (
    <ProductClientPage
      categoryIdFromUrl={categoryIdFromUrl}
      productTypeIdFromUrl={productTypeIdFromUrl}
    />
  );
}
