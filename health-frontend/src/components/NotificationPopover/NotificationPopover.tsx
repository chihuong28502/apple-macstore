import { FiFileText } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import { Popover } from "antd";
import { SVGIconRedDot } from "@/asset/svg";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "@/i18n/routing";

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
  const content = (
    <div className="w-80 bg-notification rounded-lg shadow-xl shadow-gray-300/50 dark:shadow-gray-800/50  overflow-hidden cursor-pointer">
      <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center bg-notification">
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
    >
      <IoNotificationsOutline className="text-fontColor size-8" />
      <SVGIconRedDot className="absolute top-[9px] right-[11px]" />
    </Popover>
  );
};

export default NotificationPopover;
