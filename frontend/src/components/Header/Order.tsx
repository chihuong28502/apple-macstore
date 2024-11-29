"use client";
import { useAppSelector } from "@/core/services/hook";
import { formatTimeDifference } from "@/lib/timeCurrentDesInput";
import { AuthSelectors } from "@/modules/auth/slice";
import { OrderActions, OrderSelectors } from "@/modules/order/slice";
import { Badge, Button, Card, Col, ConfigProvider, Dropdown, Empty, MenuProps, message, Modal, Row } from "antd";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaReceipt } from "react-icons/fa";
import { useDispatch } from "react-redux";

const Order = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const auth = useAppSelector(AuthSelectors.user);
  const allOrder = useAppSelector(OrderSelectors.allOrder);
  const router = useRouter();

  useEffect(() => {
    if (auth?._id) {
      dispatch(OrderActions.getAllOrderById(auth._id));
    }
  }, [auth?._id, dispatch]);

  const handleCancelOrder = (id: any) => {
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
            id: id,
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

  }
  const { resolvedTheme } = useTheme();

  const getMenuItems = (): MenuProps["items"] => {
    if (!allOrder || allOrder.length === 0) {
      return [
        {
          label: (
            <div className="flex justify-center items-center p-4">
              <Empty description="Không có đơn hàng" />
            </div>
          ),
          key: "empty",
        },
      ];
    } else {
      return [
        // {
        //   label: (
        //     <div className="text-fontColor flex items-center justify-between border-b w-full">
        //       <Button
        //         className="w-full"
        //         onClick={() => router.push('/orders')}
        //         type="primary"
        //         style={{ marginLeft: '10px' }}
        //       >
        //         Show All
        //       </Button>
        //     </div>
        //   ),
        //   key: "showAll",
        // },
        ...(allOrder ?? []).map((order: any) => {
          const { _id, totalPrice, status, createdAt } = order;
          const statusStyles: any = {
            success: "bg-green-100",
            cancelled: " bg-gray-300",
            shipping: "bg-gray-100",
          };
          return {
            label: (
              <Card
                onClick={() => router.push('/orders')}
                className={`w-full ${statusStyles[status] || ""}`}
                hoverable
                bordered={false}
                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <Row gutter={[16, 16]} align="middle">
                  <Col>
                    <p className="font-bold text-lg ">Mã đơn: <span>{_id?.slice(0, 10)}</span> </p>
                    <p className="text-lg font-semibold text-red-600">
                      Tổng giá đơn hàng: <span>{totalPrice.toLocaleString()}₫</span>
                    </p>
                    <div className="flex justify-between">
                      <span className="text-gray-500 block">{`Trạng thái: ${status}`}</span>
                      <div className="text-gray-500 flex justify-end">
                        {formatTimeDifference(createdAt)} {/* Hiển thị thời gian tạo đơn */}
                      </div>
                    </div>
                  </Col>
                </Row>
                {["shipping", "pending"].includes(status) && (
                  <Button
                    type="primary"
                    danger={status === "cancelled"}
                    style={{ marginTop: "10px" }}
                    onClick={() => handleCancelOrder(_id)}
                  >
                    CANCEL
                  </Button>
                )}
              </Card>
            ),
            key: _id,
          };
        }),
      ];
    }
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Dropdown: {
            colorBgElevated: resolvedTheme === "dark" ? "#f9f9f9" : "#fff",
          },
        },
      }}
    >
      <Dropdown
        placement="bottom"
        open={isOpen}
        onOpenChange={setIsOpen}
        menu={{ items: getMenuItems()}}
        dropdownRender={(menu) => (
          <div
            style={{
              borderRadius: "8px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {menu}
          </div>
        )}
        trigger={["click"]}
      >
        <div className="cursor-pointer text-fontColor flex items-center">
          <Badge
            style={{
              fontSize: '0.8rem',
              fontWeight: 650,
              width: '16px',
              height: '16px',
              lineHeight: '16px',
              padding: '0',
            }}
            count={allOrder?.length}
            overflowCount={99}
            color="red"
          >
            <FaReceipt className="size-5 text-fontColor" />
          </Badge>
        </div>
      </Dropdown>
    </ConfigProvider>
  );
};

export default Order;
