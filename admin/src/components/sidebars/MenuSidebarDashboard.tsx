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
        <Tooltip title="Dashboard" placement="right">
          <div className="flex items-center w-full h-full cursor-pointer">
            <MdDashboardCustomize />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush(""),
    },
    {
      key: "/product",
      icon: (
        <Tooltip title="Products" placement="right">
          <div className="w-full">
            <FaShirt />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush("/product"),
    },
    {
      key: "/user",
      icon: (
        <Tooltip title="Users" placement="right">
          <div className="w-full">
            <FaUser className="flex justify-center" />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush("/user"),
    },
    {
      key: "/category",
      icon: (
        <Tooltip title="Categories" placement="right">
          <div className="w-full">
            <FaCalculator />
          </div>
        </Tooltip>
      ),
      onClick: () => handleOnclickPush("/category"),
    },
    {
      key: "/promotion",
      icon: (
        <Tooltip title="Promotions" placement="right">
          <div>
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
          mode="inline" 
          className="bg-transparent"
          inlineCollapsed={collapsed}
          items={items}
        />
      </ConfigProvider>
      <div
        className={cn(
          "flex items-center h-10 my-0.5 z-0 justify-center",
          collapsed ? "justify-center" : "justify-center"
        )}
      >
        <DarkModeSwitch />
      </div>
    </>
  );
};

export default MenuSidebarDashboard;
