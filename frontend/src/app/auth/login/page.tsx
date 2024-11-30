"use client";
import { AuthActions } from "@/modules/auth/slice";
import { Button, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message } from 'antd';
function Page() {
  const route = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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
    <div className="min-h-screen text-gray-900 flex justify-center items-center bg-gradient-to-r from-indigo-50 to-indigo-200">
      <div className="max-w-screen-xl w-full bg-white shadow-lg rounded-lg flex justify-between">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center">
            <img
              loading="lazy"
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
              className="mb-4 w-full !text-black"
            />
            {/* Password Input */}
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Password"
              className="mb-4 w-full !text-black"
            />
            {/* Login Button */}
            <div className="flex items-center mb-4 ">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-1 w-4 h-4 rounded-full cursor-pointer "
              />
              <span className="text-sm">Ghi nhớ mật khẩu</span>
            </div>
            <Button
              type="primary"
              onClick={handleLogin}
              className="w-full py-2 text-lg mt-4"
            >
              Log In
            </Button>
            <div className="text-center mt-5">
              <div>
                Don't have an account? <Link href={'register'}>Register</Link>
              </div>
            </div>
            <p className="mt-6 text-xs text-gray-600 text-center">
              By logging in, you agree to our
              <a href="#" className="border-b border-gray-500 border-dotted">
                Terms of Service
              </a>
              and
              <a href="#" className="border-b border-gray-500 border-dotted" >
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
    </div >
  );
}

export default Page;
