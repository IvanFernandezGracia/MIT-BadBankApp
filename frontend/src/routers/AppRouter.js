import { Router, Switch, Redirect } from "react-router-dom";
import { PublicRoute } from "../routers/PublicRoute";
import { PrivateRoute } from "../routers/PrivateRoute";
import { AuthRouter } from "../routers/AuthRouter.js";
import { LoggedRouter } from "../routers/LoggedRouter.js";
import history from "../config/history.js";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGoogleSignIn } from "../actions/authUser";
// import { startCheckingIsLogged } from "../actions/authUser";

import Swal from "sweetalert2";
import { getCSRFToken } from "../helpers/csrfToken";
import { Loading } from "../components/loading";
import { types } from "../types/types";

export function AppRouter() {
  console.log("AppRouter");
  const dispatch = useDispatch();
  const { isLogged } = useSelector((state) => state.authUser);
  const { isLoading } = useSelector((state) => state.ui);

  // const { checkingIsLogged, isLogged } = useSelector(
  //   (state) => state.authUser
  // );

  //Function show google Sign in & One Tap

  const handleCredentialResponse = useCallback(
    async (response) => {
      dispatch({ type: types.isLoadingFetchStart });

      const id_token = response.credential;
      try {
        await getCSRFToken();
        const response = await dispatch(startGoogleSignIn(id_token));
        console.log("googleresponse", response);
        dispatch({ type: types.isLoadingFetchFinish });

        Swal.fire({
          icon: "success",
          title: `Google Sign In`,
          timer: 3500,
          showConfirmButton: false,
          html: `${`<b> ${response.msgTitle}</b> <br/>`}`,
        });
      } catch (err) {
        dispatch({ type: types.isLoadingFetchFinish });
        Swal.fire({
          icon: "error",
          title: `Google Sign In`,
          timer: 3500,
          showConfirmButton: false,
          html: `${err} , try again!`,
        });
      }
    },
    [dispatch]
    // [ctx, history]
  );

  useEffect(() => {
    window.handleCredentialResponse = handleCredentialResponse;
    return () => {
      delete window.handleCredentialResponse;
    };
  }, [handleCredentialResponse]);

  //Verify is Logged In: Token JWT Server save into LocalStorage and refresh
  // useEffect(() => {
  //   dispatch(startCheckingIsLogged());
  // }, [dispatch]);

  // if (checkingIsLogged) {
  //   return <h5>Wait checkingIsLogged...</h5>;
  // }

  return (
    <Router history={history}>
      <div>
        <Loading isLoading={isLoading}></Loading>
        <Switch>
          <PublicRoute
            path="/auth"
            component={AuthRouter}
            isAuthenticated={isLogged ? true : false}
          />
          <PrivateRoute
            path="/"
            component={LoggedRouter}
            isAuthenticated={isLogged ? true : false}
          />
          <Redirect to="/auth/login" />
        </Switch>
      </div>
    </Router>
  );
}
