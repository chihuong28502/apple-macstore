"use client";
import { ConfigProvider, Dropdown, MenuProps } from "antd";
import _ from "lodash";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "@/core/services/hook";
import { AuthActions, AuthSelectors } from "@/modules/auth/slice";

const User = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const auth = useAppSelector(AuthSelectors.user);
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useTheme();
  const handleLogout = () => {
    dispatch(
      AuthActions.logout({})
    );
    setIsOpen(false);
  };

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
