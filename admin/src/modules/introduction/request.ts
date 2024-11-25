import MSTFetch from "@/core/services/fetch";


export const IntroductionRequest = {
  getAllIntroductions() {
    return MSTFetch.get("/introductions");
  },
  createIntroduction(data: any) {
    return MSTFetch.post("/introductions", data);
  },
  getIntroductionById(id: string) {
  },
  
  updateIntroduction(id: string, data: any) {
    return MSTFetch.put(`/introductions/update/${id}`, data);
  },
  deleteIntroduction(id: string) {
    return MSTFetch.delete(`/introductions/delete/${id}`);
  },
};
