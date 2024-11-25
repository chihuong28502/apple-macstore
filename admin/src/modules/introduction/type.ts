
export interface CategoryType {
  name: string;
  parentCategoryId: string | null;
  breadcrumbs: string[];
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data: CategoryType; 
}
