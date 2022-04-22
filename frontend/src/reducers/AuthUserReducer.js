import { types } from "../types/types";

const initialState = {
  checkingIsLogged: true,
  isLogged: false,
  token_access: null,
  name: null,
  email: null,
  url_image: null,
  balance: null,
  lastTransaction: { amount: null, date: null, uid: null, type: null },
};

export const authUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.authLoggedIn:
      return {
        ...state,
        ...action.payload,
        isLogged: true,
        checkingIsLogged: false,
      };

    case types.authCheckingIsLoggedFinish:
      return {
        ...state,
        checkingIsLogged: false,
      };

    case types.authNewDeposit:
      return {
        ...state,
        balance: action.payload.balance,
        lastTransaction: {
          ...initialState.lastTransaction,
          ...action.payload.deposit,
          type: "Deposit",
        },
      };

    case types.authNewWhitdraw:
      return {
        ...state,
        balance: action.payload.balance,
        lastTransaction: {
          ...initialState.lastTransaction,
          ...action.payload.whitdraw,
          type: "Whitdraw",
        },
      };

    case types.authLogout:
      return {
        ...initialState,
        checkingIsLogged: false,
      };

    case types.authRefreshTokenAccess:
      return {
        ...state,
        token_access: action.payload.token_access,
      };

    case types.authNewPayment:
      return {
        ...state,
        balance: action.payload.balance,
        lastTransaction: {
          ...initialState.lastTransaction,
          ...action.payload.payment,
          type: "Payment",
        },
      };

    default:
      return state;
  }
};
