// app/checkout/page.tsx
import dynamic from "next/dynamic";

const ClientCheckout = dynamic(() => import('@/components/checkout/clientcheckout/ClientCheckout'), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ClientCheckout />
    </div>
  );
}
