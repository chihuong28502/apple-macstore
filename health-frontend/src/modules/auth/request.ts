import MSTFetch from "@/core/services/fetch";

export const AuthRequest = {
  login(data: { email: string; password: string }) {
    return MSTFetch.post("/auth/login", data, {
      withCredentials: true,
    });
  },

  register(data: { email: string; password: string }) {
    return MSTFetch.post("/auth/register", data, {
      withCredentials: true,
    });
  },
  getUserInfo(id: string) {
    return MSTFetch.get(`/auth/user/${id}`, {
      withCredentials: true,
    });
  },
  refreshToken() {
    return MSTFetch.post('/auth/refresh', {
      withCredentials: true
    });
  }, 
  logout() {
    return MSTFetch.get("/auth/logout", {
      withCredentials: true,
    });
  },
};
