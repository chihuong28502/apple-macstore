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
            href={"/"}
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
