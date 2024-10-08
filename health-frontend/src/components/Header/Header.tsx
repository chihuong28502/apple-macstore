"use client";

import { SVGLogo } from "@/asset/svg";
import NotificationPopover from "@/components/NotificationPopover/NotificationPopover";
import { motion } from "framer-motion";
import React from "react";
import { HiOutlineQueueList } from "react-icons/hi2";
import { MdMenuOpen } from "react-icons/md";
import SearchComponent from "../Search/Search";
import SelectLanguage from "../Select/SelectLanguage";
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
    <div className="p-6 bg-layout z-20">
      <div className="h-12 flex md:justify-between justify-end">
        <div className="h-full flex flex-grow ">
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
          <div className="flex items-center mr-11">
            <SVGLogo className="text-fontColor" width={150} />
          </div>
          <div className="flex flex-grow items-center justify-end lg:justify-between">
            <div className="w-full max-w-lg  xl:max-w-3xl mx-auto px-4 hidden lg:block">
              <SearchComponent />
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden md:block ">
                <SelectLanguage />
              </div>
              <NotificationPopover />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
