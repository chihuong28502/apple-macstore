"use client";
import { AuthActions } from "@/modules/auth/slice";
import { Button, Form, Input, message, Modal, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import LoginGoogleButton from "../components/LoginGoogle";
import { EyeOutlined, EyeInvisibleOutlined, MailOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

function Page() {
  const route = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    if (!email || !password) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setLoading(true);
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
        },
        onError: () => {
          setLoading(false);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-6"
    >
      <div className="flex h-[84vh] shadow-2xl rounded-xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        {/* Left Column */}
        <div className="flex w-full flex-col lg:w-1/2 bg-white dark:bg-gray-900">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-1 flex-col justify-between p-8 sm:p-4 lg:p-8"
          >
            {/* Logo */}
            <div className="flex items-center gap-2 text-gray-800 dark:text-white">
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
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto w-full max-w-sm space-y-6"
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                <p className="text-gray-500 dark:text-gray-400">Log in to your account to continue</p>
              </div>

              {/* Google Login */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <LoginGoogleButton />
              </motion.div>

              {/* Email & Password Form */}
              <div className="space-y-4">
                <Form.Item>
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    size="large"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </Form.Item>

                <Form.Item>
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    size="large"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Remember me
                </Checkbox>
                <Link 
                  href="/auth/forget-password"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="primary"
                  onClick={handleLogin}
                  disabled={loading}
                  className="h-12 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg"
                >
                  {loading ? <LoadingOutlined /> : 'Log In'}
                </Button>
              </motion.div>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link 
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign Up
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block lg:w-1/2"
        >
          <div className="relative h-full">
            <img
              src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg"
              alt="Modern architecture"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative h-full bg-gradient-to-t from-gray-900/50 to-transparent p-12 flex items-end">
              <div className="space-y-4">
                <blockquote className="text-lg font-medium italic text-white">
                  "The future of technology is here. Join us in shaping tomorrow's innovations today."
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="CEO"
                    className="h-10 w-10 rounded-full border-2 border-white"
                  />
                  <div className="text-white">
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm opacity-80">CEO, Tech Innovations</div>
                  </div>
                </figcaption>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Page;

