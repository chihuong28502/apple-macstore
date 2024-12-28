import APPLEFetch from "@/core/services/fetch";
export const IntroductionRequest = {
  getAllIntroductionByAds() {
    return APPLEFetch.get(`/introductions/ads`);
  },
  getAllIntroductionByBanner() {
    return APPLEFetch.get(`/introductions/banner`);
  },
};
