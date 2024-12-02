import MSTFetch from "@/core/services/fetch";
export const ReviewRequest = {
  getAllReviews(productId: any) {
    return MSTFetch.get(`/reviews/${productId}`);
  },
  deleteReview(id: any) {
    return MSTFetch.delete(`/reviews/delete/${id}`);
  },
  updateReview(id: string, payload: any) {
    return MSTFetch.patch(`/reviews/update/${id}`, payload);
  }
};
