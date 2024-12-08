'use client';
import { useAppSelector } from '@/core/services/hook';
import { formatDateTimeByDb } from '@/lib/formatTimeInDate';
import { formatTimeDifference } from '@/lib/timeCurrentDesInput';
import { AuthSelectors } from '@/modules/auth/slice';
import { OrderActions, OrderSelectors } from '@/modules/order/slice';
import {
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  FieldTimeOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, List, message, Modal, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalPayment from './components/QRPaymentModal';

type OrderItem = {
  productImages: { image: string }[];
  productName: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  code: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
};

function Orders() {
  const dispatch = useDispatch();
  const auth = useAppSelector(AuthSelectors.user);
  const allOrder: Order[] = useAppSelector(OrderSelectors.allOrder);
  const isLoadingOrder = useSelector(OrderSelectors.isLoading)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderSelected, setOrderSelected] = useState("")
  const order = useSelector(OrderSelectors.order)
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  useEffect(() => {
    if (order?.status === "shipping") {
      setShowFullScreen(true);
      setIsCompleted(true);
    }
  }, [order?.status]);
  useEffect(() => {
    if (auth?._id) {
      dispatch(OrderActions.getAllOrderById(auth._id));
    }
  }, [auth?._id, dispatch]);


  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Tag icon={<SyncOutlined spin />} color="blue">
            Pending
          </Tag>
        );
      case 'shipping':
        return (
          <Tag icon={<CarOutlined />} color="orange">
            Shipping
          </Tag>
        );
      case 'success':
        return (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Success
          </Tag>
        );
      case 'cancelled':
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Cancelled
          </Tag>
        );
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  const handleCancelOrder = (orderId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          dispatch(OrderActions.updateStatus({
            userId: auth._id,
            id: orderId,
            data: {
              userId: auth._id,
              status: "cancelled"
            }
          }));
        } catch (error) {
          message.error("Có lỗi xảy ra khi thay hủy đơn hàng này?");
        }
      },
    });
  };

  const handleMarkAsReceived = (orderId: string) => {
    // Logic để đánh dấu đơn hàng đã nhận
    Modal.confirm({
      title: "Xác nhận nhận đơn",
      content: "Bạn có chắc chắn đã nhận hàng chưa?",
      okText: "Đã  nhận",
      okType: "danger",
      cancelText: "Chưa",
      onOk: async () => {
        try {
          dispatch(OrderActions.updateStatus({
            userId: auth._id,
            id: orderId,
            data: {
              status: "success",
              userId: auth._id,
            }
          }));
        } catch (error) {
          message.error("Có lỗi xảy ra?");
        }
      },
    });
  };

  if (isLoadingOrder) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden m-1"
          >
            <div className="w-full h-40 bg-gray-300 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded-md animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="mt-4 flex gap-4">
                <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }
  const handleCloseModal = () => {
    setOrderSelected(""); // Xóa order đã chọn
    setIsModalOpen(false); // Đóng modal
  };
  const handleOpenModalPayment = (order: any) => {
    dispatch(OrderActions.setOrder(order))
    setIsModalOpen(true)
    setOrderSelected(order)
  }

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6 text-center text-fontColor">My Orders</h1>
      {allOrder?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allOrder.map((order: any) => (
            <div className="">
              <Card
                key={order._id}
                title={`Order: ${order.code}`}
                extra={getStatusTag(order.status)}
                className="shadow-lg rounded-lg border border-gray-200 flex flex-col h-full"
              >
                <p className="mb-2">
                  <FieldTimeOutlined className="mr-2 text-green-500" />
                  Time: <span className="font-semibold text-gray-800">{formatTimeDifference(order.createdAt)} ({formatDateTimeByDb(order.createdAt)})</span>
                </p>
                <p className="mb-2">
                  <DollarCircleOutlined className="mr-2 text-green-500" />
                  Total Price: <span className="font-semibold text-gray-800">${order.totalPrice.toFixed(2)}</span>
                </p>
                <p className="mb-2">
                  <ShoppingCartOutlined className="mr-2 text-blue-500" />
                  Items: <span className="font-semibold text-gray-800">{order.items.length}</span>
                </p>
                <List
                  className="mt-4"
                  dataSource={order.items}
                  renderItem={(item: any) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar src={item.productImages?.[0]?.image || 'https://via.placeholder.com/50'} />
                        }
                        title={item.productName}
                        description={`Quantity: ${item.quantity} | Price: $${item.price}`}
                      />
                    </List.Item>
                  )}
                />
                <div className="mt-4 flex flex-col gap-2">
                  {(order.status === 'pending' || order.status === 'shipping') && (
                    <Button
                      aria-label="Cancel Order"
                      role="button"
                      type="primary"
                      danger
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                  {order.status === 'shipping' && (
                    <Button
                      type="primary"
                      onClick={() => handleMarkAsReceived(order._id)}
                    >
                      Mark as Received
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => handleOpenModalPayment(order)}
                      className="bg-blue-600"
                    >
                      Open Payment QR
                    </Button>
                  )}
                </div>
              </Card>

            </div>
          ))}

        </div>
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )}
       <ModalPayment
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={orderSelected}
      />
    </div>
  );
}

export default Orders;
