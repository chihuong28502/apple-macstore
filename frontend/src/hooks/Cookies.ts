export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  // Kiểm tra nếu mảng có 2 phần tử
  if (parts.length === 2) {
    const lastPart = parts.pop(); // Lấy phần tử cuối cùng
    if (lastPart) { // Kiểm tra nếu phần tử không phải undefined
      return lastPart.split(';').shift(); // Trả về phần tử đầu tiên sau khi chia
    }
  }
  return undefined; // Trả về undefined nếu không tìm thấy cookie
}
