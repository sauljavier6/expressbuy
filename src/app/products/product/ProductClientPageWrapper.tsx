'use client';

import { useSearchParams } from 'next/navigation';
import ProductClientPage from './ProductClientPage';

export default function ProductClientPageWrapper() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const productTypeIdFromUrl = searchParams.get("productTypeId");

    // Esperar a que estén disponibles (hidratarse correctamente)
    const isMounted = typeof window !== "undefined";

    if (!isMounted) return null; // ⛔️ Previene render SSR

  console.log('categoryIdFromUrl',categoryIdFromUrl)
  console.log('productTypeIdFromUrl',productTypeIdFromUrl)

  return (
    <ProductClientPage
      categoryIdFromUrl={categoryIdFromUrl}
      productTypeIdFromUrl={productTypeIdFromUrl}
    />
  );
}
