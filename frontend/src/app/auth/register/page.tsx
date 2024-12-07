"use client";
import { AuthActions } from "@/modules/auth/slice";
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

function ChangePassword() {
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
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      dispatch(
        AuthActions.register({
          ...formData,
          onSuccess: () => {
            message.success("Registration successful");
            route.push('/auth/login');
          },
          onFail: () => {
            message.error("Registration failed");
            setLoading(false);
          },
        })
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br h-[88vh] dark:from-gray-900 dark:to-gray-800 from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-2"
    >
      <div className="flex shadow-2xl h-full rounded-xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <div className="flex w-full flex-col lg:w-1/2 bg-white dark:bg-gray-900">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-1 flex-col p-8 sm:p-4 lg:p-8"
          >
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
              className="mx-auto w-full max-w-sm space-y-2"
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
                <p className="text-gray-500 dark:text-gray-400">Sign up to get started with our service</p>
              </div>

              {/* Google Login */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <LoginGoogleButton />
              </motion.div>

              {/* Registration Form */}
              <Form layout="vertical" onFinish={handleRegister}>
                <div className="space-y-3 mb-2">
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      name="firstName"
                      validateStatus={errors.firstName ? "error" : ""}
                      help={errors.firstName}
                      className=" mb-1"
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </Form.Item>
                    <Form.Item
                      name="lastName"
                      validateStatus={errors.lastName ? "error" : ""}
                      help={errors.lastName}
                      className=" mb-1"
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    name="phone"
                    validateStatus={errors.phone ? "error" : ""}
                    help={errors.phone}
                  >
                    <Input
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    validateStatus={errors.email ? "error" : ""}
                    help={errors.email}
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
                  <Form.Item
                    name="username"
                    validateStatus={errors.username ? "error" : ""}
                    help={errors.username}
                  >
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    validateStatus={errors.confirmPassword ? "error" : ""}
                    help={errors.confirmPassword}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                </div>

                {/* Register Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isSubmitDisabled || loading}
                    className="h-12 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                </motion.div>
              </Form>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?
                <Link 
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Log In
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
                  "Join our community and experience the future of technology today."
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="John Doe"
                    className="h-10 w-10 rounded-full border-2 border-white"
                  />
                  <div className="text-white">
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm opacity-80">Chief Innovation Officer</div>
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

export default ChangePassword;

