'use client'
import FullScreenLoading from '@/components/loadingCheck/LoadingCheck'
import { cleanupSocketEvent, listenToSocketEvent } from '@/lib/socket/emit.socket'
import socket from '@/lib/socket/socket'
import { AuthSelectors } from '@/modules/auth/slice'
import { OrderActions, OrderSelectors } from '@/modules/order/slice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function QrScan() {
  const dispatch = useDispatch()
  const order = useSelector(OrderSelectors.order)
  const auth = useSelector(AuthSelectors.user)
  const [payment, setPayment] = useState(false)
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const handleOrderCheck = (orderSocket: any) => {
      if (orderSocket.code === order.code && auth._id === orderSocket.userId === order.userId) {
        dispatch(OrderActions.setOrder(orderSocket))
      } else {
        setIsLoading(false);
        setIsCompleted(false);
      }
    }
    listenToSocketEvent(socket, "check-order", handleOrderCheck)
    return () => cleanupSocketEvent(socket, "check-order")
  }, [socket, dispatch])

  useEffect(() => {
    if (order?.status === "shipping") {
      setShowFullScreen(true)
      setIsLoading(true);
      setIsCompleted(true);
      setPayment(true)
    } else {
      setShowFullScreen(false)
      setIsLoading(false);
      setIsCompleted(false);
      setPayment(false)
    }
  }, [order])

  return (
    <div className='flex justify-center  mx-auto items-center'>
      <img src={order?.qr} alt="QR Code" />
      {showFullScreen && (
        <FullScreenLoading
          isLoading={true}
          isCompleted={isCompleted}
          loadingText="Đang xử lý thanh toán..."
          completedText="Thanh toán thành công!"
          completedFailText="Thanh toán thất bại"
          paymentStatus={payment}
          onComplete={() => {
            setShowFullScreen(false);
            setIsLoading(false);
            setIsCompleted(false);
          }}
        />
      )}
    </div>
  )
}

export default QrScan
