"use client";
import { AuthSelectors } from "@/modules/auth/slice";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import MenuSidebarDashboard from "./MenuSidebarDashboard";

type Props = {
  collapsed: boolean;
};
const SideBar = ({ collapsed }: Props) => {
  return (
    <motion.div
      className="h-full bg-layout pt-3 overflow-y-auto"
      initial={{ width: 80 }}
      style={{
        overflow: "hidden", 
      }}
    >
        <MenuSidebarDashboard collapsed={collapsed} />
    </motion.div>
  );
};

export default SideBar;
