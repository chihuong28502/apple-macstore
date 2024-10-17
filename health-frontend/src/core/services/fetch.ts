import axios, { AxiosInstance } from "axios";
import { AuthRequest } from "./auth";
import CONST from "./const";
import Cookies from "js-cookie";
import { getCookie } from "@/hooks/Cookies";
import { locales } from "@/constants/i18n.config";

export interface SysResponse {
  success: boolean;
  data?: any;
  message?: any;
  error?: any;
}

export let AxiosClient = axios.create({
  baseURL: CONST.REQUEST.API_ADDRESS,
  timeout: CONST.REQUEST.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const registerInterceptorsRequest = (clientInstance: AxiosInstance) => {
  clientInstance.interceptors.request.use(
    async (config: any) => {
      try {
        let accessToken = Cookies.get("accessToken");
        if (accessToken && accessToken !== "undefined") {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          // Kiểm tra refreshToken trong cookies
          const refreshToken = getCookie("refreshToken");
          if (refreshToken && refreshToken !== "undefined") {
            try {
              await axios.post(
                `${CONST.REQUEST.API_ADDRESS}/auth/refresh`,
                { refreshToken: refreshToken }, { withCredentials: true },
              )
            } catch (err) {
              console.error("Error refreshing token:", err);
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              window.location.href = `${locales}/auth/login`;
            }
          } else {
            // Xóa Authorization nếu không có token hợp lệ
            delete config.headers.Authorization;
          }
        }
        await new Promise((resolve: any) => setTimeout(resolve, 1));
      } catch (error) {
        console.error("Error in request interceptor:", error);
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};


registerInterceptorsRequest(AxiosClient);

const registerInterceptorResponse = (clientInstance: AxiosInstance) => {
  clientInstance.interceptors.response.use(
    (response: any) => {
      const res = response?.data || response;
      if (res?.status && res?.message) {
        if (res?.status === "error") {
          console.error(res.message);
        } else if (res?.status === "success") {
          console.log(res.message);
        }
      }
      return res;
    },
    async function (error: any) {
      const originalRequest = error?.config;
      if (error?.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        const refreshToken = getCookie("refreshToken");
        if (refreshToken) {
          try {
            await axios.post(
              `${CONST.REQUEST.API_ADDRESS}/auth/refresh`,
              { refreshToken: refreshToken }, { withCredentials: true },
            )
          } catch (error) {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            window.location.href = `${locales}/auth/login`;
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
registerInterceptorResponse(AxiosClient);

const setConfigAxiosClient = (
  accessToken: any,
  clientAxiosInstance: AxiosInstance
) => {
  clientAxiosInstance.defaults.headers.common = {
    "Content-Type": "application/json",
  };
  clientAxiosInstance.defaults.timeout = CONST.REQUEST.REQUEST_TIMEOUT;
  if (accessToken) {
    clientAxiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }
};

export function setConfigAxios(accessToken: any) {
  setConfigAxiosClient(accessToken, AxiosClient);
}

const post = (url: string, data?: any, config = {}) => {
  return AxiosClient.post(url, data, config);
};

const get = (url: string, config = {}) => {
  return AxiosClient.get(url, config);
};

const put = (url: string, data?: any, config = {}) => {
  return AxiosClient.put(url, data, config);
};

const patch = (url: string, data?: any, config = {}) => {
  return AxiosClient.patch(url, data, config);
};

const del = (url: string, config = {}) => {
  return AxiosClient.delete(url, config);
};

const MSTFetch = {
  post,
  get,
  put,
  patch,
  delete: del,
};

export default MSTFetch;
