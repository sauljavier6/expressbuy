'use client';

import { useSearchParams } from 'next/navigation';
import ProductClientPage from './ProductClientPage';

export default function ProductClientPageWrapper() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const productTypeIdFromUrl = searchParams.get("productTypeId");

    const isMounted = typeof window !== "undefined";

    if (!isMounted) return null; // ⛔️ Previene render SSR

  return (
    <ProductClientPage
      categoryIdFromUrl={categoryIdFromUrl}
      productTypeIdFromUrl={productTypeIdFromUrl}
    />
  );
}
