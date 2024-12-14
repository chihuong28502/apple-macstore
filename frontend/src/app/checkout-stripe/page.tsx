"use client";

import FullScreenLoading from "@/components/loadingCheck/LoadingCheck";
import { useAppDispatch, useAppSelector } from "@/core/services/hook";
import { OrderActions, OrderSelectors } from "@/modules/order/slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CheckoutSripe = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const statusCreditCardPayment = useAppSelector(
    OrderSelectors.checkPaymentCreditCardStatus
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFullScreen, setShowFullScreen] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(
    statusCreditCardPayment !== null
  );

  const [key, setKey] = useState<number>(0);
  const countdownRef = useRef<any>(null);

  const handleRedirect = () => {
    router.push("/");
  };

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [sessionId]);

  const renderer = ({ minutes, seconds, completed }: any) => {
    if (completed) {
      router.push("/");
    } else {
      return (
        <span>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      );
    }
  };

  useEffect(() => {
    dispatch(
      OrderActions.getStatusCreditCardPayment({
        sessionId,
        onSuccess: () => {
          setIsLoading(false);
          setTimeout(() => {
            router.push("/");
          }, 60 * 1000);
        },
        onFail: () => {
          setIsLoading(false);
          setTimeout(() => {
            router.push("/");
          }, 60 * 1000);
        },
      })
    );
  }, [sessionId, router]);

  useEffect(() => {
    setIsCompleted(statusCreditCardPayment !== null);
  }, [statusCreditCardPayment]);

  return (
    <div>
      {showFullScreen && (
        <FullScreenLoading
          isLoading={isLoading}
          isCompleted={isCompleted}
          loadingText="Đang xử lý thanh toán..."
          completedText="Thanh toán thành công!"
          completedFailText="Thanh toán thất bại"
          paymentStatus={statusCreditCardPayment}
          onComplete={() => {
            setShowFullScreen(false);
            setIsLoading(false);
            setIsCompleted(false);
          }}
        />
      )}

      {!showFullScreen && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-layout">
          <div className="mb-6">
            {statusCreditCardPayment ? (
              <FaCheckCircle className="text-green-500 text-8xl" />
            ) : (
              <FaTimesCircle className="text-red-500 text-8xl" />
            )}
          </div>

          <h1 className="text-2xl font-bold mb-4">
            {statusCreditCardPayment
              ? "Chúc mừng bạn đã thanh toán thành công. Nếu có bất cứ thắc mắc gì hãy liên hệ với chúng tôi."
              : "Thanh toán thất bại. Đã gặp lỗi khi thanh toán, mời bạn thanh toán lại."}
          </h1>

          <p className="text-gray-700 mb-4">
            Trang này sẽ tự động chuyển về trang chủ trong
          </p>

          <div className="bg-gray-800 tPext-fontColor text-4xl px-6 py-3 rounded-lg shadow-lg flex items-center justify-center w-48 h-16">
            <Countdown
              date={Date.now() + 30 * 1000}
              renderer={renderer}
              key={key}
              ref={countdownRef}
              className="font-bold font-mono"
            />
          </div>

          <button
            onClick={handleRedirect}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-3"
          >
            Quay về trang chủ ngay lập tức
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutSripe;
