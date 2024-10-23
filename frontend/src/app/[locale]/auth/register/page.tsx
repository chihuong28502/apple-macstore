"use client";
import CustomButton from "@/app/[locale]/components/Button"
import { VALIDATE } from "@/core/validate/validate";
import { AuthActions } from "@/modules/auth/slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Định nghĩa kiểu cho formData và errors
interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

function Page() {
  const dispatch = useDispatch();
  const route = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({}); // Định nghĩa kiểu cho errors

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async () => {
    try {
      setErrors({});
      // Validate form data
      await VALIDATE.registerSchema.validate(formData, { abortEarly: false });

      // Định dạng lại dữ liệu trước khi gửi API
      const formattedData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: "customer",
        profile: {
          firstName: formData.firstName || undefined, // Chỉ lấy những giá trị không rỗng
          lastName: formData.lastName || undefined,
          phoneNumber: formData.phone || undefined,
        },
      };
      dispatch(
        AuthActions.register({
          data: formattedData,
          onSuccess: (rs: any) => {
            toast.success("Đăng ký thành công");
            route.push("login");
          },
          onFail: (message: any, data: any) => {
            toast.error("Đăng ký thất bại");
          },
        })
      );
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        const newErrors: FormErrors = {}; // Xác định kiểu dữ liệu cho errors
        validationError.inner.forEach((error) => {
          newErrors[error.path as keyof FormErrors] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <>
      <div className="h-full">
        <div className="mx-auto h-full">
          <div className="justify-center h-full">
            <div className="w-full flex h-full">
              <div
                className="w-full h-full bg-gray-400 dark:bg-gray-800 hidden lg:block lg:w-5/12 bg-cover"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                }}
              />
              <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-5">
                <h3 className="py-4 text-2xl text-center text-gray-800 ">
                  Create an Account!
                </h3>
                <form className="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded">
                  <div className="mb-4 md:flex md:justify-between">
                    <div className="mb-4 md:mr-2 md:mb-0">
                      <label className="block mb-2 text-sm font-bold text-gray-700 ">
                        First Name
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700  border ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="md:ml-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700 ">
                        Last Name
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700  border ${
                          errors.lastName ? "border-red-500" : "border-gray-200"
                        } rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div className="md:ml-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700 ">
                        Phone
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700  border ${
                          errors.phone ? "border-red-500" : "border-gray-200"
                        } rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                        id="phone"
                        name="phone"
                        type="text"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700 ">
                      Email
                    </label>
                    <input
                      className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700  border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700 ">
                      Username
                    </label>
                    <input
                      className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700  border ${
                        errors.username ? "border-red-500" : "border-gray-200"
                      } rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs">{errors.username}</p>
                    )}
                  </div>
                  <div className="mb-4 md:flex md:justify-between">
                    <div className="mb-4 md:mr-2 md:mb-0">
                      <label className="block mb-2 text-sm font-bold text-gray-700 ">
                        Password
                      </label>
                      <input
                        className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700  border ${
                          errors.password ? "border-red-500" : "border-gray-200"
                        } rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="******************"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="md:ml-2">
                      <label className="block mb-2 text-sm font-bold text-gray-700 ">
                        Confirm Password
                      </label>
                      <input
                        className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700  border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="******************"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-6 text-center">
                    <CustomButton
                      label="Đăng ký tài khoản"
                      tooltipText="Đăng ký tài khoản"
                      className="!w-full rounded-3xl"
                      onClick={handleSubmit}
                    />
                  </div>
                  <hr className="mb-6 border-t" />
                  <div className="text-center">
                    <a
                      className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="text-center">
                    <Link
                      className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                      href="login"
                    >
                      Already have an account? Login!
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
