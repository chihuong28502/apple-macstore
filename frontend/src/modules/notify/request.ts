import MSTFetch from "@/core/services/fetch";
export const NotifyRequest = {
  getAllNotifys(id: any) {
    return MSTFetch.get(`/notify/${id}`);
  },
};
