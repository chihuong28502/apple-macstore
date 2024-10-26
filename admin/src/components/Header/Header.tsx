"use client";

import { SVGLogo } from "@/asset/svg";
import NotificationPopover from "@/components/NotificationPopover/NotificationPopover";
import { FaRegUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import React from "react";
import { HiOutlineQueueList } from "react-icons/hi2";
import { MdMenuOpen } from "react-icons/md";
import SearchComponent from "../Search/Search";
import BtnAuth from "../headerBtnAuth/BtnAuth";
import { cn } from "@/lib/utils";
import _ from "lodash";
import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import User from "./User";
import Link from "next/link";

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
  const auth = useAppSelector(AuthSelectors.user);
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
          <Link
            href={ "/"}
            className="flex items-center mr-11"
          >
            <SVGLogo className="text-fontColor" />
          </Link>
          <div className="flex flex-grow items-center justify-end lg:justify-between">
            <div className="w-full max-w-lg  xl:max-w-3xl mx-auto px-4 block">
              <SearchComponent />
            </div>
            <div className="flex items-center gap-5">
              {auth && <User />}
              {!auth && <BtnAuth title={"Đăng nhập"} icon={FaRegUserCircle} />}
              {auth && <NotificationPopover />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
