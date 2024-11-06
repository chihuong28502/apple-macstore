"use client";
import type { MenuProps } from "antd";
import { ConfigProvider, Menu, Tooltip } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { FaCalculator, FaPowerOff, FaUser } from "react-icons/fa";
import { FaShirt } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";

import { cn } from "@/lib/utils";

import DarkModeSwitch from "../DarkModeSwitch";

type MenuItem = Required<MenuProps>["items"][number];

type Props = {
  collapsed?: boolean;
};

const MenuSidebarDashboard = ({ collapsed = false }: Props) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleOnclickPush = (path: string) => {
    router.push(path);
  };

  const items: MenuItem[] = [
    {
      key: "",
      icon: (
        <Tooltip title="Dashboard" placement="bottom">
          <div className="flex items-center w-full px-2 h-full cursor-pointer">
            <MdDashboardCustomize />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush(""),
    },
    {
      key: "/product",
      icon: (
        <Tooltip title="Products" placement="bottom">
          <div className="w-full px-2">
            <FaShirt />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush("/product"),
    },
    {
      key: "/user",
      icon: (
        <Tooltip title="Users" placement="bottom">
          <div className="w-full px-2">
            <FaUser className="flex justify-center" />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush("/user"),
    },
    {
      key: "/category",
      icon: (
        <Tooltip title="Categories" placement="bottom">
          <div className="w-full px-2">
            <FaCalculator />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush("/category"),
    },
    {
      key: "/promotion",
      icon: (
        <Tooltip title="Promotions" placement="bottom">
          <div className="w-full px-2">
            <FaPowerOff />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush("/promotion"),
    },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemSelectedColor: "#FF8900",
              itemSelectedBg: resolvedTheme === "dark" ? "#4b4b4b" : "#fff",
              itemHoverBg: resolvedTheme === "dark" ? "#333" : "#fdfdfd",
              itemActiveBg: " #139dffa6",
              itemColor: resolvedTheme === "dark" ? "#fff" : "#000",
              itemHoverColor: resolvedTheme === "dark" ? "#fff" : "#000",
              itemMarginInline: 8,
            },
          },
        }}
      >
        <Menu
          selectedKeys={[pathname]}
          mode="horizontal" 
          className="bg-transparent"
          inlineCollapsed={collapsed}
          items={items}
        />
      </ConfigProvider>
    </>
  );
};

export default MenuSidebarDashboard;
