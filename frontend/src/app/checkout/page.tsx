'use client'
import { useAppSelector } from '@/core/services/hook';
import { AuthSelectors } from '@/modules/auth/slice';
import { CartSelectors } from '@/modules/cart/slice';
import { CustomerSelectors } from '@/modules/customer/slice';
import { OrderActions, OrderSelectors } from '@/modules/order/slice';
import { Button, Modal, Radio } from 'antd'; // Import Radio từ Ant Design
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardProductCheckout from './components/CardProductCheckout';
import PriceCard from './components/PriceCard';
import ShippingOrder from './components/ShippingOrder';

function Page() {
  const route = useRouter()
  const dispatch = useDispatch()
  const auth = useAppSelector(AuthSelectors.user);
  const cartSelected = useSelector(CartSelectors.cartSelected);
  const customerShipping = useSelector(CustomerSelectors.shipping);
  const price = useSelector(CartSelectors.priceCheckout);
  const order = useSelector(OrderSelectors.order);
  console.log("🚀 ~ order:", order)
  const selectedShipping = useSelector(CartSelectors.shippingSelectedId);


  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>(''); // State lưu phương thức thanh toán

  const handleGetQrCode = async () => {
    // setLoading(true);
    // try {
    //   if (paymentMethod === 'qrmBBank') {
    //     // API lấy mã QR của MB Bank
    //     setQrCode("https://qr.sepay.vn/img?acc=0979756291&bank=MB&amount=29000000&des=NOI_DUNG_MB");
    //   } else {
    //     // API lấy mã QR mặc định hoặc phương thức thanh toán khác
    //     setQrCode("https://qr.sepay.vn/img?acc=0979756291&bank=VCB&amount=29000000&des=NOI_DUNG");
    //   }
    //   setIsModalVisible(true);
    // } catch (error) {
    //   console.error('Lỗi khi lấy QR code:', error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleClickPayment = async () => {
    if (paymentMethod === 'qrmBBank') {
      const qr = `https://qr.sepay.vn/img?acc=097976291&bank=MBBank&amount=${price.selectedTotal + price.taxAmount}&des=${order._id}}`
      dispatch(OrderActions.setQr(qr))
      route.push('/qr')
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setQrCode(null);
  };

  return (
    <>
      <div className="font-[sans-serif] bg-mainContent">
        <div className="max-xl:max-w-xl mx-auto w-full">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-fontColor inline-block border-b-2 border-gray-800 pb-1">
              Đặt hàng
            </h2>
          </div>
          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 border-2 rounded-lg p-4 max-xl:order-1 !pr-0 max-w-4xl mx-auto w-full mt-8">
              <form>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <ShippingOrder customerShipping={customerShipping} selectedShipping={selectedShipping} />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-fontColor">Chọn phương thức thanh toán</h3>
                  <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                    <Radio value="default">Thanh toán qua QR VCB</Radio>
                    <Radio value="qrmBBank">Thanh toán qua QR MB Bank</Radio>
                  </Radio.Group>
                </div>

                {paymentMethod === 'qrmBBank' && (
                  <div className="mt-4">
                    Nhấn tiếp tục để lấy QR
                  </div>
                )}

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    className="min-w-[150px] px-6 py-3.5 text-sm bg-gray-200 text-fontColor rounded-xl hover:bg-gray-300"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleClickPayment}
                    className="min-w-[150px] px-6 py-3.5 text-sm bg-blue-600 text-fontColor rounded-xl hover:bg-blue-700"
                  >
                    Confirm payment
                  </Button>
                  <Button
                    onClick={handleGetQrCode}
                    className="min-w-[150px] px-6 py-3.5 text-sm bg-green-600 text-fontColor rounded-xl hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Loading QR Code...' : 'Get QR Code'}
                  </Button>
                </div>
              </form>
            </div>
            <div className="bg-mainContent xl:h-screen xl:sticky xl:top-0 mt-8">
              <div className="relative h-full border-2 rounded-md">
                <div className="p-6 overflow-auto max-xl:max-h-[400px] xl:h-[calc(100vh-60px)] max-xl:mb-8 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-xl">
                  <h2 className="text-xl font-bold text-fontColor">Tất cả sản phẩm</h2>
                  <div className="space-y-2 mt-5 md:mb-8">
                    {order?.items?.map((item: any) => (
                      <CardProductCheckout key={item.variantId} item={item} />
                    ))}
                  </div>
                </div>
                <PriceCard price={price} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="QR Code for Payment"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        {qrCode ? (
          <img src={qrCode} alt="QR Code" className="mx-auto" style={{ maxWidth: '100%' }} />
        ) : (
          <p className="text-center">Không tìm thấy mã QR</p>
        )}
      </Modal>
    </>
  );
}

export default Page;
