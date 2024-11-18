import MSTFetch from "@/core/services/fetch";

export const OrderRequest = {
  addOrder(item: any) {
    return MSTFetch.post("/order", item);
  },
  getAllOrder() {
    return MSTFetch.get("/order");
  },
  getOrderById(id: any) {
    return MSTFetch.get(`/order/user/${id}`);
  },
  updateStatusOrderById(id: string, data: any) {
    return MSTFetch.put(`/order/update/status/${id}`, data);
  },
  updateOrderById(id: string, data: any) {
    return MSTFetch.put(`/order/update/${id}`, data);
  },
  deleteOrder(id: string) {
    return MSTFetch.delete(`/order/delete/${id}`);
  },
};
