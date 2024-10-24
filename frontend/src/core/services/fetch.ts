'use client'
import { AuthUtils } from "@/lib/localAuth";
import { AuthActions } from "@/modules/auth/slice";
import axios, { AxiosInstance } from "axios";
import { toast } from 'react-toastify';
import CONST from "./const";
import { store } from "./store";

export let AxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_LOCAL || '/api',
  timeout: CONST.REQUEST.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

// Gắn token vào header cho mỗi yêu cầu
AxiosClient.interceptors.request.use(
  (config) => {
    const { accessToken } = AuthUtils.getTokens();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const registerInterceptorResponse = (clientInstance: AxiosInstance) => {
  clientInstance.interceptors.response.use(
    (response: any) => {
      return response?.data || response;
    },
    async function (error: any) {
      const originalRequest = error?.config;

      if (error?.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 401:
            if (!originalRequest?._retry) {
              originalRequest._retry = true;
              try {
                const dispatch = store.dispatch;
                 dispatch(AuthActions.refreshToken());
              } catch (err) {
                toast.error("Hết phiên làm việc, hãy thực hiện đăng nhập.");
              }
            }
            return Promise.reject(error);

          case 403:
            toast.error("Bạn không có quyền");
            return Promise.reject(error);
          case 404:
            toast.error("Not Found.");
            return Promise.reject(error);

          case 500:
            toast.error("Server Error.");
            return Promise.reject(error);

          default:
            toast.error("Unexpected Error");
            return Promise.reject(error);
        }
      } else {
        // Xử lý khi không có phản hồi từ server (ví dụ: mất kết nối)
        toast.error("Network Error");
      }

      return Promise.reject(error);
    }
  );
};

registerInterceptorResponse(AxiosClient);

// Các phương thức gọi API
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
