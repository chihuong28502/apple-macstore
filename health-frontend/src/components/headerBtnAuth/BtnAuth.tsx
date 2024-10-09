import React from "react";
import { IconType } from "react-icons";

interface BtnAuthProps {
  title: string;
  icon?: IconType;
}

const BtnAuth: React.FC<BtnAuthProps> = ({ title, icon: Icon }) => {
  return (
    <button
      className="flex cursor-pointer gap-2 items-center text-fontColor bg-background
        hover:bg-button rounded-md duration-100 p-2"
    >
      {Icon && <Icon className="text-fontColor" />}
      <span className="text-sm font-bold pr-1 text-fontColor">{title}</span>
    </button>
  );
};

export default BtnAuth;
