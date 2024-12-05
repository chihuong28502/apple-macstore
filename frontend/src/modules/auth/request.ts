import MSTFetch from "@/core/services/fetch";

export const AuthRequest = {
  login(data: { email: string; password: string }) {
    return MSTFetch.post("/auth/login", data);
  },
  loginGoogle: (googleToken: string) => {
    return MSTFetch.post(`/auth/login-google`,
      {
        token: googleToken,
      }
    )
  },

  changePassword(data: { email: string; password: string, newPassword: string }) {
    return MSTFetch.post("/auth/change-password", data);
  },
  register(data: { email: string; password: string }) {
    return MSTFetch.post("/auth/register", data);
  },
  getUserInfo(id: string) {
    return MSTFetch.get(`/auth/user/${id}`);
  },
  refreshToken() {
    return MSTFetch.post('/auth/refresh',);
  },
  logout() {
    return MSTFetch.post("/auth/logout",);
  },
};
