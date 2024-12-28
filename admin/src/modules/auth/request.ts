import APPLEFetch from "@/core/services/fetch";

export const AuthRequest = {
  login(data: { username: string; password: string }) {
    return APPLEFetch.post("/auth/login-admin", data);
  },

  register(data: { email: string; password: string }) {
    return APPLEFetch.post("/auth/register", data );
  },
  getUserInfo(id: string) {
    return APPLEFetch.get(`/auth/user-admin/${id}`);
  },
  refreshToken() {
    return APPLEFetch.post('/auth/refresh-admin', );
  }, 
  logout() {
    return APPLEFetch.post("/auth/logout", );
  },
};
