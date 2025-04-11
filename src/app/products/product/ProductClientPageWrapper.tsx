'use client';

import { useSearchParams } from 'next/navigation';
import ProductClientPage from './ProductClientPage';

export default function ProductClientPageWrapper() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const productTypeIdFromUrl = searchParams.get("productTypeId");

  console.log('categoryIdFromUrl',categoryIdFromUrl)
  console.log('productTypeIdFromUrl',productTypeIdFromUrl)

  return (
    <ProductClientPage
      categoryIdFromUrl={categoryIdFromUrl}
      productTypeIdFromUrl={productTypeIdFromUrl}
    />
  );
}
