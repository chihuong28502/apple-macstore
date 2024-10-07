"use client";

import mstLogo from "@/asset/images/mst.png";
import Image from "next/image";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { HiOutlineQueueList } from "react-icons/hi2";
import NotificationPopover from "@/components/NotificationPopover/NotificationPopover";
import { motion } from "framer-motion";
import { MdMenuOpen } from "react-icons/md";
import MultipleSelect from "../MultipleSelect/MultipleSelect";
import SelectLanguage from "../Select/SelectLanguage";

const data = [
  { _id: 1, name: "Mưa tháng sáu" },
  { _id: 2, name: "Tiếng mưa rơi lofi cực chill" },
  { _id: 3, name: "Mưa tháng sáu Văn Mai Hương" },
  { _id: 4, name: "Video mưa đẹp" },
  { _id: 5, name: "cảnh mưa tâm trạng" },
];
type Props = {
  isMobile: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenMenuMobile: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  isOpenMenuMobile: boolean;
};
const Header = ({
  setCollapsed,
  setIsOpenMenuMobile,
  collapsed,
  isMobile,
  isOpenMenuMobile,
}: Props) => {
  const toggleCollapsed = () => {
    if (isMobile) {
      setIsOpenMenuMobile((prev: boolean) => !prev);
    } else {
      setCollapsed((prev: boolean) => !prev);
    }
  };
  return (
    <div className="p-4 bg-layout z-20">
      <div className="h-12 flex justify-between">
        <div className="h-full flex w-2/3 justify-between">
          <motion.div
            className="flex items-center p-3 bg-inputBackground rounded-lg cursor-pointer mr-3"
            onClick={toggleCollapsed}
            whileHover={{ scale: 1.05 }} // Tăng kích thước khi hover
            whileTap={{ scale: 0.95 }} // Giảm kích thước khi click
            transition={{ type: "spring", stiffness: 300 }} // Hiệu ứng chuyển động
          >
            {collapsed || isOpenMenuMobile ? (
              <HiOutlineQueueList className="size-5 text-fontColor" />
            ) : (
              <MdMenuOpen className="size-5 text-fontColor" />
            )}
          </motion.div>
          <div className="mx-2 flex items-center mr-11">
            <Image
              src={mstLogo.src}
              alt="MST Logo"
              width={24}
              height={24}
              className="mr-3"
            />
            <span className="text-center text-fontColor text-xs not-italic font-bold leading-normal tracking-[2.4px] uppercase mr-1">
              mst
            </span>
            <span className="text-center text-fontColor text-xs not-italic font-normal leading-normal tracking-[2.4px] uppercase">
              keyword
            </span>
          </div>
          <div className="flex items-center pl-6 bg-inputBackground rounded-lg w-4/5">
            <div className="flex items-center w-full relative">
              <CiSearch className="w-7 h-7 mr-3 text-fontColor" />
              <input
                className="w-full border text-fontColor bg-transparent  border-none focus:border-transparent focus:ring-0 outline-none"
                placeholder="Tìm kiếm chủ đề theo tên"
              />
              <MultipleSelect
                data={data}
                className="absolute top-0 left-0 w-full text-fontColor"
              />
            </div>
          </div>
          <SelectLanguage />
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
