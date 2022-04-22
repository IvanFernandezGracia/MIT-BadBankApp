import { types } from "../types/types";

const initialState = {
  users: [
    {
      name: "Name",
      email: "email@gmail.com",
      balance: "10",
      "url-image": `https://bootdey.com/img/Content/avatar/avatar2.png`,
    },
  ],
};

export const allUsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.usersLoad:
      return {
        ...state,
        users: [...action.payload.users],
      };
    case types.usersUpdated:
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.email === action.payload.payment.from) {
            return {
              ...user,
              balance: action.payload.balance,
            };
          }
          if (user.email === action.payload.payment.to) {
            return {
              ...user,
              balance: user.balance + action.payload.payment.amount,
            };
          }
          return user;
        }),
      };
    default:
      return state;
  }
};
