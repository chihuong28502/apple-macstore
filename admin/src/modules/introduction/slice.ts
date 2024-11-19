import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";


type IntroductionState = {
  _id?: string;
  introductions?: any;
  isLoading: boolean;
  introductionById?: any
};

const initialState: IntroductionState = {
  introductions: [],
  isLoading: false,
  introductionById: null
};

const IntroductionSlice = createSlice({
  name: "introduction",
  initialState,
  reducers: {
    createIntroduction: (state: IntroductionState, { payload }: PayloadAction<any>) => {
    },
    updateIntroduction: (state: IntroductionState, { payload }: PayloadAction<any>) => { },
    deleteIntroduction: (state: any, { payload: any }) => {
    },

    setLoading: (state: IntroductionState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    fetchIntroductions: (state: IntroductionState) => { state.isLoading = true; },
    setIntroductions: (state: IntroductionState, { payload }: PayloadAction<any[]>) => {
      state.introductions = payload;
    },
    setIntroductionById: (state: IntroductionState, { payload }: PayloadAction<any[]>) => {
      state.introductionById = payload;
    },
  },
});

const IntroductionReducer = IntroductionSlice.reducer;
export default IntroductionReducer;

export const IntroductionActions = IntroductionSlice.actions;

export const IntroductionSelectors = {
  introductions: (state: RootState) => state.introduction.introductions,
  introductionById: (state: RootState) => state.introduction.introductionById,
  isLoading: (state: RootState) => state.introduction.isLoading,
};
