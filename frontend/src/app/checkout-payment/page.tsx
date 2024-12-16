'use client'
import StripeCheckout from '@/components/CreditCard/CreditCard';
import { useSearchParams } from "next/navigation";

function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div>
      <StripeCheckout code={id} />
    </div>
  )
}

export default Page