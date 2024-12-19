"use client";
import { ConfigProvider } from "antd";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { FaReceipt } from "react-icons/fa";
const Order = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const handleClickIconCart = () => {
    router.push('/orders')
  }
  return (
    <div className="cursor-pointer text-fontColor flex items-center">
      <FaReceipt onClick={handleClickIconCart} className="size-5 text-fontColor" />
    </div>
  );
};

export default Order;
