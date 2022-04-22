import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
// import { useLocation } from "react-router";

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  // let location = useLocation();
  //console.log("PrivateRoute", location);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/login" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
