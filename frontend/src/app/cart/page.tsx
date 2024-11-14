'use client'
import { useAppSelector } from "@/core/services/hook";
import { AuthActions, AuthSelectors } from "@/modules/auth/slice";
import { CartActions, CartSelectors } from "@/modules/cart/slice";
import { CustomerActions, CustomerSelectors } from "@/modules/customer/slice";
import { OrderActions } from "@/modules/order/slice";
import { Button, Card, Checkbox, Col, Empty, Input, List, message, Modal, Row, Space, Tooltip } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";

function CartCheckout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useAppSelector(AuthSelectors.user);
  const cart = useAppSelector(CartSelectors.cart);
  const shipping = useAppSelector(CustomerSelectors.shipping);
  const shippingList = useAppSelector(CustomerSelectors.shipping);
  const [selectedItems, setSelectedItems] = useState<Array<{ productId: string; variantId: string }>>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [editShippingData, setEditShippingData] = useState<any | null>(null);
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    address: "",
    description: ""
  });
  useEffect(() => {
    if (auth?._id) {
      dispatch(CartActions.fetchCartById(auth._id));
      dispatch(AuthActions.getInfoUser({}));
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
        const uniqueKey = `${productId._id}-${variantId._id}`;
        const isSelected = selectedItems.some(
          (selected) => selected.productId === productId._id && selected.variantId === variantId._id
        );
        return (
          <Card
            key={uniqueKey}
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
                  <span className="text-gray-500 flex items-center">{quantity}</span>

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

  const selectedTotal = cart?.items?.filter((item: any) =>
    selectedItems.some(
      (selected) => selected.productId === item.productId._id && selected.variantId === item.variantId._id
    )
  ).reduce((acc: number, item: any) => acc + item.variantId.price * item.quantity, 0) || 0;

  const taxAmount = (selectedTotal * 0.1) || 0;
  const formattedSelectedTotal = selectedTotal || 0;
  const handleContinueShopping = async () => {
    if (formattedSelectedTotal > 0 && selectedShipping) {
      dispatch(CartActions.setCartSelected(selectedItems))
      dispatch(CartActions.setPriceCheckout({
        selectedTotal: formattedSelectedTotal,
        taxAmount: taxAmount
      } as any));
      if (!shipping || auth.shipping.length === 0) {
        setIsShippingModalVisible(true);
      } else {
        dispatch(CartActions.setShippingSelectedId(selectedShipping as any));
        const selectedShippingVariants = selectedItems.map((selected: any) => selected.variantId);

        const variantsInSelectedShipping = cart.items
          .filter((item: any) => selectedShippingVariants.includes(item.variantId._id))
          .map((item: any) => ({
            productId: item.productId._id,
            productName: item.productId.name,
            productDescription: item.productId.description,
            productImages: item.productId.images,
            variantId: item.variantId._id,
            color: item.variantId.color,
            ram: item.variantId.ram,
            ssd: item.variantId.ssd,
            price: item.variantId.price,
            stock: item.variantId.stock,
            quantity: item.quantity
          }));

        dispatch(OrderActions.addOrder({
          userId: auth._id,
          items: variantsInSelectedShipping,
          shippingId: selectedShipping as any,
          price: formattedSelectedTotal,
          totalPrice: formattedSelectedTotal + taxAmount,
          taxAmount: taxAmount,
          status: "pending",
          paymentMethod: "",
          shippingFee: 0,
        }))
        router.push('/checkout');
      }
    } else {
      message.success("Chọn đủ sản phẩm và địa chỉ giao hàng")
    }
  };

  const handleSaveShipping = () => {
    setIsShippingModalVisible(false);
    if (editShippingData) {
      // Nếu đang chỉnh sửa, gọi hành động update địa chỉ
      dispatch(CustomerActions.updateShippingById({ userId: auth._id, shippingId: editShippingData._id, item: shippingData }));
    } else {
      // Nếu đang thêm mới, gọi hành động add địa chỉ
      dispatch(CustomerActions.addShippingById({ id: auth._id, item: shippingData }));
    }
  };
  const handleEditShipping = (shippingData: any) => {
    setShippingData({
      firstName: shippingData.firstName,
      lastName: shippingData.lastName,
      phoneNumber: shippingData.phoneNumber,
      city: shippingData.city,
      address: shippingData.address,
      description: shippingData.description || '',
    });
    setEditShippingData(shippingData);
    setIsShippingModalVisible(true);
  };

  const handleDeleteShipping = (shippingId: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      content: 'Hành động này sẽ không thể hoàn tác!',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        dispatch(CustomerActions.deleteShipping({ userId: auth._id, shippingId }));
      },
    });
  };


  const handleSelectShipping = (shippingId: string) => {
    setSelectedShipping(shippingId);
  };
  return (
    <>
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
                Tax <span className="ml-auto font-bold">{taxAmount.toLocaleString()}</span>
              </li>
              <li className="flex flex-wrap gap-4 text-base font-bold">
                Total <span className="ml-auto">
                  <span className="font-bold">
                    {`${formattedSelectedTotal.toLocaleString()}₫`}
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
      <div>
        <h2>Danh sách địa chỉ giao hàng</h2>
        <List
          dataSource={shippingList}
          renderItem={(item: any) => (
            <List.Item
              key={item._id}
              actions={[
                <Button onClick={() => handleEditShipping(item)}>Sửa</Button>,
                <Button danger onClick={() => handleDeleteShipping(item._id)}>Xóa</Button>,
              ]}
            >
              <Checkbox
                key={item._id}
                checked={selectedShipping === item._id}
                onChange={() => handleSelectShipping(item._id)}
              >
                {item.firstName} {item.lastName}, {item.address}, {item.city} - {item.phoneNumber}
              </Checkbox>
            </List.Item>
          )}
        />

        <Button onClick={() => setIsShippingModalVisible(true)}>Thêm địa chỉ mới</Button>
        <Space direction="vertical" size="middle">
          <Modal
            title={editShippingData ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}
            visible={isShippingModalVisible}
            onCancel={() => setIsShippingModalVisible(false)}
            onOk={handleSaveShipping}
          >
            <form>
              <label>
                Họ tên:
                <Input
                  value={shippingData.firstName}
                  onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                />
              </label>
              <label>
                Số điện thoại:
                <Input
                  value={shippingData.phoneNumber}
                  onChange={(e) => setShippingData({ ...shippingData, phoneNumber: e.target.value })}
                />
              </label>
              <label>
                Thành phố:
                <Input
                  value={shippingData.city}
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                />
              </label>
              <label>
                Địa chỉ:
                <Input
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                />
              </label>
              <label>
                Chi Tiết:
                <Input
                  value={shippingData.description}
                  onChange={(e) => setShippingData({ ...shippingData, description: e.target.value })}
                />
              </label>
            </form>
          </Modal>
        </Space>
      </div>
    </>
  );
}

export default CartCheckout;