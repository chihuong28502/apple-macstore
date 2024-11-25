import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/core/services/store";

// Định nghĩa kiểu dữ liệu cụ thể để tránh sử dụng `any`
type Introduction = {
  _id: string;
  images: {
    image: string;
    publicId: string;
  };
  name: string;
  description: string;
  // Thêm các trường khác nếu cần
}

type IntroductionState = {
  _id?: string;
  introduction?: Introduction[]; // Danh sách giới thiệu
  isLoading: boolean; // Trạng thái loading
  introductionByBanner?: Introduction[]; // Danh sách giới thiệu theo banner
  introductionByAds?: Introduction[]; // Danh sách giới thiệu theo quảng cáo
};

// Giá trị khởi tạo cho state
const initialState: IntroductionState = {
  introduction: [],
  introductionByBanner: [],
  introductionByAds: [],
  isLoading: false,
};

// Tạo slice
const IntroductionSlice = createSlice({
  name: "introduction",
  initialState,
  reducers: {
    // Reducer để set trạng thái loading
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },

    // Reducer để lấy tất cả giới thiệu
    fetchIntroduction: (state) => {
      state.isLoading = true;
    },
    setIntroduction: (state, { payload }: PayloadAction<Introduction[]>) => {
      state.introduction = payload;
      state.isLoading = false;
    },
    // Reducer để lấy giới thiệu theo banner
    fetchIntroductionByBanner: (state) => {
      state.isLoading = true;
    },
    setIntroductionByBanner: (
      state,
      { payload }: PayloadAction<Introduction[]>
    ) => {
      state.introductionByBanner = payload;
      state.isLoading = false;
    },
    // Reducer để lấy giới thiệu theo quảng cáo
    fetchIntroductionByAds: (state) => {
      state.isLoading = true;
    },
    setIntroductionByAds: (state, { payload }: PayloadAction<Introduction[]>) => {
      state.introductionByAds = payload;
      state.isLoading = false;
    },
  },
});

// Export reducer
const IntroductionReducer = IntroductionSlice.reducer;
export default IntroductionReducer;

// Export actions
export const IntroductionActions = IntroductionSlice.actions;

// Export selectors
export const IntroductionSelectors = {
  introduction: (state: RootState) => state.introduction.introduction,
  introductionByBanner: (state: RootState) => state.introduction.introductionByBanner,
  introductionByAds: (state: RootState) => state.introduction.introductionByAds,
  isLoading: (state: RootState) => state.introduction.isLoading,
};
