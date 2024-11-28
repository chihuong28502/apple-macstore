"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { message, Input, Button } from "antd";
import { VALIDATE } from "@/core/validate/validate";
import { AuthActions } from "@/modules/auth/slice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { withRouter } from "next/router";

function Page() {
  const route = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    try {
      setErrors({ email: "", password: "" });

      // Xác thực đầu vào
      await VALIDATE.loginSchema.validate(
        { email, password },
        { abortEarly: false }
      );

      // Kiểm tra nếu không có lỗi
      if (!errors.email && !errors.password) {
        dispatch(
          AuthActions.login({
            email,
            password,
            onSuccess: (rs: any) => {
              message.success("Đăng nhập thành công");
              route.push("/");
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
  }, [email, password]);

  return (
    <div className="min-h-screen text-gray-900 flex justify-center items-center bg-gradient-to-r from-indigo-50 to-indigo-200">
      <div className="max-w-screen-xl w-full bg-white shadow-lg rounded-lg flex">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center">
            <img
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto"
              alt="logo"
            />
          </div>
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center mt-12">
            Sign In
          </h1>
          <div className="w-full mt-8">
            {/* Email Input */}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Email"
              className="mb-4 w-full"
              status={errors.email ? "error" : ""}
              style={{ color: errors.email ? "red" : "black" }}
            />
            {/* Password Input */}
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Password"
              className="mb-4 w-full"
              status={errors.password ? "error" : ""}
              style={{ color: errors.password ? "red" : "black" }}
            />
            {/* Login Button */}
            <Button
              type="primary"
              onClick={handleLogin}
              className="w-full py-2 text-lg mt-4"
            >
              Log In
            </Button>
            {/* Register Link */}
            <div className="text-center mt-5">
              <div>
                Don't have an account? <Link href={'register'}>Register</Link>
              </div>
            </div>
            {/* Terms and Privacy */}
            <p className="mt-6 text-xs text-gray-600 text-center">
              By logging in, you agree to our{" "}
              <a
                href="#"
                className="border-b border-gray-500 border-dotted"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="border-b border-gray-500 border-dotted"
              >
                Privacy Policy
              </a>
              .
            </p>
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
  );
}

export default Page;
