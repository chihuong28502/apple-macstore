import APPLEFetch from "@/core/services/fetch";

import { CategoryType } from "./type";

export const CategoryRequest = {
  getAllCategories() {
    return APPLEFetch.get("/categories");
  },
  createCategory(data: CategoryType) {
    return APPLEFetch.post("/categories", data);
  },
  getCategoryById(id: string) {
  },

  updateCategory(id: string, data: any) {
    return APPLEFetch.put(`/categories/update/${id}`, data);
  },
  deleteCategory(id: string) {
    return APPLEFetch.delete(`/categories/delete/${id}`);
  },
};
