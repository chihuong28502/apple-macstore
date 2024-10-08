import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { KeywordFeaturedRequest } from './request';
import { KeywordFeaturedActions, Tip } from './slice';

interface KeywordFeaturedResponse {
  data: {
    exact_keyword: Tip[];
    related_keywords: Tip[];
  };
}

function* fetchKeywordFeaturedSaga(action: PayloadAction<string>): Generator<any, void, KeywordFeaturedResponse> {
  try {
    const response: KeywordFeaturedResponse = yield call(KeywordFeaturedRequest.getKeywordFeaturedTips, action.payload);
    yield put(KeywordFeaturedActions.fetchKeywordFeaturedSuccess({
      exact: response.data.exact_keyword || [],
      related: response.data.related_keywords || []
    }));
  } catch (error: any) {
    yield put(KeywordFeaturedActions.fetchKeywordFeaturedFailure(error.message || "An error occurred"));
  }
}

export function* aiKeywordSaga(): Generator {
  yield takeLatest(KeywordFeaturedActions.fetchKeywordFeaturedStart.type, fetchKeywordFeaturedSaga);
}