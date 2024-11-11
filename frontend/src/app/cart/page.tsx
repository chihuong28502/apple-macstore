"use client";
import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import { CartActions, CartSelectors } from "@/modules/cart/slice";
import { Button, Card, Checkbox, Col, Empty, Row, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";
import Image from "next/image";

function CartCheckout() {
  const dispatch = useDispatch();
  const auth = useAppSelector(AuthSelectors.user);
  const cart = useAppSelector(CartSelectors.cart);
  const [selectedItems, setSelectedItems] = useState<Array<{ productId: string; variantId: string }>>([]);
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (auth?._id) {
      dispatch(CartActions.fetchCartById(auth._id));
    }
  }, [auth?._id, dispatch]);
  useEffect(() => {
    if (selectAll) {
      setSelectedItems(
        cart.items.map((item: any) => ({
          productId: item.productId._id,
          variantId: item.variantId._id,
        }))
      );
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, cart?.items]);
  const handleQuantityChange = (productId: string, variantId: string, quantity: number) => {
    if (quantity > 0) {
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
    dispatch(CartActions.deleteItemCard({
      userId: auth._id,
      productId,
      variantId,
    }));
  };

  const handleSelectItem = (productId: string, variantId: string) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some(
        (item) => item.productId === productId && item.variantId === variantId
      );

      if (isSelected) {
        return prevSelectedItems.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        );
      } else {
        return [...prevSelectedItems, { productId, variantId }];
      }
    });
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
        const isSelected = selectedItems.some(
          (selected) => selected.productId === productId._id && selected.variantId === variantId._id
        );
        return (
          <Card
            key={productId._id || item._id}
            className="my-2 mx-auto w-full bg-[#f7f7f7]"
            hoverable
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col span={1}>
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleSelectItem(productId._id, variantId._id)}
                />
              </Col>
              <Col span={4} style={{ textAlign: "center" }}>
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
                    onClick={() => handleQuantityChange(productId._id, variantId._id, quantity + 1)}
                    disabled={Number(quantity) >= Number(stock)}
                  >
                    +
                  </Button>
                  <span className="text-gray-500 flex items-center">{`${quantity}`}</span>

                  <Button
                    size="small"
                    onClick={() => handleQuantityChange(productId._id, variantId._id, quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                </div>
                <div className="text-gray-500 block w-full">{`Tồn kho: ${stock}`}</div>
                <Tooltip title="Xóa" placement="bottom">
                  <Button
                    size="small"
                    type="link"
                    danger
                    onClick={() => handleRemoveItem(productId._id, variantId._id)}
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
  console.log(cart);

  const selectedTotal = cart?.items
    ?.filter((item: any) =>
      selectedItems.some(
        (selected) => selected.productId === item.productId._id && selected.variantId === item.variantId._id
      )
    )
    .reduce((acc: number, item: any) => acc + item.variantId.price * item.quantity, 0)
    .toLocaleString();

  const handleContinueShopping = () => {
    if (selectedItems.length > 0) {
      console.log("🚀 ~ selectedItems:", selectedItems)
      dispatch(CartActions.setCartSelected(selectedItems))
      // router.push(`/selected-items?data=${encodeURIComponent(selectedData)}`);
    } else {
      // Có thể hiện thông báo nếu không có sản phẩm nào được chọn
      console.log("Không có sản phẩm nào được chọn");
    }
  };
  return (
    <div className="font-sans mx-auto bg-bgColor py-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-bgColor p-4 rounded-md">
          <h2 className="text-2xl font-bold text-fontColor">Cart</h2>
          <hr className="border-gray-300 mt-4 mb-8" />
          <div className="flex items-center mb-4">
            <Checkbox
              checked={selectAll}
              onChange={(e) => setSelectAll(e.target.checked)}
            />
            <span className="ml-2">Chọn tất cả</span>
          </div>
          {auth?._id && cart && getMenuItems(cart)}
          <div className="flex text-fontColor">
            {`Tổng giá đã chọn: ${selectedTotal}₫`}
          </div>
          {!auth?._id && <></>}
        </div>
        <div className="bg-bgColor rounded-md p-4 md:sticky top-0">
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
          <ul className="text-fontColor mt-8 space-y-4">
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
              Total <span className="ml-auto">
                <span className="font-bold">
                  {`${selectedTotal}₫`}
                </span>
              </span>
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
              onClick={handleContinueShopping}
              className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-fontColor border border-gray-300 rounded-md"
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
