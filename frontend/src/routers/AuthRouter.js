import { Switch, Route, Redirect } from "react-router-dom";
// import { useLocation } from "react-router";
import { CreateAccount } from "../screens/createaccount.js";
import { Login } from "../screens/login.js";
import { NavBar } from "../components/navbar.js";
// import { useEffect } from "react";
// import { getCSRFToken } from "../helpers/csrfToken.js";

export const AuthRouter = () => {
  // let location = useLocation();
  // console.log("AuthRouter", location);

  //  CSRF Tokens
  // useEffect(() => {
  //   getCSRFToken();
  // }, []);

  return (
    <>
      <NavBar />
      <div className="container" style={{ padding: "20px" }}>
        <Switch>
          <Route exact path="/auth/login" component={Login} />
          <Route exact path="/auth/createAccount" component={CreateAccount} />
          <Redirect to="/auth/login" />
        </Switch>
      </div>
    </>
  );
};
