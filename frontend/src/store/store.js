import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { authUserReducer } from "../reducers/AuthUserReducer";
import { uiReducer } from "../reducers/UiReducer";
import { allUsersReducer } from "../reducers/AllUsersReducer";

const composeEnhancers =
  (process.env.NODE_ENV !== "production" &&
    typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const reducers = combineReducers({
  authUser: authUserReducer,
  ui: uiReducer,
  allUsers: allUsersReducer,
});

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
);
