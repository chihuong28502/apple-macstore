"use client";

import mstLogo from "@/asset/images/mst.png";
import Image from "next/image";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { HiOutlineQueueList } from "react-icons/hi2";
import MultipleSelect from "../MultipleSelect/MultipleSelect";
import { MdMenuOpen } from "react-icons/md";
import { motion } from "framer-motion";
import NotificationPopover from "@/components/NotificationPopover/NotificationPopover";

const data = [
  { _id: 1, name: "Mưa tháng sáu" },
  { _id: 2, name: "Tiếng mưa rơi lofi cực chill" },
  { _id: 3, name: "Mưa tháng sáu Văn Mai Hương" },
  { _id: 4, name: "Video mưa đẹp" },
  { _id: 5, name: "cảnh mưa tâm trạng" },
];
type Props = {
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
};
const Header = ({ setCollapsed, collapsed }: Props) => {
  const toggleCollapsed = () => {
    setCollapsed((prev: boolean) => !prev);
  };
  return (
    <div className="p-6 bg-layout">
      <div className="h-12 flex justify-between">
        <div className="h-full flex w-[78.2%] ">
          <motion.div
            className="flex items-center p-3 bg-inputBackground rounded-lg cursor-pointer mr-[78.2px]"
            onClick={toggleCollapsed}
            whileHover={{ scale: 1.05 }} // Tăng kích thước khi hover
            whileTap={{ scale: 0.95 }} // Giảm kích thước khi click
            transition={{ type: "spring", stiffness: 300 }} // Hiệu ứng chuyển động
          >
            {collapsed ? (
              <HiOutlineQueueList className="w-6 h-6 text-fontColor" />
            ) : (
              <MdMenuOpen className="w-6 h-6 text-fontColor" />
            )}
          </motion.div>
          <div className="flex items-center mr-[78.2px]">
            <Image
              src={mstLogo.src}
              alt="MST Logo"
              width={24}
              height={24}
              className="mr-3"
            />
            <span className="text-center text-fontColor text-[12px] not-italic font-bold leading-normal tracking-[2.4px] uppercase mr-1">
              mst
            </span>
            <span className="text-center text-fontColor text-[12px] not-italic font-normal leading-normal tracking-[2.4px] uppercase">
              keyword
            </span>
          </div>
          <div className="flex items-center px-6 py-1 bg-inputBackground">
            <div className="flex items-center h-[40px]">
              <CiSearch className="w-[30px] h-[30px] mr-[12px] text-fontColor" />
              <input
                className="border text-fontColor bg-transparent  border-none focus:border-transparent focus:ring-0 outline-none w-[300px]"
                placeholder="Tìm kiếm chủ đề theo tên"
              />
              <div className="w-[1px] h-2/3 bg-[#E3E5E5]  mx-[12px]"></div>
              <MultipleSelect
                data={data}
                selected={[]}
                title="Chủ đề"
                className="relative w-[400px] text-fontColor"
              />
            </div>
          </div>
        </div>
        {/* Thông báo */}
        <div className="flex items-center relative px-2 bg-inputBackground rounded-lg cursor-pointer">
          <NotificationPopover />
        </div>
      </div>
    </div>
  );
};

export default Header;
