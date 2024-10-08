import { RootState } from "@/core/services/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Tip {
  keyword: string;
  monthlysearch: number;
  competition_score: number;
  difficulty: string;
  overallscore: number;
}

export type KeywordFeaturedInitialStateType = {
  keywords: Tip[];
  keywordsRelated: Tip[];
  isLoading: boolean;
  error: string | null;
};

const initialState: KeywordFeaturedInitialStateType = {
  keywords: [],
  keywordsRelated: [],
  isLoading: false,
  error: null,
};

const KeywordFeaturedSlice = createSlice({
  name: "keywordFeatured",
  initialState,
  reducers: {
    fetchKeywordFeaturedStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchKeywordFeaturedSuccess(
      state,
      action: PayloadAction<{ exact: Tip[]; related: Tip[] }>
    ) {
      state.isLoading = false;
      state.keywords = action.payload.exact;
      state.keywordsRelated = action.payload.related;
    },
    fetchKeywordFeaturedFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearKeywordFeatured(state) {
      Object.assign(state, initialState);
    },
  },
});

const aiKeywordReducer = KeywordFeaturedSlice.reducer;
export default aiKeywordReducer;

export const KeywordFeaturedActions = KeywordFeaturedSlice.actions;

export const KeywordFeaturedSelectors = {
  keywords: (state: RootState) => state.aiKeyword.keywords ?? [],
  keywordsRelated: (state: RootState) => state.aiKeyword.keywordsRelated  ?? [],
  isLoading: (state: RootState) => state.aiKeyword.isLoading ?? false,
  error: (state: RootState) => state.aiKeyword.error ?? null,
};
