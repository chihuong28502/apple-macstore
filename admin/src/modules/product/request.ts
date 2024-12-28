import APPLEFetch from "@/core/services/fetch";

export const ProductRequest = {
  createProduct(data: any) {
    return APPLEFetch.post("/products", data);
  },

  getProductById(id: string) {
    return APPLEFetch.get(`/products/${id}`);
  },

  updateProduct(id: string, data: any) {
    return APPLEFetch.put(`/products/update/${id}`, data);
  },

  deleteProduct(id: string) {
    return APPLEFetch.delete(`/products/delete/${id}`);
  },

  getAllProducts({ page, limit, categoryId, minPrice, maxPrice }: { page: number; limit: number; categoryId?: string; minPrice?: number; maxPrice?: number }) {
    let url = `/products?page=${page || 1}&limit=${limit || 8}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 100000000}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    return APPLEFetch.get(url);
  },
  /// VARIANTS
  addVariantByProduct(data: any) {
    return APPLEFetch.post(`/products/variant`, data);
  },
  updateVariant(id: string, data: any) {
    return APPLEFetch.put(`/products/variant/update/${id}`, data);
  },
  getVariantByProduct(productId: string) {
    return APPLEFetch.get(`/products/variant?productId=${productId}`);
  },
  deleteVariant(id: string) {
    return APPLEFetch.delete(`/products/variant/delete/${id}`);
  },
};