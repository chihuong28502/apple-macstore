import MSTFetch from "@/core/services/fetch";

export const CustomerRequest = {
  getAllCustomer() {
    return MSTFetch.get("/user");
  },
  getCustomerById(id: any) {
    return MSTFetch.get(`/user/${id}`);
  },
  updateCustomerById(id: string, data: any) {
    "🚀 ~ data:", data)
    return MSTFetch.put(`/user/update/${id}`, data);
  }, 
  deleteCustomer(id: string) {
    return MSTFetch.delete(`/user/delete/${id}`);
  },
};
