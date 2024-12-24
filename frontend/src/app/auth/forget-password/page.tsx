"use client";
import { AuthActions } from "@/modules/auth/slice";
import { Button, Form, Input, Steps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const ForgetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  otp: Yup.string().required('OTP is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New Password is required'),
});

function ForgetPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleNextStep = async () => {
    try {
      setLoading(true);
      switch (step) {
        case 1:
          dispatch(AuthActions.verifyEmail({
            email: formData.email,
            onSuccess: () => {
              setStep(2);
            },
          }));
          break;
        case 2:
          dispatch(AuthActions.verifyOtp({
            email: formData.email,
            otp: formData.otp,
            onSuccess: (data: any) => {
              setToken(data.token);
              setStep(3);
            },
          }));
          break;
        case 3:
          dispatch(AuthActions.verifyPassForget({
            email: formData.email,
            newPassword: formData.newPassword,
            token: token,
            onSuccess: () => {
              router.push('/auth/login');
            },
          }));
          break;
      }
    } catch (error) {
      // Error handling logic
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    form.setFields([
      {
        name,
        errors: [],
      },
    ]);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              placeholder="Email"
              className="h-9 border-gray-800 bg-transparent text-fontColor placeholder:text-gray-600"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Item>
        );
      case 2:
        return (
          <Form.Item
            name="otp"
            rules={[{ required: true, message: 'Please input OTP!' }]}
          >
            <Input
              placeholder="Enter OTP"
              className="h-9 border-gray-800 bg-transparent text-fontColor placeholder:text-gray-600"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
            />
          </Form.Item>
        );
      case 3:
        return (
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: 'Please input new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              placeholder="New Password"
              className="h-9 border-gray-800 bg-transparent text-fontColor placeholder:text-gray-600"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </Form.Item>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col bg-background lg:w-1/2">
        <div className="flex flex-1 flex-col justify-between p-8 sm:p-12 lg:p-16">
          <div className="flex items-center gap-2 text-fontColor">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            <Link href={'/'} className="text-lg font-semibold">APPLE</Link>
          </div>

          <Steps
            current={step - 1}
            items={[
              {
                title: <span className='text-fontColor'>Verify Email</span>
              },
              {
                title: <span className='text-fontColor'>Enter OTP</span>,
              },
              {
                title: <span className='text-fontColor'>Reset Password</span>,
              }
            ]}
            className="mb-12"
          />

          <div className="mx-auto w-full max-w-sm space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-fontColor">
                {step === 1 && "Reset Your Password"}
                {step === 2 && "Enter Verification Code"}
                {step === 3 && "Create New Password"}
              </h1>
              <p className="text-sm text-gray-400">
                {step === 1 && "Enter your email address to receive a verification code"}
                {step === 2 && "We've sent a code to your email"}
                {step === 3 && "Choose a strong password to protect your account"}
              </p>
            </div>

            <Form
              form={form}
              onFinish={handleNextStep}
              layout="vertical"
              className="space-y-4"
            >
              {renderStepContent()}

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-9 bg-blue-500 hover:bg-blue-600"
              >
                {step === 3 ? 'Reset Password' : 'Continue'}
              </Button>
            </Form>

            <div className="text-center text-sm text-gray-400">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </div>
          </div>
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
              The Keyword Tool project focuses on analyzing trends, YouTube data,
              competitor analysis, and user habits to provide YouTubers with the
              latest insights for content development.
            </blockquote>
            <figcaption className="flex items-center gap-4">
              <img
                src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg"
                alt="Bruno Reichert"
                width={"40"}
                height={"40"}
                className="rounded-full"
              />
            </figcaption>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;

