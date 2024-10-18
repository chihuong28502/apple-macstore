import { useRouter } from "@/i18n/routing";
import React from "react";
import { IconType } from "react-icons";

interface BtnAuthProps {
  title: string;
  icon?: IconType;
  onClick?: () => void; // Cập nhật kiểu cho onClick
}

const BtnAuth: React.FC<BtnAuthProps> = ({ title, icon: Icon, onClick }) => {
  const router = useRouter();

  const handleClick = () => {
      router.push("/auth/login");
  };

  return (
    <button
      className="flex cursor-pointer gap-2 items-center text-fontColor bg-background
        hover:bg-button rounded-md duration-100 p-2"
      onClick={handleClick} // Gắn sự kiện onClick vào button
    >
      {Icon && <Icon className="text-fontColor" />}
      <span className="text-sm font-bold pr-1 text-fontColor">{title}</span>
    </button>
  );
};

export default BtnAuth;
