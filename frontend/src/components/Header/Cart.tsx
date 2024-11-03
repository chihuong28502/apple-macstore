"use client";
import { ConfigProvider, Dropdown, MenuProps } from "antd";
import _ from "lodash";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCartOutline } from "react-icons/io5";

import { useAppDispatch, useAppSelector } from "@/core/services/hook";
import { AuthSelectors } from "@/modules/auth/slice";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const auth = useAppSelector(AuthSelectors.user);
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useTheme();


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
          label: '1st menu item',
          key: '1',
        },
        {
          label: '2nd menu item',
          key: '2',
        },
        {
          label: '3rd menu item',
          key: '3',
        },
        {
          label: (
            <div className="text-fontColor flex flex-col items-center justify-center">
              {/* <div className="size-10 min-w-10 min-h-10 max-w-10 max-h-10">
                <img src={auth?.snippet?.thumbnails?.default?.url} alt="" className="rounded-full w-full h-full object-cover" />
              </div> */}
              <span>{auth?.email}</span>
            </div>
          ),
          key: "0",
        }
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
        placement="bottom"
        open={isOpen}
        onOpenChange={setIsOpen}
        menu={{ items: getMenuItems() }}
        trigger={["click"]}
      >
        <div className="cursor-pointer p-1.5 pl-0 text-fontColor">
          <IoCartOutline className="size-5" />
        </div>
      </Dropdown>
    </ConfigProvider>
  );
};

export default Cart;
