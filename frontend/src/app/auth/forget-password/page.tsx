"use client";
import { AuthActions } from "@/modules/auth/slice";
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-6"
    >
      <div className="flex h-[84vh] shadow-2xl rounded-xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <div className="flex w-full flex-col lg:w-1/2 bg-white dark:bg-gray-900">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-1 flex-col justify-between p-8 sm:p-4 lg:p-8"
          >
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forget Password</h1>
              <p className="text-gray-500 dark:text-gray-400">Step {step} of 3</p>
            </div>

            <div className="text-center mb-4">
              <img src={`/images/step${step}.png`} alt={`Step ${step}`} />
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleNextStep}
              className="space-y-4"
            >
              {renderStepContent()}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="h-12 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg"
                >
                  {step === 3 ? 'Reset Password' : 'Next'}
                </Button>
              </motion.div>
            </Form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ForgetPassword;

