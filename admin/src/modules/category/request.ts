import MSTFetch from "@/core/services/fetch";

import { CategoryType } from "./type";

export const CategoryRequest = {
  getAllCategories() {
    return MSTFetch.get("/categories");
  },
  createCategory(data: CategoryType) {
    return MSTFetch.post("/categories", data);
  },
  getCategoryById(id: string) {
  },

  updateCategory(id: string, data: any) {
    return MSTFetch.put(`/categories/update/${id}`, data);
  },
  deleteCategory(id: string) {
    return MSTFetch.delete(`/categories/delete/${id}`);
  },
};
