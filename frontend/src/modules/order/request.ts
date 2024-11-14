import MSTFetch from "@/core/services/fetch";

export const OrderRequest = {
  addOrder(item: any) {
    console.log("🚀 ~ item:", item)
    return MSTFetch.post("/order", item);
  },
  getAllOrder() {
    return MSTFetch.get("/user");
  },
  getOrderById(id: any) {
    return MSTFetch.get(`/user/${id}`);
  },
  updateOrderById(id: string, data: any) {
    return MSTFetch.put(`/user/update/${id}`, data);
  },
  deleteOrder(id: string) {
    return MSTFetch.delete(`/user/delete/${id}`);
  },
};
