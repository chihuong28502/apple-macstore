'use client'
import { useAppSelector } from '@/core/services/hook';
import { AuthSelectors } from '@/modules/auth/slice';
import { CartSelectors } from '@/modules/cart/slice';
import React from 'react'
import { useSelector } from 'react-redux';

function Page() {
  const auth = useAppSelector(AuthSelectors.user);
  const cart = useSelector(CartSelectors.cart);
  console.log("🚀 ~ cart:", cart)
  const cartSelected = useSelector(CartSelectors.cartSelected);
  console.log("🚀 ~ cartSelected:", cartSelected)
  const price = useSelector(CartSelectors.priceCheckout);
  const selectedShipping = useSelector(CartSelectors.shippingSelectedId);
  const selectedShippingVariants = cartSelected.map((selected: any) => selected.variantId);
  console.log("🚀 ~ selectedShippingVariants:", selectedShippingVariants)

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

  console.log("🚀 ~ variantsInSelectedShipping:", variantsInSelectedShipping);

  return (
    <div>Page</div>
  )
}

export default Page;
