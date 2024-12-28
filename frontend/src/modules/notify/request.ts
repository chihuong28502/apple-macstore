import APPLEFetch from "@/core/services/fetch";
export const NotifyRequest = {
  getAllNotifys(id: any) {
    return APPLEFetch.get(`/notify/${id}`);
  },
};
