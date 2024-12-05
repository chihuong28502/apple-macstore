"use client";
import { AuthActions } from "@/modules/auth/slice";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import LoginGoogleButton from "../components/LoginGoogle";

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

function Register() {
  const route = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    const validateForm = async () => {
      try {
        await registerSchema.validate(formData, { abortEarly: false });
        setErrors({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        setSubmitDisabled(false);
      } catch (validationError: any) {
        if (validationError instanceof Yup.ValidationError) {
          const newErrors: any = {};
          validationError.inner.forEach((error: any) => {
            newErrors[error.path] = error.message;
          });
          setErrors(newErrors);
          setSubmitDisabled(true);
        }
      }
    };

    validateForm();
  }, [formData]);

  const handleRegister = () => {
    if (!isSubmitDisabled) {
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
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const InputField = ({ name, label, type = "text", placeholder }: { name: keyof typeof formData; label: string; type?: string; placeholder: string }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <Input
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-8 border-gray-800 bg-transparent text-fontColor placeholder:text-gray-600 transition-all focus:ring-2 focus:ring-blue-500"
        status={errors[name] ? "error" : ""}
      />
      {errors[name] && (
        <div className="text-red-500 flex items-center mt-1">
          <RiErrorWarningLine className="w-4 h-4 mr-1" />
          <div className="text-xs">{errors[name]}</div>
        </div>
      )}
    </div>
  );

  const PasswordInput = ({ name, label, placeholder }: { name: "password" | "confirmPassword"; label: string; placeholder: string }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <Input.Password
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-8 border-gray-800 bg-transparent text-fontColor placeholder:text-gray-600 transition-all focus:ring-2 focus:ring-blue-500"
        status={errors[name] ? "error" : ""}
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      {errors[name] && (
        <div className="text-red-500 flex items-center mt-1">
          <RiErrorWarningLine className="w-4 h-4 mr-1" />
          <div className="text-xs">{errors[name]}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="">
      <div className="flex min-h-[84vh] shadow-lg rounded-lg overflow-hidden">
        {/* Left Column */}
        <div className="flex w-full flex-col bg-background lg:w-1/2">
          <div className="flex flex-1 flex-col justify-between p-4 sm:p-4 lg:p-4">
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
              <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold text-fontColor">Create an Account</h1>
                <p className="text-sm text-gray-400">
                  Sign up to get started with our service
                </p>
              </div>
              <div className="space-y-4">
                {/* Registration Form */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField name="firstName" label="First Name" placeholder="Enter your first name" />
                  <InputField name="lastName" label="Last Name" placeholder="Enter your last name" />
                  <InputField name="phone" label="Phone" placeholder="Enter your phone number" />
                  <InputField name="email" label="Email" type="email" placeholder="Enter your email" />
                  <InputField name="username" label="Username" placeholder="Choose a username" />
                  <PasswordInput name="password" label="Password" placeholder="Enter your password" />
                  <PasswordInput name="confirmPassword" label="Confirm Password" placeholder="Confirm your password" />
                </div>
                <Button
                  onClick={handleRegister}
                  disabled={isSubmitDisabled}
                  className="h-8 w-full bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition-all text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Register
                </Button>
                <div className="w-full bg-transparent text-fontColor hover:bg-white/10">
                  <LoginGoogleButton />
                </div>
                <p className="text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-blue-500 hover:text-blue-400">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column (Image) */}
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
                "Join our community and experience the future of technology today."
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <img
                  src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg"
                  alt="John Doe"
                  width={"40"}
                  height={"40"}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-600">Chief Innovation Officer</div>
                </div>
              </figcaption>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

