import * as Yup from 'yup';

// Định nghĩa các schema Yup tại đây
export const VALIDATE = {
  // Validation cho form đổi mật khẩu
  passwordChangeSchema: Yup.object().shape({
    oldPassword: Yup.string().required('Mật khẩu cũ là bắt buộc'),
    newPassword: Yup.string()
      .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
      .required('Mật khẩu mới là bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận phải trùng khớp')
      .required('Vui lòng xác nhận mật khẩu'),
  }),

  // Validation cho form đăng nhập
  loginSchema: Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().required('Mật khẩu là bắt buộc'),
  }),

  // Validation cho form đăng ký
  registerSchema: Yup.object().shape({
    username: Yup.string().required('Tên người dùng là bắt buộc'),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  }),

  // Các hàm validate khác có thể thêm tại đây
};
