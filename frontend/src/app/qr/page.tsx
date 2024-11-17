'use client'
import FullScreenLoading from '@/components/loadingCheck/LoadingCheck'
import { cleanupSocketEvent, listenToSocketEvent } from '@/lib/socket/emit.socket'
import  { getSocket } from '@/lib/socket/socket'
import { AuthSelectors } from '@/modules/auth/slice'
import { OrderActions, OrderSelectors } from '@/modules/order/slice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function QrScan() {
  const dispatch = useDispatch()
  const order = useSelector(OrderSelectors.order)
  const auth = useSelector(AuthSelectors.user)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);
  const socket = getSocket(); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const handleOrderCheck = (orderSocket :any) => {
      if (
        orderSocket.code === order.code &&
        auth._id === orderSocket.userId &&
        auth._id === order.userId
      ) {
        dispatch(OrderActions.setOrder(orderSocket));
      }
    };

    listenToSocketEvent(socket, "check-order", handleOrderCheck);

    return () => {
      cleanupSocketEvent(socket, "check-order");
    };
  }, [socket, dispatch, order, auth]);

  useEffect(() => {
    if (order?.status === "shipping") {
      setIsModalVisible(true)
      setShowFullScreen(true)
      setIsLoading(true);
      setIsCompleted(true);
    }
  }, [order])

  return (
    <div>
      <img src={order?.qr} alt="QR Code" />
      {/* {isModalVisible && (
        <Modal
          title="QR Code for Payment"
          visible={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
          centered
        >
          <p className="text-center">Không tìm thấy mã QR</p>
        </Modal>
      )} */}
      {showFullScreen && (
        <FullScreenLoading
          isLoading={true}
          isCompleted={isCompleted}
          loadingText="Đang xử lý thanh toán..."
          completedText="Thanh toán thành công!"
          completedFailText="Thanh toán thất bại"
          paymentStatus={true}
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
