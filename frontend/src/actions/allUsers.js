import { types } from "../types/types";
import { requestWithToken } from "../helpers/handleFetch.js";
import { errorAlertFormat } from "../helpers/handleErrorSubmitAction.js";

export const startLoadingUsers = () => {
  return async (dispatch) => {
    const response = await requestWithToken("users/");
    const { resp, body } = response;
    console.log(body);
    if (resp.status === 200) {
      const users = body.users;
      // const stateAccount = body.stateAccount;

      dispatch({
        type: types.usersLoad,
        payload: {
          users: users ? users : [],
        },
      });

      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};

export const searchLoadingUsers = (term) => {
  return async (dispatch) => {
    const response = await requestWithToken(`users/${term}`);
    const { resp, body } = response;
    console.log(body);
    if (resp.status === 200) {
      const users = body.users;
      // const stateAccount = body.stateAccount;

      dispatch({
        type: types.usersLoad,
        payload: {
          users: users ? users : [],
        },
      });

      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};
