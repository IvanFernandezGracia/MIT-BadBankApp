import {
  requestWithoutToken,
  requestWithToken,
} from "../helpers/handleFetch.js";
import { types } from "../types/types";
import { errorAlertFormat } from "../helpers/handleErrorSubmitAction.js";

export const startLogin = (email, password) => {
  return async (dispatch) => {
    const response = await requestWithoutToken(
      "auth/login",
      { email, password },
      "POST"
    );
    const { resp, body } = response;
    console.log(body);
    if (resp.status === 200 && body.token_access) {
      const user = body.user;
      const stateAccount = body.stateAccount;
      const token_access = body.token_access;

      dispatch({
        type: types.authLoggedIn,
        payload: {
          name: user.name,
          email: user.email,
          url_image: user.url_image,
          balance: stateAccount.balance,
          token_access: token_access,
        },
      });
      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};

export const startRegister = (email, password, name) => {
  return async (dispatch) => {
    const response = await requestWithoutToken(
      "auth/createAccount",
      { email, password, name },
      "POST"
    );
    const { resp, body } = response;
    console.log(body);

    if (resp.status === 201 && body.token_access) {
      const user = body.user;
      const stateAccount = body.stateAccount;
      const token_access = body.token_access;

      dispatch({
        type: types.authLoggedIn,
        payload: {
          name: user.name,
          email: user.email,
          url_image: user.url_image,
          balance: stateAccount.balance,
          token_access: token_access,
        },
      });
      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};

export const startGoogleSignIn = (idtoken) => {
  return async (dispatch) => {
    const response = await requestWithoutToken(
      "auth/google",
      { id_token: idtoken },
      "POST"
    );
    const { resp, body } = response;
    console.log(body);
    if (resp.status === 200 && body.token_access) {
      const user = body.user;
      const stateAccount = body.stateAccount;
      const token_access = body.token_access;
      console.log(body);
      dispatch({
        type: types.authLoggedIn,
        payload: {
          name: user.name,
          email: user.email,
          url_image: user.url_image,
          balance: stateAccount.balance,
          token_access: token_access,
        },
      });
      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};

export const startDeposit = (amount) => {
  return async (dispatch) => {
    const response = await requestWithToken(
      "deposits/",
      { amount: amount },
      "POST"
    );

    const { resp, body } = response;

    if (body.deposit && body.balance) {
      const deposit = body.deposit;
      const balance = body.balance;

      dispatch({
        type: types.authNewDeposit,
        payload: {
          balance,
          deposit,
        },
      });
    }

    if (resp.status === 201) {
      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};

export const startWhitdraw = (amount) => {
  return async (dispatch) => {
    const response = await requestWithToken(
      "whitdraws/",
      { amount: amount },
      "POST"
    );
    const { resp, body } = response;

    if (body.whitdraw && body.balance) {
      const whitdraw = body.whitdraw;
      const balance = body.balance;

      dispatch({
        type: types.authNewWhitdraw,
        payload: {
          balance,
          whitdraw,
        },
      });
    }

    if (resp.status === 201) {
      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};

export const startLogout = () => {
  return async (dispatch) => {
    const response = await requestWithToken("auth/logout");
    const { resp, body } = response;
    console.log(body);
    if (resp.status === 200) {
      dispatch({ type: types.authLogout });
      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};

export const startPayment = (amount, email) => {
  return async (dispatch) => {
    const response = await requestWithToken(
      "payments/",
      { amount: amount, email: email },
      "POST"
    );

    const { resp, body } = response;
    console.log(body);
    if (body.payment && body.balance) {
      const payment = body.payment;
      const balance = body.balance;

      dispatch({
        type: types.authNewPayment,
        payload: {
          balance,
          payment,
        },
      });

      dispatch({
        type: types.usersUpdated,
        payload: {
          balance,
          payment,
        },
      });

    }

    if (resp.status === 201) {
      return { state: true, msgTitle: "has been successful!" };
    } else {
      throw errorAlertFormat("", "", body);
    }
  };
};

// export const startCheckingIsLogged = () => {
//   return async (dispatch) => {
//     try {
//       dispatch({ type: types.authCheckingIsLoggedFinish });

//       // const response = await requestWithToken("auth/renew");
//       // const { body } = response;

//       // //      if (body.ok) {
//       // if (false) {
//       //   localStorage.setItem("token", body.token);
//       //   localStorage.setItem("token-init-date", new Date().getTime());

//       //   const user = body.user;

//       //   dispatch({
//       //     type: types.authLoggedIn,
//       //     payload: {
//       //       name: user.name,
//       //       email: user.email,
//       //       url_image: user.url_image,
//       //       balance: user.balance,
//       //     },
//       //   });
//       // } else {
//       //   Swal.fire(
//       //     "Error",
//       //     "error of the token sent in the request to the server to be verified",
//       //     "error"
//       //   );
//       //   dispatch({ type: types.authCheckingIsLoggedFinish });
//       // }
//     } catch (err) {
//       //   Swal.fire("Error", err.msg, "error");
//       dispatch({ type: types.authCheckingIsLoggedFinish });
//     }
//   };
// };
