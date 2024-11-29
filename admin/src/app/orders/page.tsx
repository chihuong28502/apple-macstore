'use client';
import { useAppSelector } from '@/core/services/hook';
import { formatDateTimeByDb } from '@/lib/formatTimeInDate';
import { formatTimeDifference } from '@/lib/timeCurrentDesInput';
import { AuthSelectors } from '@/modules/auth/slice';
import { CustomerActions, CustomerSelectors } from '@/modules/customer/slice';
import { OrderActions, OrderSelectors } from '@/modules/order/slice';
import {
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DollarCircleOutlined,
  FieldTimeOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, List, message, Modal, Select, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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
  const users = useAppSelector(CustomerSelectors.customer) || [];
  const [selectedUser, setSelectedUser] = useState<string | "all">("all");

  useEffect(() => {
    if (auth?._id) {
      dispatch(OrderActions.getAllOrder({}));
      dispatch(CustomerActions.getCustomer({}));
    }
  }, [auth?._id, dispatch]);

  useEffect(() => {
    if (selectedUser === "all") {
      dispatch(OrderActions.getAllOrder({}));
    } else if (selectedUser) {
      dispatch(OrderActions.getAllOrderById(selectedUser));
    }
  }, [selectedUser, dispatch]);

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
          dispatch(
            OrderActions.updateStatus({
              userId: auth._id,
              id: orderId,
              data: {
                userId: auth._id,
                status: "cancelled",
              },
            })
          );
        } catch (error) {
          message.error("Có lỗi xảy ra khi thay hủy đơn hàng này?");
        }
      },
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          dispatch(
            OrderActions.deleteOrder({
              userId: auth._id,
              id: orderId,
            })
          );
        } catch (error) {
          message.error("Có lỗi xảy ra khi thay hủy đơn hàng này?");
        }
      },
    });
  };

  const handleMarkAsReceived = (orderId: string) => {
    Modal.confirm({
      title: "Xác nhận nhận đơn",
      content: "Bạn có chắc chắn đã nhận hàng chưa?",
      okText: "Đã nhận",
      okType: "danger",
      cancelText: "Chưa",
      onOk: async () => {
        try {
          dispatch(
            OrderActions.updateStatus({
              userId: auth._id,
              id: orderId,
              data: {
                userId: auth._id,
                status: "success",
              },
            })
          );
        } catch (error) {
          message.error("Có lỗi xảy ra?");
        }
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>
      {users.length > 0 ? (
        <div className="mb-4">
          <Select
            placeholder="Select a User"
            className="w-full"
            onChange={(value) => setSelectedUser(value)}
            options={[
              { label: "All", value: "all" },
              ...users.map((user: any) => ({
                label: `${user.profile.firstName} ${user.profile.lastName}`,
                value: user._id,
              })),
            ]}
          />
        </div>
      ) : null}
      {allOrder?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allOrder.map((order) => (
            <Card
              key={order._id}
              title={`Order: ${order.code}`}
              extra={
                <div className="flex items-center">
                  {getStatusTag(order.status)}
                  <CloseOutlined
                    onClick={() => handleDeleteOrder(order._id)}
                    className="ml-2 cursor-pointer text-red-500 hover:text-red-700 border-2 rounded-lg border-red-600 hover:bg-red-800"
                  />
                </div>
              }
              className="shadow-lg rounded-lg border border-gray-200 flex flex-col h-full"
            >
              <p className="mb-2">
                <FieldTimeOutlined className="mr-2 text-green-500" />
                Time:{" "}
                <span className="font-semibold text-gray-800">
                  {formatTimeDifference(order.createdAt)} (
                  {formatDateTimeByDb(order.createdAt)})
                </span>
              </p>
              <p className="mb-2">
                <DollarCircleOutlined className="mr-2 text-green-500" />
                Total Price:{" "}
                <span className="font-semibold text-gray-800">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </p>
              <p className="mb-2">
                <ShoppingCartOutlined className="mr-2 text-blue-500" />
                Items:{" "}
                <span className="font-semibold text-gray-800">
                  {order.items.length}
                </span>
              </p>
              <List
                className="mt-4"
                dataSource={order.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={
                            item.productImages?.[0]?.image ||
                            "https://via.placeholder.com/50"
                          }
                        />
                      }
                      title={item.productName}
                      description={`Quantity: ${item.quantity} | Price: $${item.price}`}
                    />
                  </List.Item>
                )}
              />
              <div className="mt-4 flex flex-col gap-2">
                {(order.status === "pending" ||
                  order.status === "shipping") && (
                    <Button
                      type="primary"
                      danger
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                {order.status === "shipping" && (
                  <Button
                    type="primary"
                    onClick={() => handleMarkAsReceived(order._id)}
                  >
                    Mark as Received
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden" >
              <div className="w-full h-56 bg-gray-300 animate-pulse"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="mt-4 flex gap-4">
                  <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="flex-1 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default Orders;
