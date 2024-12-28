import APPLEFetch from "@/core/services/fetch";

export const CustomerRequest = {
  getByCustomer() {
    return APPLEFetch.get("/customer");
  },
  // SHIPPING
  postShippingByUser({ id, item }: any) {
    return APPLEFetch.post(`/user/shipping/${id}`, item);
  },
  getShippingByUser(id: string) {
    return APPLEFetch.get(`/user?userId=${id}/shipping`);
  },
  updateShippingByUser(payload: any) {
    return APPLEFetch.put(`/user/${payload.userId}/shipping/${payload.shippingId}`, payload.item);
  },
  deleteShippingByUser(payload: any) {
    return APPLEFetch.delete(`/user/${payload.userId}/shipping/${payload.shippingId}`);
  }
};
