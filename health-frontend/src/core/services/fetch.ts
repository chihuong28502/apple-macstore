import axios, { AxiosInstance } from "axios";
import { AuthRequest } from "./auth";
import CONST from "./const";
import SysStorage from "./storage";
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
        const atStore = SysStorage(CONST.STORAGE.ACCESS_TOKEN);
        const accessToken = atStore.get();
        if (accessToken && accessToken !== "underfined") {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          // Nếu không có token hợp lệ, kiểm tra customerIdVisit tồn tại để check lượt truy cập.
          // let customerIdVisit = localStorage.getItem("customerIdVisit");
          // if (!customerIdVisit) {
          //   customerIdVisit =
          //     Date.now().toString(36) + Math.random().toString(36).substring(2);
          //   localStorage.setItem("customerIdVisit", customerIdVisit);
          // }
          // config.headers["x-customer-id-visit"] = customerIdVisit;
          // Nếu không có token hợp lệ, xóa header Authorization nếu nó đã tồn tại
          delete config.headers.Authorization;
        }
        await new Promise((resolve: any) => setTimeout(resolve, 1));
      } catch (error) {}
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
        } else if (res?.status === "success") {
        }
      }
      return res;
    },
    async function (error: any) {
      const originalRequest = error?.config;
      if (error?.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        const tokenStorage = SysStorage(CONST.STORAGE.ACCESS_TOKEN);
        const refreshTokenStorage = SysStorage(CONST.STORAGE.REFRESH_TOKEN);
        try {
          const currentRefreshToken: string =
            (await refreshTokenStorage.get()) || "";
          const { success, message, data }: any =
            await AuthRequest.refreshToken({
              currentRefreshToken: currentRefreshToken,
            });
          if (success) {
            refreshTokenStorage.set(data?.refreshToken);
            await tokenStorage.set(data?.accessToken);
            await setConfigAxios(data?.accessToken);
          } else {
            await tokenStorage.remove();
            await refreshTokenStorage.remove();
          }
          return clientInstance(originalRequest);
        } catch (error) {
          await tokenStorage.remove();
          await refreshTokenStorage.remove();
          window.location.href = "/login";
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
