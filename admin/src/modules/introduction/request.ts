import APPLEFetch from "@/core/services/fetch";


export const IntroductionRequest = {
  getAllIntroductions() {
    return APPLEFetch.get("/introductions");
  },
  createIntroduction(data: any) {
    return APPLEFetch.post("/introductions", data);
  },
  getIntroductionById(id: string) {
  },
  
  updateIntroduction(id: string, data: any) {
    return APPLEFetch.put(`/introductions/update/${id}`, data);
  },
  deleteIntroduction(id: string) {
    return APPLEFetch.delete(`/introductions/delete/${id}`);
  },
};
