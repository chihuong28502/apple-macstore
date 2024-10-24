"use client";
import { motion } from "framer-motion";
import MenuSidebar from "./Menu";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { AuthSelectors } from "@/modules/auth/slice";
import MenuSidebarDashboard from "./MenuSidebarDashboard";

type Props = {
  collapsed: boolean;
};
const SideBar = ({ collapsed }: Props) => {
  const auth = useSelector(AuthSelectors.user);
  const pathname = usePathname();
  const small = 80;
  const large = 256;
  useEffect(() => {}, [pathname]);
  return (
    <motion.div
      className="h-full bg-layout pt-3 overflow-y-auto"
      initial={{ width: 80 }}
      style={{
        overflow: "hidden", // Ẩn phần bị cắt trong quá trình chuyển đổi
      }}
    >
      {pathname.includes("dashboard") ? (
        <MenuSidebarDashboard collapsed={collapsed} />
      ) : (
        <MenuSidebar collapsed={collapsed} />
      )}
    </motion.div>
  );
};

export default SideBar;
