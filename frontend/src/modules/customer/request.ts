import MSTFetch from "@/core/services/fetch";

export const CustomerRequest = {
  getByCustomer() {
    return MSTFetch.get("/customer");
  },
  // SHIPPING
  postShippingByUser({ id, item }: any) {
    return MSTFetch.post(`/user/shipping/${id}`, item);
  },
  getShippingByUser(id: string) {
    return MSTFetch.get(`/user?userId=${id}/shipping`);
  },
  updateShippingByUser(payload: any) {
    return MSTFetch.put(`/user/${payload.userId}/shipping/${payload.shippingId}`, payload.item);
  },
  deleteShippingByUser(payload: any) {
    return MSTFetch.delete(`/user/${payload.userId}/shipping/${payload.shippingId}`);
  }
};
