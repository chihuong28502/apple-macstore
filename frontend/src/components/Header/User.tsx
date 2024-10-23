"use client";
import _ from "lodash";
import { Avatar, ConfigProvider, Dropdown, MenuProps } from "antd";
import { useTheme } from "next-themes";
import { FiUser } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/core/services/hook";
import { AuthActions, AuthSelectors } from "@/modules/auth/slice";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { TbLogout } from "react-icons/tb";

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
              {/* <div className="size-10 min-w-10 min-h-10 max-w-10 max-h-10">
                <img src={auth?.snippet?.thumbnails?.default?.url} alt="" className="rounded-full w-full h-full object-cover" />
              </div> */}
              <span>{auth?.email}</span>
            </div>
          ),
          key: "0",
        },
        {
          label: (
            <div
              className="flex items-center gap-1 text-fontColor cursor-pointer "
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
            colorBgElevated: resolvedTheme === "dark" ? "#4b4b4b" : "#fff",
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
        <div className="cursor-pointer p-1.5 pl-0">
          <FiUser className="size-5" />
        </div>
      </Dropdown>
    </ConfigProvider>
  );
};

export default User;
