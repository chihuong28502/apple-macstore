import * as Yup from "yup";

// Định nghĩa các schema Yup tại đây
export const VALIDATE = {
  // Validation cho form đổi mật khẩu
  passwordChangeSchema: Yup.object().shape({
    oldPassword: Yup.string().required("Mật khẩu cũ là bắt buộc"),
    newPassword: Yup.string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .required("Mật khẩu mới là bắt buộc"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận phải trùng khớp")
      .required("Vui lòng xác nhận mật khẩu")
      .min(6, "Mật khẩu ít nhất 6 kí tự"),
  }),


  loginSchema: Yup.object().shape({
    password: Yup.string()
      .required("Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu không hợp lệ vì quá ngắn"),
  }),


  // Validation cho form đăng ký
  registerSchema: Yup.object().shape({
    firstName: Yup.string().required('First Name không thể để trống'),
    lastName: Yup.string().required('Last Name không thể để trống'),
    phone: Yup.string().required('Phone  không thể để trống'),
    email: Yup.string().email('Invalid email format').required('Email không thể để trống'),
    username: Yup.string().required('Username không thể để trống'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password không thể để trống'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords không đồng bộ')
      .required('Confirm Password  không thể để trống'),
  }),
};
