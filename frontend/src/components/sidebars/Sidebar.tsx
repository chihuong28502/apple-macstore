"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import MenuSidebar from "./Menu";

type Props = {
  collapsed: boolean;
};
const SideBar = ({ collapsed }: Props) => {
  const pathname = usePathname();
  useEffect(() => {}, [pathname]);
  return (
    <motion.div
      // className="h-full bg-layout pt-3 overflow-y-auto"
      // initial={{ width: 80 }}
      style={{
        overflow: "hidden", // Ẩn phần bị cắt trong quá trình chuyển đổi
      }}
    >
        {/* <MenuSidebar collapsed={collapsed} /> */}
    </motion.div>
  );
};

export default SideBar;
