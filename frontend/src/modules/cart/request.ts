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
  updateCart({ userId, items }: any) {
    return MSTFetch.put(`/cart/update/${userId}`, {
      items: items,
    });
  }, deleteItemByCard({ userId, items }: any) {
    const itemsArray = Array.isArray(items) ? items : [items];
    return MSTFetch.delete(`/cart/delete/${userId}`, {
      data: { items: itemsArray }
    });
  },
};
