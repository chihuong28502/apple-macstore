"use client";
import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import { CartActions, CartSelectors } from "@/modules/cart/slice";
import { Button, Card, Col, Empty, Row, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";
import Image from "next/image";

function CartCheckout() {
  const dispatch = useDispatch();
  const auth = useAppSelector(AuthSelectors.user);
  const cart = useAppSelector(CartSelectors.cart);
  const [quantitys, setQuantity] = useState()
  const router = useRouter();

  useEffect(() => {
    if (auth?._id) {
      dispatch(CartActions.fetchCartById(auth._id));
    }
  }, [auth?._id, dispatch]);

  const handleQuantityChange = (productId: string, variantId: string, quantity: number) => {
    if (quantity > 0) {
      // Cập nhật số lượng giỏ hàng trong Redux store
      dispatch(
        CartActions.updateCartItemQuantity({
          userId: auth._id,
          productId,
          variantId,
          quantity,
        })
      );

    }
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    // Xóa sản phẩm khỏi giỏ hàng
    dispatch(CartActions.deleteItemCard({
      userId: auth._id,
      productId,
      variantId,
    }));
  };

  const getMenuItems = (cart: any) => {
    if (!cart?.items?.length) {
      return (
        <div className="flex justify-center items-center p-4">
          <Empty description="Giỏ hàng trống" />
        </div>
      );
    } else {
      return cart.items.map((item: any) => {
        const { productId, variantId, quantity } = item;
        const { color, ram, ssd, price, stock } = variantId;
        return (
          <Card
            key={productId._id || item._id}
            className="my-2 mx-auto w-full"
            hoverable
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col span={5} style={{ textAlign: "center" }}>
                <Image
                  src={productId.images[0].image}
                  alt={productId.name}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              </Col>
              <Col span={13}>
                <span className="font-bold text-lg block">{productId.name}</span>
                <span className="text-gray-500 block">{`Màu: ${color}`}</span>
                <span className="text-lg font-semibold text-red-600">{`${price.toLocaleString()}₫`}</span>
              </Col>
              <Col span={6} className="text-right">
                <div className="text-gray-500 block">{`RAM: ${ram}`}</div>
                <div className="text-gray-500 block w-full">{`Lưu trữ: ${ssd}`}</div>
                <div className="flex justify-end gap-2">
                  <Button
                    size="small"
                    onClick={() => handleQuantityChange(productId._id, variantId._id, quantity + 1)} // Tăng số lượng
                    disabled={Number(quantity) >= Number(stock)}
                  >
                    +
                  </Button>
                  <span className="text-gray-500 flex items-center">{`${quantity}`}</span>

                  <Button
                    size="small"
                    onClick={() => handleQuantityChange(productId._id, variantId._id, quantity - 1)} // Giảm số lượng
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                </div>
                <div className="text-gray-500 block w-full">{`Tồn kho: ${stock}`}</div>
                <Tooltip title='Xóa' placement="bottom">
                  <Button
                    size="small"
                    type="link"
                    danger
                    onClick={() => handleRemoveItem(productId._id, variantId._id)} // Xóa sản phẩm
                  >
                    <FaTrashAlt />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Card>
        );
      });
    }
  };

  return (
    <div className="font-sans mx-auto bg-white py-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gray-100 p-4 rounded-md">
          <h2 className="text-2xl font-bold text-gray-800">Cart</h2>
          <hr className="border-gray-300 mt-4 mb-8" />
          {auth?._id && cart && getMenuItems(cart)}
          {!auth?._id && <></>}
        </div>
        <div className="bg-gray-100 rounded-md p-4 md:sticky top-0">
          <div className="flex border border-blue-600 overflow-hidden rounded-md">
            <input
              type="email"
              placeholder="Promo code"
              className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2.5"
            />
            <button
              type="button"
              className="flex items-center justify-center font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white"
            >
              Apply
            </button>
          </div>
          <ul className="text-gray-800 mt-8 space-y-4">
            <li className="flex flex-wrap gap-4 text-base">
              Discount <span className="ml-auto font-bold">$0.00</span>
            </li>
            <li className="flex flex-wrap gap-4 text-base">
              Shipping <span className="ml-auto font-bold">$2.00</span>
            </li>
            <li className="flex flex-wrap gap-4 text-base">
              Tax <span className="ml-auto font-bold">$4.00</span>
            </li>
            <li className="flex flex-wrap gap-4 text-base font-bold">
              Total <span className="ml-auto">$52.00</span>
            </li>
          </ul>
          <div className="mt-8 space-y-2">
            <button
              type="button"
              className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Checkout
            </button>
            <button
              type="button"
              className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartCheckout;
