import APPLEFetch from "@/core/services/fetch";

export const CustomerRequest = {
  getAllCustomer() {
    return APPLEFetch.get("/user");
  },
  getCustomerById(id: any) {
    return APPLEFetch.get(`/user/${id}`);
  },
  updateCustomerById(id: string, data: any) {
    return APPLEFetch.put(`/user/update/${id}`, data);
  }, 
  deleteCustomer(id: string) {
    return APPLEFetch.delete(`/user/delete/${id}`);
  },
};
