"use client";
import { motion } from "framer-motion";
import MenuSidebar from "./Menu";
type Props = {
  isOpenMenuMobile: boolean;
  toggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};
const SidebarMobile = ({ isOpenMenuMobile, toggleSidebar }: Props) => {
  const sidebarVariants = {
    open: { translateX: 0 },
    closed: { translateX: "-100%" },
  };

  return (
    <>
      <motion.div
        initial="closed"
        animate={isOpenMenuMobile ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-4/5 h-full bg-layout z-50 flex "
      >
        <div className="flex-grow space-y-5 p-4 overflow-y-auto">
          <MenuSidebar />
        </div>
      </motion.div>

      {isOpenMenuMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => toggleSidebar(false)}
        ></div>
      )}
    </>
  );
};

export default SidebarMobile;
