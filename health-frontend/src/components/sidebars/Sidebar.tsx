import { cn } from "@/lib/utils";
import {
  AppstoreOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ConfigProvider, Menu } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import { TbLogout } from "react-icons/tb";
import DarkModeSwitch from "../DarkModeSwitch";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "user", icon: <PieChartOutlined />, label: "Trang chủ" },
  { key: "1", icon: <PieChartOutlined />, label: "Option 1" },
  { key: "2", icon: <DesktopOutlined />, label: "Option 2" },
  { key: "3", icon: <TbLogout />, label: "Đăng xuất" },
  {
    key: "sub1",
    label: "Navigation One",
    icon: <MailOutlined />,
    children: [
      { key: "5", label: "Option 5" },
      { key: "6", label: "Option 6" },
      { key: "7", label: "Option 7" },
      { key: "8", label: "Option 8" },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <AppstoreOutlined />,
    children: [
      { key: "9", label: "Option 9" },
      { key: "10", label: "Option 10" },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          { key: "11", label: "Option 11" },
          { key: "12", label: "Option 12" },
        ],
      },
    ],
  },
];
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
      <motion.div
        className={cn("flex items-center gap-2")}
        animate={{
          justifyContent: collapsed ? "center" : "flex-start",
          paddingLeft: collapsed ? 0 : "1.5rem",
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
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
          transition={{ delay: 5 }}
          className={cn("text-fontColor truncate ", collapsed && "hidden")}
        >
          Nguyễn Huy Tới
        </motion.p>
      </motion.div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemSelectedColor: "#FF8900",
              itemSelectedBg: "transparent",
            },
          },
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          className="bg-transparent [&>li]:text-fontColor [&>li>div]:text-fontColor [&>li>ul>li]:text-fontColor"
          inlineCollapsed={collapsed}
          items={items}
        />
      </ConfigProvider>
      <div
        className={cn(
          "flex items-center ",
          collapsed ? "justify-center" : "justify-start pl-6"
        )}
      >
        <DarkModeSwitch />
      </div>
    </motion.div>
  );
};

export default SideBar;
