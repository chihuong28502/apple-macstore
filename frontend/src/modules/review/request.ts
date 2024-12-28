import APPLEFetch from "@/core/services/fetch";
export const ReviewRequest = {
  addReview(data: any) {
    return APPLEFetch.post(`/reviews/create`, data);
  },
  getAllReviews(productId: any) {
    return APPLEFetch.get(`/reviews/${productId}`);
  },
  deleteReview(id: any) {
    return APPLEFetch.delete(`/reviews/delete/${id}`);
  },
  updateReview(id: string, payload: any) {
    return APPLEFetch.patch(`/reviews/update/${id}`, payload);
  }
};
