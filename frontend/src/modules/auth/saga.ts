import { AppAction } from "@/core/components/AppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { AxiosError } from "axios";
import jwt from 'jsonwebtoken';
import { call, delay, put, takeLeading } from "redux-saga/effects";
import { CustomerActions } from "../customer/slice";
import { AuthRequest } from "./request";
import { AuthActions } from "./slice";
const getUserIdFromToken = () => {
  // Lấy accessToken từ localStorage
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    const decoded: any = jwt.decode(accessToken); // Giải mã token
    return decoded?._id || null; // Trả về userId hoặc null
  }

  return null; // Trả về null nếu không có accessToken
};


// Saga for login
function* login({ payload }: PayloadAction<any>): Generator<any, void, any> {
  const { email, password, onSuccess = () => { }, } = payload;
  try {
    yield delay(500);
    const { success, data } = yield call(AuthRequest.login, { email, password });
    if (success) {
      const decoded: any = jwt.decode(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      if (decoded) {
        const response = yield call(AuthRequest.getUserInfo, decoded._id);
        yield put(AuthActions.setUser(response.data));
        onSuccess(data?.user);
      } else {
        yield put(AuthActions.getInfoUser({}));
        message.error("Đăng nhập không thành công."); // Hiển thị thông báo lỗi
      }
    } else {
      message.error("Đăng nhập không thành công."); // Hiển thị thông báo lỗi
    }
  } catch (error) {
    message.error("Đăng nhập không thành công."); // Hiển thị thông báo lỗi
    console.error("Error during login process:", error);
  }
}

function* googleSignIn({ payload }: any): Generator<any, void, any> {
  const { googleToken, onSuccess = () => { }, onFail = () => { }, } = payload;
  try {
    const { success, data }: any = yield call(AuthRequest.loginGoogle, googleToken);
    if (success) {
      const decoded: any = jwt.decode(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      if (decoded) {
        const response: any = yield call(AuthRequest.getUserInfo, decoded._id);
        yield put(AuthActions.setUser(response.data));
        onSuccess();
      } else {
        message.error("Đăng nhập không thành công.");
      }
    } else {
      message.error("Đăng nhập không thành công.");
    }
  } catch (e) {
    console.log("🚀 ~ e:", e)
    message.error("Đăng nhập không thành công.");
  }
}
// Saga for registration
function* register({ payload }: PayloadAction<any>): Generator<any, void, any> {
  const { onSuccess = () => { }, onFail = () => { } } = payload;
  const data: any = { ...payload, role: "customer" }
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } = yield call(AuthRequest.register, data);
    yield put(AppAction.hideLoading());
    if (res.success) {
      onSuccess(res);
    } else {
      onFail(res);
    }
  } catch (error: any) {
    yield put(AppAction.hideLoading());
  }
}

// Saga for retrieving user info
function* getInfoUser({ payload }: PayloadAction<any>): Generator<any, void, any> {
  const { onSuccess = () => { }, onError = () => { } } = payload;
  try {
    const userId = getUserIdFromToken();
    if (userId) {
      const response = yield call(AuthRequest.getUserInfo, userId);
      yield put(AuthActions.setUser(response.data));
      yield put(CustomerActions.setShipping(response.data.shipping))
      onSuccess();
    } else {
      yield put(AuthActions.getInfoUser({}));
    }
  } catch (error) {
    yield put(AuthActions.getInfoUser({}));
    onError(error);
  }
}

// Saga for logout
function* logout(): Generator<any, void, any> {
  try {
    const { success } = yield call(AuthRequest.logout);
    if (success) {
      yield put(AuthActions.logout({}));
      window.location.replace('/')
    }
  } catch (error) {
  }
}

function* refreshToken(): Generator<any, void, any> {
  try {
    const response: any = yield call(AuthRequest.refreshToken);
    if (response && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken)
      const decoded: any = jwt.decode(response.data.accessToken);
      if (decoded) {
        const userResponse = yield call(AuthRequest.getUserInfo, decoded._id);
        yield put(AuthActions.setUser(userResponse.data));
      } else {
        throw new Error("Unable to decode user ID from access token.");
      }
    } else {
      message.error("Hãy đăng nhập");
    }
  } catch (error) {
  }
}

// Root saga for authentication
export function* AuthSaga() {
  yield takeLeading(AuthActions.refreshToken, refreshToken);
  yield takeLeading(AuthActions.login, login);
  yield takeLeading(AuthActions.register, register);
  yield takeLeading(AuthActions.getInfoUser, getInfoUser);
  yield takeLeading(AuthActions.logout, logout);
  yield takeLeading(AuthActions.googleSignIn, googleSignIn);

}
