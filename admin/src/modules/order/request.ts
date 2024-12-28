import APPLEFetch from "@/core/services/fetch";

export const OrderRequest = {
  addOrder(item: any) {
    return APPLEFetch.post("/order", item);
  },
  getAllOrder() {
    return APPLEFetch.get("/order");
  },
  getOrderById(id: any) {
    return APPLEFetch.get(`/order/user/${id}`);
  },
  updateStatusOrderById(id: string, data: any) {
    return APPLEFetch.put(`/order/update/status/${id}`, data);
  },
  updateOrderById(id: string, data: any) {
    return APPLEFetch.put(`/order/update/${id}`, data);
  },
  deleteOrder(id: string) {
    return APPLEFetch.delete(`/order/delete/${id}`);
  },
};
