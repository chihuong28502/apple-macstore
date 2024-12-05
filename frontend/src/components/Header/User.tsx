"use client";
import { ConfigProvider, Dropdown, MenuProps, message } from "antd";
import _ from "lodash";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "@/core/services/hook";
import { AuthActions, AuthSelectors } from "@/modules/auth/slice";
import { AppAction, AppSelector } from "@/core/components/AppSlice";
import { FaExchangeAlt } from "react-icons/fa";

const User = () => {
  const [isOpen, setIsOpen] = useState(false);
  const route = useRouter();
  const auth = useAppSelector(AuthSelectors.user);
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useTheme();
  const handleLogout = () => {
    dispatch(
      AuthActions.logout({
        onSuccess: () => {
          message.success("Đăng xuất thành công");
          route.push('/')
        },
      })
    );
    setIsOpen(false);
  };
  const handleOpenModalChangePassword = () => {
    dispatch(AppAction.showModalChangePassword());
  }
  const getMenuItems = (): MenuProps["items"] => {
    if (_.isEmpty(auth)) {
      return [
        {
          label: "123",
          key: "login",
        },
      ];
    } else {
      return [
        {
          label: (
            <div className="text-fontColor flex flex-col items-center justify-center ">
              <span>{auth?.email}</span>
            </div>
          ),
          key: "0",
        },
        {
          label: (
            <div
              className="flex items-center gap-1 text-fontColor cursor-pointer w-full"
              onClick={handleOpenModalChangePassword}
            >
              <FaExchangeAlt /> <span>Đổi pass</span>
            </div>
          ),
          key: "changePassword",
        },
        {
          label: (
            <div
              className="flex items-center text-fontColor cursor-pointer "
              onClick={handleLogout}
            >
              <TbLogout /> <span>Đăng xuất</span>
            </div>
          ),
          key: "2",
        },
      ];
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Dropdown: {
            colorBgElevated: resolvedTheme === "dark" ? "#fff" : "#fff",
          },
        },
      }}
    >
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        menu={{ items: getMenuItems() }}
        trigger={["click"]}
      >
        <div className="cursor-pointer text-fontColor">
          <FiUser className="size-5" />
        </div>
      </Dropdown>
    </ConfigProvider>
  );
};

export default User;
