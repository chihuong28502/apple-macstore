"use client";

import { useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import BtnAuth from "../headerBtnAuth/BtnAuth";
import SideBar from "../sidebars/Sidebar";
import User from "./User";

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
    <div className="p-3 bg-layout z-20 overflow-hidden">
      <div className="h-12 flex md:justify-between justify-end">
        <div className="h-full flex flex-grow justify-center">
          <SideBar collapsed={false} />
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
