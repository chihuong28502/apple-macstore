export function extractPublicId(imageUrl: string): string {
  // Tách chuỗi bằng dấu "/" và lấy phần trước đuôi ".jpg" (hoặc ".png", v.v.)
  const parts = imageUrl.split('/');
  const fileName = parts[parts.length - 1]; // Lấy tên file (wb7gpvzhncukmfgwxpte.jpg)
  
  // Cắt bỏ phần đuôi .jpg (hoặc bất kỳ phần mở rộng nào khác)
  const publicId = fileName.split('.')[0];
  
  return publicId;
}