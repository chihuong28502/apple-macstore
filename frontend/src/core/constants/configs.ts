export const Config = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://www.topclick.vn",
  API_SERVER:
    process.env.NEXT_PUBLIC_API_SERVER ||
    "http://localhost:5001",
  SOCKET_SERVER:
    process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:3001",
  API_KEY_SECURE: process.env.NEXT_PUBLIC_API_SERVER || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY:
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    "6LfQAQcqAAAAALIm6krNAzW_-eash1Q_dnfKJO3e",
  RECAPTCHA_SECRET_KEY:
    process.env.RECAPTCHA_SECRET_KEY ||
    "6LfQAQcqAAAAAMmLec4BL4Tae6DxGICx6BTl0Uj8",
};
