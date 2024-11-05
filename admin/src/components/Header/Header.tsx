"use client";

import Link from "next/link";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";

import { SVGLogo } from "@/asset/svg";
import NotificationPopover from "@/components/NotificationPopover/NotificationPopover";
import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";

import BtnAuth from "../headerBtnAuth/BtnAuth";
import SearchComponent from "../Search/Search";
import User from "./User";
import SideBar from "../sidebars/Sidebar";

type Props = {
  isMobile: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenMenuMobile: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  isOpenMenuMobile: boolean;
};

const Header = () => {
  const auth = useAppSelector(AuthSelectors.user);
  return (
    <div className="p-6 bg-layout z-20">
      <div className="h-12 flex md:justify-between justify-end">
        <div className="h-full flex flex-grow justify-between ">
          <Link href={"/"} className="flex items-center mr-11">
            <SVGLogo className="text-fontColor" />
          </Link>
          <div className="flex items-center gap-5">
            {auth && <User />}
            {!auth && <BtnAuth title={"Đăng nhập"} icon={FaRegUserCircle} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
