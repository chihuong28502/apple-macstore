'use client'
import { OrderSelectors } from '@/modules/order/slice'
import React from 'react'
import { useSelector } from 'react-redux'

function page() {
  const order = useSelector(OrderSelectors.order)

  console.log("🚀 ~ order:", order)
  return (
    <div>
      <img src={order.qr} alt="" />
    </div>
  )
}

export default page