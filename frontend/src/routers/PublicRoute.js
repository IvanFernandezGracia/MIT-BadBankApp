import React from "react";
import PropTypes from "prop-types";
// import { useLocation } from "react-router";

import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  // let location = useLocation();
  //console.log("PublicRoute",location)
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

PublicRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
