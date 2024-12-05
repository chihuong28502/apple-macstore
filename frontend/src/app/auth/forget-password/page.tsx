"use client";
import { AuthActions } from "@/modules/auth/slice";
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Steps } from "antd";
import { motion } from "framer-motion";
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
  const [step, setStep] = useState(1);
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleNextStep = async () => {
    try {
      setLoading(true);

      // Validate only the current step's field
      let validationSchema;
      switch (step) {
        case 1:
          validationSchema = Yup.object().shape({
            email: ForgetPasswordSchema.fields.email
          });
          break;
        case 2:
          validationSchema = Yup.object().shape({
            otp: ForgetPasswordSchema.fields.otp
          });
          break;
        case 3:
          validationSchema = Yup.object().shape({
            newPassword: ForgetPasswordSchema.fields.newPassword
          });
          break;
      }
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
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          form.setFields([
            {
              name: err.path!,
              errors: [err.message],
            },
          ]);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const [form] = Form.useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
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
              prefix={<MailOutlined className="text-gray-400" />}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
              prefix={<LockOutlined className="text-gray-400" />}
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="OTP"
              className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
              prefix={<LockOutlined className="text-gray-400" />}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <Steps
          current={step - 1}
          items={[
            { title: 'Verify Email' },
            { title: 'Enter OTP' },
            { title: 'Reset Password' }
          ]}
          className="mb-12"
        />

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Step Title and Description */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {step === 1 && "Reset Your Password"}
                {step === 2 && "Enter Verification Code"}
                {step === 3 && "Create New Password"}
              </h1>
              <p className="text-gray-500">
                {step === 1 && "Enter your email address to receive a verification code"}
                {step === 2 && "We've sent a code to your email"}
                {step === 3 && "Choose a strong password to protect your account"}
              </p>
            </div>

            {/* Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleNextStep}
              className="space-y-6"
            >
              {renderStepContent()}

              <div className="space-y-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-lg text-base font-medium"
                >
                  {step === 3 ? 'Reset Password' : 'Continue'}
                </Button>

                {step > 1 && (
                  <Button
                    type="link"
                    onClick={() => setStep(step - 1)}
                    className="w-full text-blue-600"
                  >
                    Back
                  </Button>
                )}
              </div>
            </Form>

            {/* Help Text */}
            <div className="mt-8 text-center text-sm text-gray-500">
              {step === 1 && (
                <p>
                  Remember your password?{' '}
                  <a href="/auth/login" className="text-blue-600 hover:underline">
                    Sign in
                  </a>
                </p>
              )}
              {step === 2 && (
                <button 
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:underline"
                >
                  Resend OTP
                </button>
              )}
              {step === 3 && (
                <p>
                  Already have an account?{' '}
                  <a href="/auth/login" className="text-blue-600 hover:underline">
                    Sign in
                  </a>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default ForgetPassword;

