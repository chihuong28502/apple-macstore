'use client'
import { useAppSelector } from '@/core/services/hook';
import { AuthSelectors } from '@/modules/auth/slice';
import { CartSelectors } from '@/modules/cart/slice';
import { CustomerSelectors } from '@/modules/customer/slice';
import { useSelector } from 'react-redux';
import CardProductCheckout from './components/CardProductCheckout';
import PaymentMethod from './components/PaymentMethod';
import PriceCard from './components/PriceCard';
import ShippingOrder from './components/ShippingOrder';

function Page() {
  const auth = useAppSelector(AuthSelectors.user);
  const cart = useSelector(CartSelectors.cart);
  const cartSelected = useSelector(CartSelectors.cartSelected);
  const customerShipping = useSelector(CustomerSelectors.shipping);
  const price = useSelector(CartSelectors.priceCheckout);
  const selectedShipping = useSelector(CartSelectors.shippingSelectedId);
  const selectedShippingVariants = cartSelected.map((selected: any) => selected.variantId);

  const variantsInSelectedShipping = cart.items
    .filter((item: any) => selectedShippingVariants.includes(item.variantId._id)) // Kiểm tra xem variantId có trong selectedShipping không
    .map((item: any) => ({
      productId: item.productId._id,
      productName: item.productId.name,
      productDescription: item.productId.description,
      productImages: item.productId.images,
      variantId: item.variantId._id,
      color: item.variantId.color,
      ram: item.variantId.ram,
      ssd: item.variantId.ssd,
      price: item.variantId.price,
      stock: item.variantId.stock,
      quantity: item.quantity
    }));

  return (
    <>
      <div className="font-[sans-serif] bg-mainContent">
        <div className="max-lg:max-w-xl mx-auto w-full">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 max-lg:order-1 p-6 !pr-0 max-w-4xl mx-auto w-full">
              <div className="text-center max-lg:hidden">
                <h2 className="text-3xl font-extrabold text-fontColor inline-block border-b-2 border-gray-800 pb-1">
                  Checkout
                </h2>
              </div>
              <form className="lg:mt-16">
                <div>
                  <h2 className="text-xl font-bold text-fontColor">Shipping info</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <ShippingOrder customerShipping={customerShipping} selectedShipping={selectedShipping} />
                  </div>
                </div>
                <PaymentMethod />
                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    type="button"
                    className="min-w-[150px] px-6 py-3.5 text-sm bg-gray-200 text-fontColor rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="min-w-[150px] px-6 py-3.5 text-sm bg-blue-600 text-fontColor rounded-lg hover:bg-blue-700"
                  >
                    Confirm payment $240
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-mainContent lg:h-screen lg:sticky lg:top-0 mt-5">
              <div className="relative h-full border-2 rounded-md">
                <div className="p-6 overflow-auto max-lg:max-h-[400px] lg:h-[calc(100vh-60px)] max-lg:mb-8 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg">
                  <h2 className="text-xl font-bold text-fontColor">Order Summary</h2>
                  <div className="space-y-2 mt-5 lg:mb-8">
                    {variantsInSelectedShipping?.map((item: any, index: any) => (
                      <CardProductCheckout item={item} />
                    ))}
                  </div>
                </div>
                <PriceCard price={price} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page;