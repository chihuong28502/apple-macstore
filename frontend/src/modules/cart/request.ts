import APPLEFetch from "@/core/services/fetch";
export const CartRequest = {
  getCartById(id: any) {
    return APPLEFetch.get(`/cart/${id}`);
  },
  addItemToCart({ id, item }: any) {
    return APPLEFetch.post(`/cart/add-item`, {
      userId: id,
      item: item,
    });
  },
  updateCart({ userId, items }: any) {
    return APPLEFetch.put(`/cart/update/${userId}`, {
      items: items,
    });
  }, deleteItemByCard({ userId, items }: any) {
    const itemsArray = Array.isArray(items) ? items : [items];
    return APPLEFetch.delete(`/cart/delete/${userId}`, {
      data: { items: itemsArray }
    });
  },
};
