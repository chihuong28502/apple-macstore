"use client";
import CustomButton from "@/app/components/Button";
import { VALIDATE } from "@/core/validate/validate";
import { AuthActions } from "@/modules/auth/slice";
import { message } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { InputField } from "./components/InputField";

function Page() {
  const dispatch = useDispatch();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    try {
      setErrors({ username: "", password: "" });

      // Xác thực đầu vào
      await VALIDATE.loginSchema.validate({ password }, { abortEarly: false });

      // Kiểm tra nếu không có lỗi
      if (!errors.username && !errors.password) {
        dispatch(
          AuthActions.login({
            username,
            password,
            onSuccess: (rs: any) => {
              message.success("Đăng nhập thành công");
              window.location.replace("/");
            },
            onFail: (message: any, data: any) => {
              message.error("Đăng nhập thất bại");
            },
          })
        );
      }
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        const newErrors: any = {};
        validationError.inner.forEach((error) => {
          newErrors[error.path as string] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  // Xử lý sự kiện khi nhấn Enter
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  // Lắng nghe phím Enter toàn trang
  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    };
    document.addEventListener("keydown", handleEnterPress);
    return () => document.removeEventListener("keydown", handleEnterPress);
  }, [username, password]);

  return (
    <>
      <div className="min-h-screen text-gray-900 justify-center flex">
        <div className="max-w-screen-xl m-0 sm:m-2 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 bg-layout">
            <div>
              <img
                alt="1"
                src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
                className="w-32 mx-auto"
              />
            </div>
            <div className="mt-12 flex flex-col items-center bg-layout">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
              <div className="w-full flex-1 mt-8 ">
                <InputField
                  type="username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="username"
                  error={errors.username}
                />
                <InputField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Password"
                  error={errors.password}
                />
                <CustomButton
                  onClick={handleLogin}
                  label="Đăng nhập"
                  tooltipText="Đăng nhập"
                  className="!w-full"
                  classNameContainer="w-full"
                />
                <div className="text-center mt-5">
                  <Link
                    className="text-sm text-blue-500 hover:text-blue-800"
                    href="register"
                  >
                    Don't have an account yet? Register
                  </Link>
                </div>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by templatana's{" "}
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Terms of Service
                  </a>{" "}
                  and its{" "}
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
