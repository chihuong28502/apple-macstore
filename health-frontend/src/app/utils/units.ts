import * as yup from "yup";
import moment from "moment";
import CONST from "@/core/services/const";

// Validation cho các form
const validateForm = yup.object({
  qty: yup
    .number()
    .integer("Giá trị không được là số thập phân")
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .required("Vui lòng không bỏ trống")
    .notOneOf([0], "Giá trị phải lớn hơn 0"),
  customerEnteredValues: yup.array(
    yup.object({
      attributeCode: yup.string().required("Vui lòng không bỏ trống mã thuộc tính"),
      enteredValue: yup.string().required("Vui lòng không bỏ trống giá trị đã nhập"),
    })
  ),
  intervalTime: yup.number(),
});

const validateFormChangePassWord = yup.object({
  oldPassword: yup
    .string()
    .required("Vui lòng không bỏ trống mật khẩu cũ")
    .min(6, "Mật khẩu phải có độ dài từ 6 đến 24 ký tự")
    .max(24, "Mật khẩu phải có độ dài từ 6 đến 24 ký tự"),
  newPassword: yup
    .string()
    .required("Vui lòng không bỏ trống mật khẩu mới")
    .min(6, "Mật khẩu phải có độ dài từ 6 đến 24 ký tự")
    .max(24, "Mật khẩu phải có độ dài từ 6 đến 24 ký tự")
    .matches(/^[a-zA-Z0-9]*$/, "Mật khẩu không được chứa ký tự đặc biệt"),
  checkNewPass: yup
    .string()
    .required("Vui lòng không bỏ trống xác nhận mật khẩu")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không trùng khớp"),
});

const validateFormRegister = yup.object({
  email: yup
    .string()
    .email("Email không đúng định dạng, ví dụ: example@gmail.com")
    .required("Vui lòng không bỏ trống email"),
  passWord: yup
    .string()
    .required("Vui lòng không bỏ trống mật khẩu")
    .min(6, "Mật khẩu yêu cầu trên 6 ký tự và không quá 32 ký tự")
    .max(52, "Mật khẩu yêu cầu trên 6 ký tự và không quá 32 ký tự"),
});

// Format giá thành VND
type CurrencyFormatOptions = {
  style: "currency";
  currency: string;
  maximumFractionDigits: number;
};

const formatPriceVND = (data?: number) => {
  const config: CurrencyFormatOptions = {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 9,
  };
  return new Intl.NumberFormat("vi-VN", config)
    .format(data || 0)
    .slice(0, -1);
};

// Lấy khoảng thời gian tùy chỉnh
const takeTimeCustom = (data: string): { first: string; end: string } => {
  const today = moment().format("YYYY-MM-DD");
  const now = moment().format("YYYY-MM-DDTHH:mm:ss");

  switch (data) {
    case "today":
      return { first: `${today}T00:00:00`, end: now };

    case "preDay":
      const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
      return { first: `${yesterday}T00:00:00`, end: `${yesterday}T23:59:59` };

    case "pre30":
      const thirtyDaysAgo = moment().subtract(30, "days").format("YYYY-MM-DD");
      return { first: `${thirtyDaysAgo}T00:00:00`, end: now };

    case "thisMonth":
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      return { first: `${startOfMonth}T00:00:00`, end: now };

    case "preMonth":
      const lastMonth = moment().subtract(1, "month");
      const startOfLastMonth = lastMonth.startOf("month").format("YYYY-MM-DD");
      const endOfLastMonth = lastMonth.endOf("month").format("YYYY-MM-DD");
      return {
        first: `${startOfLastMonth}T00:00:00`,
        end: `${endOfLastMonth}T23:59:59`,
      };

    default:
      return { first: "", end: "" };
  }
};

// Rút gọn nội dung
function shortenContent(content: string, maxLength = 40) {
  return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
}

// Lấy kích thước màn hình hiện tại
function getClientSize() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
  };
}

// Validate email nhập vào
function validateEmail(email: string) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

// Check đăng nhập
const checkIsLoggedIn = () => {
  try {
    const token = localStorage.getItem(CONST.STORAGE.ACCESS_TOKEN);
    return !!token;
  } catch (error) {
    return false;
  }
};

// Kiểm tra router có yêu cầu quyền truy cập không
interface RouterConfig {
  path: string;
  isPrivate?: boolean;
  children?: RouterConfig[];
}

const isPrivateRouter = (paths: string[], routers: RouterConfig[]): boolean => {
  if (!paths.length) return false;
  const [currentPath, ...remainingPaths] = paths;
  const currentRouter = routers.find((router) => router.path === currentPath);
  return currentRouter?.isPrivate
    ? true
    : currentRouter?.children
    ? isPrivateRouter(remainingPaths, currentRouter.children)
    : false;
};

// Quản lý cookies
function createCookie(name: string, value: any, days: number) {
  const domain = window.location.hostname;
  const expires = days
    ? "; expires=" + new Date(Date.now() + days * 864e5).toUTCString()
    : "";
  document.cookie = `${name}=${value}${expires}; path=/; domain=${domain}`;
}

function createCookieOtp(name: string, value: any, days: number) {
  const expires = days
    ? "; expires=" + new Date(Date.now() + days * 864e5).toUTCString()
    : "";
  document.cookie = `${name}=${value}${expires}; path=/`;
}

function readCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}

function destroyCookie(name: string) {
  createCookie(name, "", -1);
}

// Chuyển đổi tiền tệ
type ConvertCurrencyPropsType = {
  price: number | string;
  exchangeRate: number | string;
  fixed?: number;
};

const convertCurrency = ({
  price,
  exchangeRate,
  fixed = 10,
}: ConvertCurrencyPropsType) => {
  return formatPriceVND(
    Number((Number(price) * Number(exchangeRate)).toFixed(fixed))
  );
};

export {
  formatPriceVND,
  validateForm,
  takeTimeCustom,
  validateFormRegister,
  shortenContent,
  getClientSize,
  validateEmail,
  validateFormChangePassWord,
  checkIsLoggedIn,
  isPrivateRouter,
  createCookie,
  readCookie,
  destroyCookie,
  createCookieOtp,
  convertCurrency,
};
