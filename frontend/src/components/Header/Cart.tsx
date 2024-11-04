"use client";
import { Card, Col, ConfigProvider, Dropdown, Empty, MenuProps, Row } from "antd";
import _ from "lodash";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";

import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import { useDispatch } from "react-redux";
import { CartActions, CartSelectors } from "@/modules/cart/slice";
import Image from "next/image";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const auth = useAppSelector(AuthSelectors.user);
  const cart = useAppSelector(CartSelectors.cart);
  console.log("🚀 ~ cart:", cart)

  useEffect(() => {
    if (auth?._id) {
      dispatch(CartActions.fetchCartById(auth._id));
    }
  }, [auth?._id, dispatch]);

  const { resolvedTheme } = useTheme();

  const getMenuItems = (): MenuProps["items"] => {
    if (_.isEmpty(cart?.items)) {
      return [
        {
          label: (
            <div className="flex justify-center items-center p-4">
              <Empty description="Giỏ hàng trống" />
            </div>
          ),
          key: "empty",
        },
      ];
    } else {
      return cart.items.map((item: any) => {
        const { productId, quantity } = item;
        const stockInfo = productId.stock;

        const color = Object.keys(stockInfo)[0];
        const ram = Object.keys(stockInfo[color])[0];
        const storage = Object.keys(stockInfo[color][ram])[0]; 
        const price = stockInfo[color][ram][storage].price; 

        return {
          label: (
            <Card className="my-2" hoverable bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={6} style={{ textAlign: "center" }}>
                  <Image
                    src={productId.images[0].image} // Lấy ảnh đầu tiên
                    alt={productId.name}
                    width={80} // Đặt chiều rộng của ảnh
                    height={80} // Đặt chiều cao của ảnh
                    className="object-cover rounded" // Bảo đảm ảnh được cắt đúng tỷ lệ và bo góc
                  />
                </Col>
                <Col span={14}>
                  <div className="">
                    <span className="font-bold text-lg block">{productId.name}</span> {/* Tên sản phẩm */}
                    <span className="text-gray-500">{`Màu: ${color}, RAM: ${ram}, Lưu trữ: ${storage}`}</span> {/* Màu sắc, RAM và lưu trữ */}
                  </div>
                </Col>
                <Col span={4} className="text-right">
                  <span className="text-lg font-semibold text-red-600">{`${quantity} x ${price.toLocaleString()}₫`}</span> {/* Số lượng x Giá */}
                </Col>
              </Row>
            </Card>
          ),
          key: item._id,
        };
      }).concat([
        {
          label: (
            <div className="text-fontColor flex flex-col items-center justify-center p-2 border-t">
              <span className="font-bold">{`Tổng: ${cart.items.reduce((acc: any, item: any) => {
                const stockInfo = item.productId.stock;
                const color = Object.keys(stockInfo)[0]; // Lấy key màu đầu tiên
                const ram = Object.keys(stockInfo[color])[0]; // Lấy key RAM đầu tiên
                const storage = Object.keys(stockInfo[color][ram])[0]; // Lấy key Storage đầu tiên
                const price = Number(stockInfo[color][ram][storage].price); // Ép kiểu giá thành number
                return acc + (price * item.quantity); // Cộng giá vào tổng
              }, 0).toLocaleString()}₫`}</span>
            </div>

          ),
          key: "total",
        }
      ]);
    }
  };


  return (
    <ConfigProvider
      theme={{
        components: {
          Dropdown: {
            colorBgElevated: resolvedTheme === "dark" ? "#4b4b4b" : "#fff",
          },
        },
      }}
    >
      <Dropdown
        placement="bottom"
        open={isOpen}
        onOpenChange={setIsOpen}
        menu={{ items: getMenuItems() }}
        trigger={["click"]}
      >
        <div className="cursor-pointer p-1.5 pl-0 text-fontColor">
          <IoCartOutline className="size-5" />
        </div>
      </Dropdown>
    </ConfigProvider>
  );
};

export default Cart;
