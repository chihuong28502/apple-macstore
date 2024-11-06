"use client";
import { motion } from "framer-motion";

import MenuSidebarDashboard from "./MenuSidebarDashboard";

type Props = {
  collapsed: boolean;
};
const SideBar = ({ collapsed }: Props) => {
  return (
    // <motion.div
    //   className="h-full bg-layout pt-3 overflow-y-auto"
    //   initial={{ width: 80 }}
    //   style={{
    //     overflow: "hidden", 
    //   }}
    // >
    //     <MenuSidebarDashboard collapsed={collapsed} />
    // </motion.div>
    
    <MenuSidebarDashboard collapsed={collapsed} />
  );
};

export default SideBar;
