import MSTFetch from "@/core/services/fetch";

export const ProductRequest = {
  createProduct(data: any) {
    return MSTFetch.post("/products", data);
  },

  getProductById(id: string) {
    return MSTFetch.get(`/products/${id}`);
  },

  updateProduct(id: string, data: any) {
    return MSTFetch.put(`/products/update/${id}`, data);
  },

  deleteProduct(id: string) {
    return MSTFetch.delete(`/products/delete/${id}`);
  },

  getAllProducts({ page, limit, categoryId, minPrice, maxPrice }: { page: number; limit: number; categoryId?: string; minPrice?: number; maxPrice?: number }) {
    let url = `/products?page=${page || 1}&limit=${limit || 8}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 100000000}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    return MSTFetch.get(url);
  },
  /// VARIANTS
  addVariantByProduct(data: any) {
    return MSTFetch.post(`/products/variant`, data);
  },
  updateVariant(id: string, data: any) {
    return MSTFetch.put(`/products/variant/update/${id}`, data);
  },
  getVariantByProduct(productId: string) {
    return MSTFetch.get(`/products/variant?productId=${productId}`);
  },
  deleteVariant(id: string) {
    return MSTFetch.delete(`/products/variant/delete/${id}`);
  },
};