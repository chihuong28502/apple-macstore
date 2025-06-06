'use client'
import { cleanupSocketEvent, listenToSocketEvent } from "@/lib/socket/emit.socket";
import { getSocket } from "@/lib/socket/socket";
import { AuthSelectors } from "@/modules/auth/slice";
import { NotifyActions, NotifySelectors } from "@/modules/notify/slice";
import { Badge, ConfigProvider, Popover } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const NotificationList = ({ notifications }: any) => (
  <div className="divide-y divide-divideColor ">
    {notifications?.map((item: any) => (
      <div key={item.title} className="py-4 first:pt-2 last:pb-2 hover:bg-hoverBg transition-colors duration-200 ease-in-out">
        <div className="flex items-center space-x-4 px-4">
          <div className="flex-shrink-0"><FaRegBell className="w-5 h-5 text-green-400" /></div>
          <div className="flex-grow">
            <p className="text-fontColor font-medium text-sm mb-1">
              {item.title}
            </p>
            {item.description && (
              <p className="text-fontColor text-xs mb-1">{item.description}</p>
            )}
            <p className="text-fontColor text-xs">2 giờ trước</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NotificationPopover = () => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const notificationss = useSelector(NotifySelectors.notify);
  const user = useSelector(AuthSelectors.user);
  const [notifications, setNotifications] = useState(notificationss);
  useEffect(() => {
    if (!notificationss) {
      dispatch(NotifyActions.fetchNotifyById(user?._id));
    } else {
      setNotifications(notificationss);
    }
  }, [notificationss, dispatch, user]);
  // useEffect(() => {
  //   // Lắng nghe sự kiện thông báo
  //   listenToSocketEvent(socket, "notification", (notification) => {
  //     setNotifications((prev: any) => [...prev, notification]);
  //   });
  //   return () => cleanupSocketEvent(socket, "notification");
  // }, [socket]);
  const { resolvedTheme } = useTheme();
  const content = (
    <div className="w-80 bg-inputBackground rounded-lg shadow-xl shadow-gray-300/50 overflow-hidden cursor-pointer">
      <div className="px-2 py-2 border-b border-gray-700 flex justify-between items-center bg-inputBackground">
        <h3 className="text-fontColor font-semibold text-lg">
          Thông báo mới nhận
        </h3>
      </div>
      <div className="shadow-[15px_15px_30px_#bebebe,-15px_-15px_1px_#ffffff] max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <NotificationList notifications={notifications} />
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
      color={resolvedTheme === "dark" ? "#fff" : "#fff"}
    >
      <div className="flex items-center  rounded-lg cursor-pointer ">
        <ConfigProvider
          theme={{
            components: {
              Badge: {
                dotSize: 6,
              },
            },
          }}
        >
          <Badge
            style={{ fontSize: '0.8rem', fontWeight: 650, width: '16px', height: '16px', lineHeight: '16px', padding: '0' }}
            count={notifications?.length} overflowCount={99} color="red">
            <IoNotificationsOutline className="size-5 text-fontColor" />
          </Badge>
        </ConfigProvider>
      </div>
    </Popover>
  );
};

export default NotificationPopover;
