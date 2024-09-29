import MSTFetch from "@/core/services/fetch";

export const ProductRequest = {
  createProduct(data: any) {
    return MSTFetch.post("/products", data);
  },

  getProductById(id: string) {
    return MSTFetch.get(`/products/${id}`);
  },

  updateProduct(id: string, data: any) {
    return MSTFetch.put(`/products/${id}`, data);
  },

  deleteProduct(id: string) {
    return MSTFetch.delete(`/products/${id}`);
  },

  // Hàm lấy tất cả sản phẩm với phân trang và category
  getAllProducts({ page, limit, categoryId }: { page: number; limit: number; categoryId?: string }) {
    let url = `/products?page=${page}&limit=${limit}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    return MSTFetch.get(url);
  },
  getAllCategories() {
    return MSTFetch.get("/categories");  // Assuming this endpoint returns a list of categories
  },
};
