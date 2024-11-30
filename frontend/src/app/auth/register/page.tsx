"use client";
import { AuthActions } from "@/modules/auth/slice";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'),], 'Passwords must match')
    .required('Confirm Password is required'),
});

function Register() {
  const route = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    try {
      setErrors({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

      await registerSchema.validate(formData, { abortEarly: false });

      if (!Object.values(errors).some((error) => error)) {
        dispatch(
          AuthActions.register({
            ...formData,
            onSuccess: () => {
              message.success("Đăng ký thành công");
              route.push('/auth/login')
            },
            onFail: () => {
              message.error("Đăng ký thất bại");
            },
          })
        );
      }
    } catch (validationError: any) {
      if (validationError instanceof Yup.ValidationError) {
        const newErrors: any = {};
        validationError.inner.forEach((error: any) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleRegister();
      }
    };
    document.addEventListener("keydown", handleEnterPress);
    return () => document.removeEventListener("keydown", handleEnterPress);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="min-h-screen text-gray-900 flex justify-center items-center bg-gradient-to-r from-indigo-50 to-indigo-200">
      <div className="max-w-screen-xl w-full bg-white shadow-lg rounded-lg flex">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center">
            <img
              loading="lazy"
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto"
              alt="logo"
            />
          </div>
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center mt-12">Register</h1>
          <div className="w-full mt-8">
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="First Name"
              className="mb-4 w-full"
              status={errors.firstName ? "error" : ""}
            />
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Last Name"
              className="mb-4 w-full"
              status={errors.lastName ? "error" : ""}
            />
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Phone"
              className="mb-4 w-full"
              status={errors.phone ? "error" : ""}
            />
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Email"
              className="mb-4 w-full"
              status={errors.email ? "error" : ""}
            />
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Username"
              className="mb-4 w-full"
              status={errors.username ? "error" : ""}
            />
            <Input.Password
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Password"
              className="mb-4 w-full"
              status={errors.password ? "error" : ""}
              iconRender={(visible) =>
                visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
            />
            <Input.Password
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Confirm Password"
              className="mb-4 w-full"
              status={errors.confirmPassword ? "error" : ""}
              iconRender={(visible) =>
                visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
            />
            <Button
              type="primary"
              className="w-full mt-4"
              onClick={handleRegister}
            >
              Register
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Log in
              </Link>
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

export default Register;
