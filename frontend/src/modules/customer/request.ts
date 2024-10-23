import MSTFetch from "@/core/services/fetch";

export const CustomerRequest = {
  getByCustomer() {
    return MSTFetch.get("/customer");
  },
};
