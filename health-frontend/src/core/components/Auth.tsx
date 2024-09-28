"use client";
import { isEmpty } from "lodash";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CONST from "../services/const";
import { setConfigAxios } from "../services/fetch";
import { useAppDispatch } from "../services/hook";
import { AppAction } from "./AppSlice";
import { pathPrivateRouter } from "../services/configPrivateRouter";

// Hàm giải mã token JWT
function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload); // Trả về đối tượng JSON đã giải mã
  } catch (error) {
    console.error("Invalid token format:", error);
    return null;
  }
}

function Auth(props: any) {
  const [initial, setInitial] = useState(false);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const getCustomer = () => {
    dispatch(AppAction.showLoading());
    dispatch(AppAction.hideLoading());
  };

  const checkPrivateRouter = (url: string, userRole: string) => {
    const matchRoute = pathPrivateRouter.find((route) => url.startsWith(route.path));

    if (matchRoute) {
      // Nếu có roles được định nghĩa, kiểm tra role của người dùng
      if (matchRoute.roles && !matchRoute.roles.includes(userRole)) {
        return false;
      }
    }

    return true;
  };

  const checkAuth = () => {
    try {
      const accessToken = localStorage.getItem(CONST.STORAGE.ACCESS_TOKEN);

      if (!accessToken || isEmpty(accessToken)) {
        setInitial(true); // Không xác thực được, tiếp tục hiển thị component
        return;
      }

      const decodedToken = decodeToken(accessToken);
      if (decodedToken) {
        const userRole = decodedToken.role;

        // Kiểm tra quyền truy cập của người dùng
        const isAuthorized = checkPrivateRouter(pathname, userRole);

        if (!isAuthorized) {
          window.location.href = "/404"; // Chuyển hướng nếu không có quyền truy cập
        } else {
          setConfigAxios(accessToken);
          getCustomer();
        }
      }

      setInitial(true); // Đã kiểm tra xong xác thực
    } catch (error) {
      console.error("Error in checkAuth:", error);
      setInitial(true); // Xử lý lỗi nếu có vấn đề xảy ra
    }
  };

  return <>{initial ? props?.children : <></>}</>;
}

export default Auth;
