"use client";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ProductActions, ProductSelectors } from "@/modules/product/slice";
import type { MenuProps } from "antd";
import { ConfigProvider, Menu } from "antd";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect } from "react";
import { FaShirt } from "react-icons/fa6";
import { LuHome } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import DarkModeSwitch from "../DarkModeSwitch";
import SearchComponent from "../Search/Search";
import SelectLanguage from "../Select/SelectLanguage";
type MenuItem = Required<MenuProps>["items"][number];

type Props = {
  collapsed?: boolean;
};

const MenuSidebar = ({ collapsed = false }: Props) => {
  const { resolvedTheme } = useTheme();
  const dispatch = useDispatch();
  const allCategory = useSelector(ProductSelectors.categories);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(ProductActions.fetchCategories());
    };
    fetchData();
  }, [dispatch]);
  const translations = useTranslations("product");
  const translationsHome = useTranslations("home");
  const items: MenuItem[] = [
    {
      key: "home",
      icon: <LuHome />,
      label: <Link href={`/`}>{translationsHome("home")}</Link>,
    },
    {
      key: "product",
      icon: <FaShirt />,
      label: <Link href={`/product`}> {translations("title")} </Link>
    },
  ];

  return (
    <>
      <div className="w-full mx-auto block lg:hidden my-3">
        <SearchComponent />
      </div>
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
      <div className="flex items-center justify-start z-20 md:hidden">
        <SelectLanguage />
      </div>
      <div
        className={cn(
          "flex items-center h-10 my-0.5 z-0",
          collapsed ? "justify-center" : "justify-start pl-6"
        )}
      >
        <DarkModeSwitch />
      </div>
    </>
  );
};

export default MenuSidebar;
