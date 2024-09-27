"use client";
import { isPrivateRouter } from "@/app/utils/units";
import { CustomerActions } from "@/modules/customer/slice";
import { isEmpty } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pathPrivateRouter } from "../services/configPrivateRouter";
import CONST from "../services/const";
import { setConfigAxios } from "../services/fetch";
import { useAppDispatch } from "../services/hook";
import { AppAction } from "./AppSlice";

function Auth(props: any) {
  const [initial, setInitial] = useState(false);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    checkAuth();
    getSetting();
  }, [pathname]);

  const getSetting = () => {};

  const getCustomer = () => {
    dispatch(AppAction.showLoading());
    dispatch(CustomerActions.getCustomer({}));
    dispatch(AppAction.hideLoading());
  };
  const checkPrivateRouter = (url: string) => {
    const paths = url.split("/").filter(Boolean);
    return isPrivateRouter(paths, pathPrivateRouter);
  };
  const checkAuth = () => {
    try {
      const accessToken = localStorage.getItem(CONST.STORAGE.ACCESS_TOKEN);
      // dispatch(AppAction.showLoading());
      if (isEmpty(accessToken)) {
        if (localStorage.getItem("USER_INFO")) {
          localStorage.removeItem("USER_INFO");
        }
        const isPrivate = checkPrivateRouter(pathname);
        if (isPrivate) {
          router.push("/404");
        } else {
          setInitial(true);
          dispatch(AppAction.hideLoading());
        }
      } else {
        setConfigAxios(accessToken);
        getCustomer();
        if (pathname === "/auth") {
          router.push("/");
        }
        setInitial(true);
        dispatch(AppAction.hideLoading());
      }
    } catch (error) {
      // setInitial(true);
    }
  };

  return <>{initial ? props?.children : <></>}</>;
}

export default Auth;
