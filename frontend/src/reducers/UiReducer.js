import { types } from "../types/types";

const initialState = {
  isLoading: false,
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.isLoadingFetchStart:
      return {
        ...state,
        isLoading: true,
      };
    case types.isLoadingFetchFinish:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
