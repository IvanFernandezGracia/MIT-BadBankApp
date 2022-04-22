import { triggerEventListeners } from "../event/eventsListeners.js";
import { store } from "../store/store.js";
import { types } from "../types/types.js";
import { getCSRFToken } from "./csrfToken.js";

const msgErrorReloadPage = [
  "invalid csrf token",
  "Required token (access/refresh)",
  "Token access invalid",
  "Token Refresh dont exist or Token Refresh is not same DB or Token Access havent create by Token Refresh",
  "Invalid Token Access - user does not exist DB",
  "Invalid Token Access by server",
  "user successfully registered! , now login",
  "Error verify token refresh",
];

const verifyMessageErrorReloadPage = (response, body) => {
  if (response.status === 401) {
    setTimeout(function () {
      window.location.reload();
    }, 3000);
    return `SESSION EXPIRED: NONAUTORIZATE`;
  }
  const messageError = body.msg || body.message || null;
  if (msgErrorReloadPage.includes(messageError)) {
    setTimeout(function () {
      window.location.reload();
    }, 3000);
    return `SESSION EXPIRED: ${messageError}`;
  } else {
    return body.message;
  }
};

///////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////////////////////////////////////////////

const requestWithoutToken = async (endpoint, data, method = "GET") => {
  const url = `/api/${endpoint}`;
  // Read the CSRF token from the <meta> tag
  const token_csrf =
    document.head
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content") || "";

  if (method === "GET") {
    return fetch(url, {
      credentials: "include", //Cookies (refresh and CSRF)
      method: "GET",
    })
      .then(async (response) => {
        const body = await response.json();
        body.message = verifyMessageErrorReloadPage(response, body);
        return { resp: response, body };
      })
      .catch(() => {});
  } else {
    return fetch(url, {
      credentials: "include", //Cookies (refresh and CSRF)
      method,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        _csrf: token_csrf,
      }),
    })
      .then(async (response) => {
        const existNewTokenRefresh = response.headers.get("newrefreshtoken");
        if (existNewTokenRefresh) {
          triggerEventListeners("new-token-refresh-received");
          await getCSRFToken();
        }
        const body = await response.json();
        body.message = verifyMessageErrorReloadPage(response, body);
        return { resp: response, body };
      })
      .catch(() => {});
  }
};

///////////////////////////////////////////////////
//////////////////// TODO:[TOKEN] ////////////////////////////////
/////////////////////////////////////////////////////

const requestWithToken = async (endpoint, data, method = "GET") => {
  await store.dispatch({
    type: types.isLoadingFetchStart,
  });
  const url = `/api/${endpoint}`;
  // Read the CSRF token from the <meta> tag
  const token_csrf =
    document.head
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content") || "";

  const token_access = await store.getState().authUser.token_access;

  if (method === "GET") {
    return fetch(url, {
      credentials: "include", //Cookies (refresh and CSRF)
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token_access: token_access || "",
      },
    })
      .then(async (response) => {
        await store.dispatch({
          type: types.isLoadingFetchFinish,
        });
        const newTokenAccess = response.headers.get("newaccesstoken");
        const existNewTokenRefresh = response.headers.get("newrefreshtoken");
        if (newTokenAccess) {
          await store.dispatch({
            type: types.authRefreshTokenAccess,
            payload: {
              token_access: newTokenAccess,
            },
          });
        }
        if (existNewTokenRefresh) {
          triggerEventListeners("new-token-refresh-received");
          await getCSRFToken();
        }

        const body = await response.json();
        body.message = verifyMessageErrorReloadPage(response, body);
        return { resp: response, body };
      })
      .catch(() => {
        store.dispatch({
          type: types.isLoadingFetchFinish,
        });
      });
  } else {
    return fetch(url, {
      credentials: "include", //Cookies (refresh and CSRF)
      method,
      headers: {
        "Content-type": "application/json",
        token_access: token_access || "",
      },
      body: JSON.stringify({
        ...data,
        _csrf: token_csrf,
      }),
    })
      .then(async (response) => {
        await store.dispatch({
          type: types.isLoadingFetchFinish,
        });
        const newTokenAccess = response.headers.get("newaccesstoken");
        const existNewTokenRefresh = response.headers.get("newrefreshtoken");
        if (newTokenAccess) {
          await store.dispatch({
            type: types.authRefreshTokenAccess,
            payload: {
              token_access: newTokenAccess,
            },
          });
        }
        if (existNewTokenRefresh) {
          triggerEventListeners("new-token-refresh-received");
          await getCSRFToken();
        }
        const body = await response.json();
        body.message = verifyMessageErrorReloadPage(response, body);
        return { resp: response, body };
      })
      .catch(() => {
        store.dispatch({
          type: types.isLoadingFetchFinish,
        });
      });
  }
};

export { requestWithoutToken, requestWithToken };
