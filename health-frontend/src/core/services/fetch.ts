"use client";

import axios, { AxiosInstance } from "axios";
import { AuthRequest } from "./auth";
import CONST from "./const";
import { SysStorage } from "./storage";

export interface SysResponse {
  success: boolean;
  data?: any;
  message?: any;
  error?: any;
}

// Tạo một Axios instance với cấu hình chung
export let AxiosClient = axios.create({
  baseURL: CONST.REQUEST.API_ADDRESS,
  timeout: CONST.REQUEST.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm xử lý request interceptor, áp dụng cho mọi Axios instance
const registerRequestInterceptor = (clientInstance: AxiosInstance) => {
  clientInstance.interceptors.request.use(
    (config: any) => {
      try {
        // Lấy accessToken nếu có
        const accessToken = localStorage.getItem(CONST.STORAGE.ACCESS_TOKEN);
        if (accessToken && accessToken !== "undefined") {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          // Tạo và lưu customerIdVisit nếu chưa tồn tại
          let customerIdVisit = localStorage.getItem("customerIdVisit");
          if (!customerIdVisit) {
            customerIdVisit =
              Date.now().toString(36) + Math.random().toString(36).substring(2);
            localStorage.setItem("customerIdVisit", customerIdVisit);
          }
          config.headers["x-customer-id-visit"] = customerIdVisit;
          delete config.headers.Authorization;
        }
      } catch (error) {
        console.error("Error in request interceptor:", error);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Đăng ký request interceptor cho AxiosClient
registerRequestInterceptor(AxiosClient);

// Hàm xử lý response interceptor, áp dụng cho mọi Axios instance
const registerResponseInterceptor = (clientInstance: AxiosInstance) => {
  clientInstance.interceptors.response.use(
    (response: any) => {
      const res = response?.data || response;
      return res;
    },
    async (error) => {
      const originalRequest = error?.config;

      // Xử lý lỗi 401 và tự động refresh token
      if (error?.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        const tokenStorage = SysStorage(CONST.STORAGE.ACCESS_TOKEN);
        const refreshTokenStorage = SysStorage(CONST.STORAGE.REFRESH_TOKEN);
        try {
          const currentRefreshToken: string = refreshTokenStorage.get() || "";
          const { success, data }: any = await AuthRequest.refreshToken({
            currentRefreshToken,
          });

          if (success) {
            // Lưu lại token mới
            refreshTokenStorage.set(data?.refreshToken);
            tokenStorage.set(data?.accessToken);
            setConfigAxios(data?.accessToken);
            return clientInstance(originalRequest);
          } else {
            // Xóa token nếu refresh không thành công
            tokenStorage.remove();
            refreshTokenStorage.remove();
          }
        } catch (error) {
          tokenStorage.remove();
          refreshTokenStorage.remove();
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};

// Đăng ký response interceptor cho AxiosClient
registerResponseInterceptor(AxiosClient);

// Cấu hình lại headers cho Axios client khi có accessToken
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

// Hàm để cấu hình lại Axios client với accessToken
export function setConfigAxios(accessToken: any) {
  setConfigAxiosClient(accessToken, AxiosClient);
}

// Các phương thức HTTP chính (POST, GET, PUT, PATCH, DELETE)
const post = (url: string, data?: any, config = {}) =>
  AxiosClient.post(url, data, config);
const get = (url: string, config = {}) => AxiosClient.get(url, config);
const put = (url: string, data?: any, config = {}) =>
  AxiosClient.put(url, data, config);
const patch = (url: string, data?: any, config = {}) =>
  AxiosClient.patch(url, data, config);
const del = (url: string, config = {}) => AxiosClient.delete(url, config);

// Tập hợp tất cả các phương thức thành một đối tượng duy nhất
const MSTFetch = {
  post,
  get,
  put,
  patch,
  delete: del,
};

export default MSTFetch;
