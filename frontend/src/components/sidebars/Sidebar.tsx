import { motion } from "framer-motion";
import MenuSidebar from "./Menu";
import { useEffect } from "react";
import { usePathname } from "@/i18n/routing";

type Props = {
  collapsed: boolean;
};
const SideBar = ({ collapsed }: Props) => {
  const pathname = usePathname();
  const small = 80;
  const large = 256;
  useEffect(() => {
    
  }, [pathname]);
  return (
    <motion.div
      className="h-full bg-layout pt-3 overflow-y-auto"
      initial={{ width: 80 }}
      style={{
        overflow: "hidden", // Ẩn phần bị cắt trong quá trình chuyển đổi
      }}
    >
      <MenuSidebar collapsed={collapsed} />
    </motion.div>
  );
};

export default SideBar;
