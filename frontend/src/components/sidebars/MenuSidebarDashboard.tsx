"use client";
import { cn } from "@/lib/utils";
import type { MenuProps } from "antd";
import { ConfigProvider, Menu, Tooltip } from "antd";
import { useTheme } from "next-themes";
import { FaShirt } from "react-icons/fa6";
import { LuHome } from "react-icons/lu";
import DarkModeSwitch from "../DarkModeSwitch";
import { MdDashboardCustomize } from "react-icons/md";
import Link from "next/link";
type MenuItem = Required<MenuProps>["items"][number];

type Props = {
  collapsed?: boolean;
};

const MenuSidebarDashboard = ({ collapsed = false }: Props) => {
  const { resolvedTheme } = useTheme();
  const items: MenuItem[] = [
    {
      key: "Dashboard",
      icon: (
          <MdDashboardCustomize />
      ),
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
              itemSelectedColor: "#FF8900", // Màu khi được chọn
              itemSelectedBg: resolvedTheme === "dark" ? "#4b4b4b" : "#fff",
              itemHoverBg: resolvedTheme === "dark" ? "#333" : "#fdfdfd",
              itemActiveBg: " #139dffa6", // Màu khi đang active
              itemColor: resolvedTheme === "dark" ? "#fff" : "#000",
              itemHoverColor: resolvedTheme === "dark" ? "#fff" : "#000",
            },
          },
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
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

export default MenuSidebarDashboard;
