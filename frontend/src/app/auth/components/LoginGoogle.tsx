'use client'
import { useAppDispatch } from "@/core/services/hook";
import { AuthActions } from "@/modules/auth/slice";
import { GoogleLogin } from "@react-oauth/google";
import { message } from 'antd';
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

type Props = {
  handleMenuClick?: () => void;
}

function LoginGoogle({ handleMenuClick }: Props) {
  const { resolvedTheme } = useTheme();
  const route = useRouter();
  const dispatch = useAppDispatch();

  // Hàm xử lý đăng nhập Google
  const handleLogin = async (googleToken: string) => {
    try {
      dispatch(AuthActions.googleSignIn({
        googleToken,
        onSuccess: () => {
          message.success("Đăng nhập thành công");
          route.push('/')
        },
      }));
    } catch (error) {
      console.log(error);
      message.error('Đã xảy ra lỗi khi đăng nhập!');
    } finally {
      handleMenuClick?.();
    }
  };

  const onSuccess = async (rs: any) => {
    handleLogin(rs.credential);
  };

  return (
    <div className="flex justify-center w-full">
      <div style={{ colorScheme: resolvedTheme == 'dark' ? 'light' : 'dark' }}>
        <GoogleLogin
          onSuccess={onSuccess}
          theme="filled_black"
          text="signin_with"
        />
      </div>
    </div>
  );
}

export default LoginGoogle;
