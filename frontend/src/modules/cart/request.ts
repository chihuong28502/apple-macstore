import MSTFetch from "@/core/services/fetch";
export const CartRequest = {
  getCartById(id: any) {
    return MSTFetch.get(`/cart/${id}`);
  },
  addItemToCart({ id, item }: any) {
    return MSTFetch.post(`/cart/add-item`, {
      userId: id,
      item: item,
    });
  },
};
