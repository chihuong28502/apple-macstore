import APPLEFetch from "@/core/services/fetch";

export const AuthRequest = {
  login(data: { email: string; password: string }) {
    return APPLEFetch.post("/auth/login", data);
  },
  loginGoogle: (googleToken: string) => {
    return APPLEFetch.post(`/auth/login-google`,
      {
        token: googleToken,
      }
    )
  },

  changePassword(data: { email: string; password: string, newPassword: string }) {
    return APPLEFetch.post("/auth/change-password", data);
  },
  register(data: { email: string; password: string }) {
    return APPLEFetch.post("/auth/register", data);
  },
  getUserInfo(id: string) {
    return APPLEFetch.get(`/auth/user/${id}`);
  },
  refreshToken() {
    return APPLEFetch.post('/auth/refresh');
  },
  logout() {
    return APPLEFetch.post("/auth/logout");
  },
  verifyEmail(email: any) {
    return APPLEFetch.post("/auth/forget-password/verify-email", { email });
  },
  verifyOtp(data: any) {
    return APPLEFetch.post("/auth/forget-password/verify-otp", { data });
  },
  verifyPassForget(data: any) {
    return APPLEFetch.post("/auth/forget-password/verify-password-forget", data);
  },
  acceptEmail(token: string) {
    return APPLEFetch.get(`auth/verify-email?token=${token}`);
  }
};
