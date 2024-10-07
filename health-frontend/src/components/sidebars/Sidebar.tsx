import { motion } from "framer-motion";
import MenuSidebar from "./Menu";

type Props = {
  collapsed: boolean;
};
const SideBar = ({ collapsed }: Props) => {
  return (
    <motion.div
      className="h-full bg-layout pt-3 overflow-y-auto"
      animate={{
        width: collapsed ? 80 : 256, // Chiều rộng khi mở/đóng
      }}
      initial={{ width: 256 }}
      transition={{
        duration: 0.4, // Thời gian chuyển đổi
        ease: [0.4, 0, 0.2, 1], // Mô phỏng easing mượt mà hơn
      }}
      style={{
        overflow: "hidden", // Ẩn phần bị cắt trong quá trình chuyển đổi
      }}
    >
      <MenuSidebar collapsed={collapsed} />
    </motion.div>
  );
};

export default SideBar;
