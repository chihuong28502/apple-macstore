import MSTFetch from "@/core/services/fetch";

export const ProductRequest = {
  createProduct(data: any) {
    return MSTFetch.post("/products", data,{ withCredentials: true });
  },

  getProductById(id: string) {
    return MSTFetch.get(`/products/${id}`,{ withCredentials: true });
  },

  updateProduct(id: string, data: any) {
    return MSTFetch.put(`/products/${id}`, data,{ withCredentials: true });
  },

  deleteProduct(id: string) {
    return MSTFetch.delete(`/products/${id}`,{ withCredentials: true });
  },

  getAllProducts({ page, limit, categoryId,minPrice,maxPrice }: { page: number; limit: number; categoryId?: string; minPrice?: number; maxPrice?: number }) {
    let url = `/products?page=${page}&limit=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    return MSTFetch.get(url,{ withCredentials: true });
  },
  getAllCategories() {
    return MSTFetch.get("/categories",{ withCredentials: true });  // Assuming this endpoint returns a list of categories
  },
};
