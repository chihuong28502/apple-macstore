export const extractPublicId = (url: string): string => {
  // Sử dụng biểu thức chính quy để lấy phần "APPLE_STORE/brvezk0zg9mtnby06pe0"
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : '';
};