import MSTFetch from "@/core/services/fetch";

import { CategoryType } from "./type";

export const CategoryRequest = {
  getAllCategories() {
    return MSTFetch.get("/categories");
  },
  createCategory(data: CategoryType) {
    console.log("🚀 ~ data:", data)
    return MSTFetch.post("/categories", data);
  },
  getCategoryById(id: string) {
    return MSTFetch.get(`/categories/${id}`);
  },

  updateCategory(id: string, data: any) {
    return MSTFetch.put(`/categories/update/${id}`, data);
  },
  deleteCategory(id: string) {
    return MSTFetch.delete(`/categories/delete/${id}`);
  },
 

};
