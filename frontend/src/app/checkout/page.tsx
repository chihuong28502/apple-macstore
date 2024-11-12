'use client'
import { CartSelectors } from '@/modules/cart/slice';
import React from 'react'
import { useSelector } from 'react-redux';

function Page() {
  const cartSelected = useSelector(CartSelectors.cartSelected);
  const price = useSelector(CartSelectors.priceCheckout);
  const selectedShipping = useSelector(CartSelectors.shippingSelectedId);

  return (
    <div>Page</div>
  )
}

export default Page