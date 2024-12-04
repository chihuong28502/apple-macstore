"use client";
import { AuthActions } from "@/modules/auth/slice";
import { Button, Form, Input, message, Modal } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import LoginGoogleButton from "./components/LoginGoogle";

function Page() {
  const route = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    dispatch(
      AuthActions.login({
        email,
        password,
        onSuccess: (rs: any) => {
          if (rememberMe) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
          } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
          }
          message.success("Đăng nhập thành công.");
          route.push("/");
        }
      })
    );
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

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="">
      <div className="flex h-[84vh] shadow-lg rounded-lg overflow-hidden">
        {/* Left Column */}
        <div className="flex w-full flex-col bg-background lg:w-1/2">
          <div className="flex flex-1 flex-col justify-between p-8 sm:p-4 lg:p-8">
            {/* Logo */}
            <div className="flex items-center gap-2 text-fontColor">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              <span className="text-lg font-semibold">APPLE</span>
            </div>
            {/* Form */}
            <div className="mx-auto w-full max-w-sm space-y-8">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-fontColor">Welcome Back</h1>
                <p className="text-sm text-gray-400">
                  Log in to your account to continue
                </p>
              </div>
              <div className="space-y-4">
                {/* Social Logins */}
                <div className="w-full bg-transparent text-fontColor hover:bg-white/10">
                  {/* <LoginGoogle /> */}
                </div>
                <div className="relative">
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-gray-400">OR</span>
                  </div>
                </div>
                {/* Email & Password Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="h-11 border-gray-800 bg-transparent text-fontColor placeholder:text-gray-600 transition-all focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-400">Password</label>
                    </div>
                    <div className="relative">
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-11 border-gray-800 bg-transparent text-fontColor placeholder:text-gray-600 transition-all focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="absolute right-3 top-3 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M17 10H3M10 3l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <LoginGoogleButton />
                <Button
                  onClick={handleLogin}
                  className="h-11 w-full bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  Log In
                </Button>
              </div>
            </div>
            {/* Register link */}
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-500 hover:text-blue-400">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2">
          <div className="relative flex h-full items-end bg-white">
            <img
              src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg"
              alt="Modern architecture"
              width={"1080"}
              height={"1080"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative space-y-4 p-16">
              <blockquote className="text-lg font-medium italic text-gray-900">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquet."
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <img
                  src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg"
                  alt="Bruno Reichert"
                  width={"40"}
                  height={"40"}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">Bruno Reichert</div>
                  <div className="text-sm text-gray-600">Founder & CEO at ACME</div>
                </div>
              </figcaption>
            </div>
          </div>
        </div>
        <Modal
          title="Nhập mã OTP"
          visible={isOtpModalVisible}
          onCancel={() => setIsOtpModalVisible(false)}
          footer={null}
          width={400}
          className="otp-modal"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-fontColor">Xác nhận OTP</h3>
            <p className="text-sm text-gray-400">Vui lòng nhập mã OTP đã gửi vào email của bạn.</p>
          </div>
          <Form name="otp-form">
            <Form.Item
              name="otp"
              rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
            >
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Mã OTP"
                className="h-12 w-full bg-transparent text-fontColor border-gray-600 placeholder:text-gray-500 rounded-md focus:border-blue-500"
                maxLength={6}
              />
            </Form.Item>
            <Button
              type="primary"
              block
              onClick={() => {
                // Xử lý OTP ở đây
                setIsOtpModalVisible(false);
              }}
            >
              Xác nhận
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default Page;
