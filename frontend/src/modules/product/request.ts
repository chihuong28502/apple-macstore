import MSTFetch from "@/core/services/fetch";

export const ProductRequest = {
  createProduct(data: any) {
    return MSTFetch.post("/products", data);
  },

  getProductById(id: string) {
    return MSTFetch.get(`/products/${id}`);
  },
  getAllProducts({ page, limit, categoryId, minPrice, maxPrice }: { page: number; limit: number; categoryId?: string; minPrice?: number; maxPrice?: number }) {
    let url = `/products?page=${page || 1}&limit=${limit || 8}&isPublic=${1}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 100000000}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    return MSTFetch.get(url);
  },
  getAllCategories() {
    return MSTFetch.get("/categories");
  },
  
};
