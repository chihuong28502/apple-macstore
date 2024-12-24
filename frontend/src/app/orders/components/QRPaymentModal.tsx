'use client';

import FullScreenLoading from '@/components/loadingCheck/LoadingCheck';
import { cleanupSocketEvent, listenToSocketEvent } from '@/lib/socket/emit.socket';
import { getSocket } from '@/lib/socket/socket';
import { AuthSelectors } from '@/modules/auth/slice';
import { OrderActions, OrderSelectors } from '@/modules/order/slice';
import { Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type ModalPaymentProps = {
  isOpen: boolean;
  onClose: () => void;
  order: any; // Cập nhật kiểu nếu có
};

function ModalPayment({ isOpen, onClose }: ModalPaymentProps) {
  const dispatch = useDispatch()
  const auth = useSelector(AuthSelectors.user)
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const order = useSelector(OrderSelectors.order)
  const socket = getSocket()

  useEffect(() => {
    if (order?.status === 'shipping') {
      setShowFullScreen(true);
      setIsCompleted(true);
    }
  }, [order]);

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
      setShowFullScreen(true)
      setIsCompleted(true);
    }
  }, [order])
  return (
    <Modal
      title="Thanh toán"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      {order?.qr ? (
        <div className="flex flex-col items-center">
          <img
            src={order.qr}
            alt="QR Code"
            className="w-32 h-32 mb-4"
          />
          <p className="text-center text-gray-700">Quét mã QR để thanh toán</p>
        </div>
      ) : (
        <div className="flex justify-center">
          <Spin tip="Đang tải thông tin thanh toán..." />
        </div>
      )}
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
            setIsCompleted(false);
          }}
        />
      )}
    </Modal>
  );
}

export default ModalPayment;
