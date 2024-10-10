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
      label: <Link href={`/product`}> {translations("title")} </Link>,
      children: allCategory?.map((cat) => ({
        key: cat._id,
        label: <Link href={`/product/${cat.name}`}> {cat.name} </Link>,
      })),
    },
  ];

  return (
    <>
      <motion.div
        className={cn("flex items-center gap-2")}
        animate={{
          justifyContent: collapsed ? "center" : "flex-start",
          paddingLeft: collapsed ? 0 : "1.5rem",
        }}
      >
        <Image
          src={
            "https://i.pinimg.com/564x/11/62/0b/11620baf1c1d5257215c83c033cc9496.jpg"
          }
          width={40}
          height={40}
          alt="Avatar"
          className="rounded-full max-w-10 max-h-10 min-w-10 min-h-10"
        />
        <motion.p
          animate={{
            x: collapsed ? -10 : 4,
          }}
          className={cn("text-fontColor truncate ", collapsed && "hidden")}
        >
          Nguyễn Chí Hưởng
        </motion.p>
      </motion.div>
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
