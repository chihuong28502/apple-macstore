import MSTFetch from "@/core/services/fetch";

export const AuthRequest = {
  login(data: { username: string; password: string }) {
    return MSTFetch.post("/auth/login-admin", data);
  },

  register(data: { email: string; password: string }) {
    return MSTFetch.post("/auth/register", data );
  },
  getUserInfo(id: string) {
    return MSTFetch.get(`/auth/user-admin/${id}`);
  },
  refreshToken() {
    return MSTFetch.post('/auth/refresh-admin', );
  }, 
  logout() {
    return MSTFetch.post("/auth/logout", );
  },
};
