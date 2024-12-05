"use client";

import { AppAction, AppSelector } from "@/core/components/AppSlice";
import { AuthActions, AuthSelectors } from "@/modules/auth/slice";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, ConfigProvider, Input, Modal } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [verifyNewPassword, setVerifyNewPassword] = useState<string>("");
  const [isSubmitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const { resolvedTheme } = useTheme();
  const dispatch = useDispatch();
  const isOpenModalChangePassword = useSelector(AppSelector.isOpenModalChangePassword);
  const auth = useSelector(AuthSelectors.user);

  useEffect(() => {
    const isValidForm = oldPassword.length > 0 && newPassword.length >= 6 && newPassword === verifyNewPassword;
    setSubmitDisabled(!isValidForm);
  }, [oldPassword, newPassword, verifyNewPassword]);

  const handleCloseModalChangePassword = () => {
    setOldPassword("");
    setNewPassword("");
    setVerifyNewPassword("");
    dispatch(AppAction.hideModalChangePassword());
  };

  const validate = (event: React.FormEvent, callback: () => void) => {
    event.preventDefault();
    callback();
  };

  const handleSubmit = () => {
    if (auth?.email) {
      dispatch(
        AuthActions.changePassword({
          info: {
            email: auth.email,
            oldPassword,
            newPassword,
          },
          onSuccess: handleCloseModalChangePassword,
        })
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: resolvedTheme === "dark" ? "#4b4b4b" : "#fff",
            headerBg: resolvedTheme === "dark" ? "#4b4b4b" : "#fff",
            colorIcon: resolvedTheme === "dark" ? "#fff" : "#4b4b4b",
            titleColor: resolvedTheme === "dark" ? "#fff" : "#4b4b4b",
            titleFontSize: 22,
          },
        },
      }}
    >
      <Modal
        title="Change Password"
        onClose={handleCloseModalChangePassword}
        onOk={handleCloseModalChangePassword}
        onCancel={handleCloseModalChangePassword}
        centered
        footer={null}
        open={isOpenModalChangePassword}
      >
        <div className="flex justify-center items-center bg-background">
          <div className="w-full max-w-md bg-background p-6">
            <form className="space-y-4" onSubmit={(e) => validate(e, handleSubmit)}>
              <PasswordInput
                label="Mật khẩu cũ"
                value={oldPassword}
                onChange={setOldPassword}
                placeholder="Nhập mật khẩu cũ"
                id="old-password"
              />
              <PasswordInput
                label="Mật khẩu mới"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Nhập mật khẩu mới"
                id="new-password"
                isError={newPassword.length > 0 && newPassword.length < 6}
                errorMessage="Mật khẩu này nên gồm hơn 6 ký tự và khó đoán đối với người khác"
              />
              <PasswordInput
                label="Xác nhận mật khẩu mới"
                value={verifyNewPassword}
                onChange={setVerifyNewPassword}
                placeholder="Xác nhận mật khẩu mới"
                id="confirm-password"
                isError={verifyNewPassword.length > 0 && newPassword !== verifyNewPassword}
                errorMessage="Mật khẩu mới không khớp. Hãy nhập lại mật khẩu mới tại đây."
              />
              <Button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="w-full py-4 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Lưu thay đổi
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  id,
  isError = false,
  errorMessage = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id: string;
  isError?: boolean;
  errorMessage?: string;
}) => (
  <div>
    <label htmlFor={id} className="block font-medium text-fontColor">
      {label}
    </label>
    <Input.Password
      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      id={id}
      className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none text-black"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      status={isError ? "error" : ""}
    />
    {isError && (
      <div className="text-red-500 flex items-center mt-1">
        <RiErrorWarningLine className="w-5 h-5" />
        <div className="font-semibold text-[13px]">{errorMessage}</div>
      </div>
    )}
  </div>
);

export default ChangePassword;



