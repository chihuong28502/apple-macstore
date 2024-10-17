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
    return MSTFetch.get(`/auth/${id}`, {
      withCredentials: true,
    });
  }, 
  refreshToken(refreshToken: string) {
    return MSTFetch.post('/auth/refresh', {
      refreshToken, 
    }, {
      withCredentials: true
    });
  },
};
