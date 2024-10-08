import MSTFetch from "@/core/services/fetch";

export const KeywordFeaturedRequest = {
  getKeywordFeaturedTips: (keyword: string) => {
    return MSTFetch.post(`/rp/ai-tools-keywords?keyword=${keyword}`);
  },
};