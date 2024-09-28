// CustomButton.tsx
import { Button, Tooltip } from "antd";
import clsx from "clsx"; // Thư viện hỗ trợ nối các class dễ dàng
import React from "react";

interface CustomButtonProps {
  label: string;
  type?: "primary" | "default" | "dashed" | "text" | "link";
  onClick?: () => void; // Nhận hàm onClick nếu có
  disabled?: boolean;
  icon?: React.ReactNode;
  tooltipText?: string;
  className?: string; // Nhận thêm className
  classNameContainer?: string; // ClassName tùy chỉnh
  htmlType?: "button" | "submit" | "reset"; // Để xác định loại button
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  type = "default",
  onClick, // Nhận hàm onClick
  disabled = false,
  icon,
  tooltipText,
  className, // ClassName tùy chỉnh
  classNameContainer, // ClassName tùy chỉnh
  htmlType = "button", // Mặc định là button thường
}) => {
  // Class mặc định cho button
  const defaultClasses =
    "flex justify-center items-center gap-2 w-28 h-12 cursor-pointer rounded-md shadow-2xl text-white font-semibold bg-gradient-to-r from-[#fb7185] via-[#e11d48] to-[#be123c] hover:shadow-xl hover:shadow-red-500 hover:scale-105 duration-300 !hover:from-[#be123c] !hover:to-[#fb7185]";
  const defaultClassesContainer = "my-2";

  return (
    <div className={clsx(defaultClassesContainer, classNameContainer)}>
      <Tooltip title={tooltipText}>
        <Button
          type={type}
          disabled={disabled}
          icon={icon}
          className={clsx(defaultClasses, className)} // Gộp class mặc định và tùy chỉnh
          htmlType={htmlType} // Định nghĩa loại của button
          onClick={onClick} // Nhận sự kiện onClick nếu có
        >
          {label}
        </Button>
      </Tooltip>
    </div>
  );
};

export default CustomButton;
