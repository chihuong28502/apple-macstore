import { Link } from "@/i18n/routing";
import { Badge, ConfigProvider, Popover } from "antd";
import { useTheme } from "next-themes";
import { FaRegBell } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";

const notifications = [
  {
    icon: <FiFileText className="w-5 h-5 text-green-400" />,
    title: "Nói đi bạn ơi Shoppe nghe hết",
    description: "Tặng ngay mã Freeship lên đến 35k",
    time: "2 giờ trước",
    isRead: true,
  },
  {
    icon: <FaRegBell className="w-5 h-5 text-green-400" />,
    title: "Combo ưu đãi tới 45k dành riêng cho bạn",
    description: "Chỉ còn 1 ngày nữa thôi",
    time: "1 ngày trước",
    isRead: false,
  },
];

const NotificationList = () => (
  <div className="divide-y divide-divideColor">
    {notifications.map((item) => (
      <div
        key={item.title}
        className="py-4 first:pt-2 last:pb-2 hover:bg-hoverBg transition-colors duration-200 ease-in-out"
      >
        <div className="flex items-start space-x-4 px-4">
          <div className="flex-shrink-0">{item.icon}</div>
          <div className="flex-grow">
            <p className="text-fontColor font-medium text-sm mb-1">
              {item.title}
            </p>
            {item.description && (
              <p className="text-fontColor text-xs mb-1">{item.description}</p>
            )}
            <p className="text-fontColor text-xs">{item.time}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NotificationPopover = () => {
  const { resolvedTheme } = useTheme();
  const content = (
    <div className="w-80 bg-inputBackground rounded-lg shadow-xl shadow-gray-300/50 dark:shadow-gray-800/50  overflow-hidden cursor-pointer">
      <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center bg-inputBackground">
        <h3 className="text-fontColor font-semibold text-lg">
          Thông báo mới nhận
        </h3>
        <Link
          href="#"
          className="text-fontColor text-sm hover:text-fontColor transition-colors duration-200"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="py-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <NotificationList />
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      overlayInnerStyle={{ padding: 0 }}
      className=""
      color={resolvedTheme === "dark" ? "#4b4b4b" : "#fff"}
    >
      <div className="flex items-center p-3 bg-inputBackground rounded-lg cursor-pointer ">
        <ConfigProvider
          theme={{
            components: {
              Badge: {
                dotSize: 8,
              },
            },
          }}
        >
          <Badge dot={true} size="default" title="Thông báo" offset={[-3, 2]}>
            <IoNotificationsOutline className="size-5 text-fontColor" />
          </Badge>
        </ConfigProvider>
      </div>
    </Popover>
  );
};

export default NotificationPopover;
