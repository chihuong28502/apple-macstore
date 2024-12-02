import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";


type ReviewState = {
  _id?: string;
  review?: any;
  isLoading: boolean;
  isLoadingReviewByProductId: boolean;
  reviewById?: any
  reviewByProductId?: any;
};
interface Review {
  _id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string;
}
const initialState: ReviewState = {
  reviewByProductId: null,
  review: null,
  isLoading: false,
  isLoadingReviewByProductId: false,
  reviewById: null
};

const ReviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    fetchReviewById: (
      state: ReviewState,
      { payload }: PayloadAction<string>
    ) => {
      state.isLoading = true;
    },
    fetchReviewByProductId: (
      state: ReviewState,
      { payload }: PayloadAction<string>
    ) => {
      state.isLoadingReviewByProductId = true;
    },
    setLoading: (state: ReviewState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setLoadingReviewByProductId: (state: ReviewState, { payload }: PayloadAction<boolean>) => {
      state.isLoadingReviewByProductId = payload;
    },
    editReview: (state: ReviewState, { payload }: PayloadAction<boolean>) => {
      // This will be handled by a saga
    },
    updateReview: (state, action: PayloadAction<Review>) => {
      const index = state.reviewByProductId.findIndex((review: any) => review._id === action.payload._id);
      if (index !== -1) {
        state.reviewByProductId[index] = action.payload;
      }
    },
    deleteReview: (state, action: PayloadAction<{ productId: string; reviewId: string }>) => {
    },
    removeReview: (state, action: PayloadAction<string>) => {
      state.reviewByProductId = state.reviewByProductId.filter((review: any) => review._id !== action.payload);
    },
    fetchReview: (state: ReviewState) => { state.isLoading = true; },
    setReview: (state: ReviewState, { payload }: PayloadAction<any[]>) => {
      state.review = payload;
    },
    setReviewByProductId: (state: ReviewState, { payload }: PayloadAction<any[]>) => {
      state.reviewByProductId = payload;
    },
    setReviewById: (state: ReviewState, { payload }: PayloadAction<any[]>) => {
      state.reviewById = payload;
    },
  },
});

const ReviewReducer = ReviewSlice.reducer;
export default ReviewReducer;

export const ReviewActions = ReviewSlice.actions;

export const ReviewSelectors = {
  review: (state: RootState) => state.review.review,
  reviewById: (state: RootState) => state.review.reviewById,
  reviewByProductId: (state: RootState) => state.review.reviewByProductId,
  isLoading: (state: RootState) => state.review.isLoading,
  isLoadingReviewByProductId: (state: RootState) => state.review.isLoadingReviewByProductId,
};
