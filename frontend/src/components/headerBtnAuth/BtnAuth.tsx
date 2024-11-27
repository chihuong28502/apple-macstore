import { useRouter } from "next/navigation";
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
      className="group flex cursor-pointer gap-2 items-center text-fontColor bg-background
    hover:bg-button rounded-md duration-100 p-2 w-28"
      onClick={handleClick}
    >
      {Icon && <Icon className="text-fontColor group-hover:text-[#000]" />}
      <span className="text-xs font-bold pr-1 text-fontColor group-hover:text-[#000]">
        {title}
      </span>
    </button>
  );
};

export default BtnAuth;
