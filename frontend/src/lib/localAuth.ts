// utils/auth.utils.ts

export const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_ROLE: 'userRole',
  USER_DATA: 'userData'
} as const;

export const AuthUtils = {
  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
    }
  },

  setUserData(userData: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEYS.USER_ROLE, userData.role);
      localStorage.setItem(AUTH_KEYS.USER_DATA, JSON.stringify(userData));
    }
  },

  clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_KEYS.USER_ROLE);
      localStorage.removeItem(AUTH_KEYS.USER_DATA);
    }
  },

  getTokens() {
    if (typeof window !== 'undefined') {
      return {
        accessToken: localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN),
        refreshToken: localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN),
      };
    }
    return { accessToken: null, refreshToken: null };
  },

  getUserRole(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_KEYS.USER_ROLE);
    }
    return null;
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
    }
    return false;
  }
};