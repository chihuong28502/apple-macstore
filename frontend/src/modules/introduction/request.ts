import MSTFetch from "@/core/services/fetch";
export const IntroductionRequest = {
  getAllIntroductionByAds() {
    return MSTFetch.get(`/introductions/ads`);
  },
  getAllIntroductionByBanner() {
    return MSTFetch.get(`/introductions/banner`);
  },
};
