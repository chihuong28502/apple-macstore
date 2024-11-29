"use client";
import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import { CartActions, CartSelectors } from "@/modules/cart/slice";
import { Badge, Button, Card, Col, ConfigProvider, Dropdown, Empty, MenuProps, Row } from "antd";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const auth = useAppSelector(AuthSelectors.user);
  const cart = useAppSelector(CartSelectors.cart);
  const router = useRouter();

  useEffect(() => {
    if (auth?._id) {
      dispatch(CartActions.fetchCartById(auth._id)); // Fetch cart data for logged-in user
    }
  }, [auth?._id, dispatch]);

  const { resolvedTheme } = useTheme();

  const handleClickPayment = () => {
    router.push('/cart'); // Navigate to the cart page
  };

  const getMenuItems = (): MenuProps["items"] => {
    if (!cart?.items || cart?.items.length === 0) {
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
        const { productId, variantId, quantity } = item;
        const { images, name } = productId;
        const { color, ram, ssd, price, availableStock } = variantId;

        return {
          label: (
            <Card
              className={`my-2 ${availableStock === 0 ? "disabled opacity-70" : ""}`}
              hoverable
              bordered={false}
              style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col span={5} style={{ textAlign: "center" }}>
                  <img
                    loading="lazy"
                    src={images[0]?.image || ""}
                    alt={name}
                    width={100}
                    height={100}
                    className="object-cover rounded"
                  />
                </Col>
                <Col span={12}>
                  <span className="font-bold text-lg block">{name}</span>
                  <span className="text-gray-500 block">{`Màu: ${color}`}</span>
                  <span className="text-lg font-semibold text-red-600">
                    {`${price.toLocaleString()}₫`}
                  </span>
                </Col>
                <Col span={7} className="text-right">
                  <div className="text-gray-500 block">{`RAM: ${ram}`}</div>
                  <div className="text-gray-500 block w-full">{`SSD: ${ssd}`}</div>
                  <div className="text-red-600 block w-full">{`Số lượng: ${quantity}`}</div>
                </Col>
              </Row>
            </Card>
          ),
          key: item._id,
        };
      }).concat([ // Add total and payment button
        {
          label: (
            <div className="text-fontColor flex items-center justify-between w-full">
              <span className="font-bold">
                {`Tổng: ${cart.items.reduce((acc: any, item: any) => {
                  const { price } = item.variantId;
                  return acc + (price * item.quantity);
                }, 0).toLocaleString()}₫`}
              </span>
              <Button onClick={handleClickPayment} type="primary" style={{ marginLeft: '10px' }}>
                Thanh toán
              </Button>
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
            colorBgElevated: resolvedTheme === "dark" ? "#f9f9f9" : "#fff",
          },
        },
      }}
    >
      <Dropdown
        placement="bottom"
        open={isOpen}
        onOpenChange={setIsOpen} // Manage dropdown open/close
        menu={{ items: getMenuItems() }}
        dropdownRender={(menu) => (
          <div
            className="bg-[#e0e0e0] shadow-[15px_15px_30px_#bebebe,-15px_-15px_30px_#ffffff]"
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
        <div className="cursor-pointer p-1.5 pl-0 text-fontColor flex items-center">
          <Badge
            style={{ fontSize: '0.8rem', fontWeight: 650, width: '16px', height: '16px', lineHeight: '16px', padding: '0' }}
            count={cart?.items?.length} overflowCount={99} color="red"
          >
            <IoCartOutline className="size-5 text-fontColor" />
          </Badge>
        </div>
      </Dropdown>
    </ConfigProvider>
  );
};

export default Cart;
