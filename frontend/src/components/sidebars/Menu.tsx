"use client";
import type { MenuProps } from "antd";
import { ConfigProvider, Menu, Tooltip } from "antd";
import Link from "next/link";
import {  usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FaShirt } from "react-icons/fa6";
import { LuHome } from "react-icons/lu";

import { cn } from "@/lib/utils";

import DarkModeSwitch from "../DarkModeSwitch";

type MenuItem = Required<MenuProps>["items"][number];

type Props = {
  collapsed?: boolean;
};

const MenuSidebar = ({ collapsed = false }: Props) => {
  const { resolvedTheme } = useTheme();
  const currentPath = usePathname(); 

  const items: MenuItem[] = [
    {
      key: "home",
      icon: <LuHome />,
      label: (
        <Tooltip title="Home" placement="right">
          <Link href={`/`}></Link>
        </Tooltip>
      ),
    },
    {
      key: "product",
      icon: <FaShirt />,
      label: (
        <Tooltip title="Product" placement="right">
          <Link href={`/product`}></Link>
        </Tooltip>
      ),
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
            },
          },
        }}
      >
        <Menu
          selectedKeys={[currentPath === "/" ? "home" : currentPath.split('/')[1]]} 
          defaultOpenKeys={["sub1"]}
          mode="inline"
          className="bg-transparent "
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

export default MenuSidebar;
