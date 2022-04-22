import React, { useCallback } from "react";
import { Home } from "../screens/home.js";
import { Deposit } from "../screens/deposit.js";
import { Withdraw } from "../screens/withdraw.js";
import { AllData } from "../screens/alldata.js";
import { useLocation } from "react-router";
import { Switch, Route } from "react-router-dom";
import { NavBar } from "../components/navbar.js";
import { TimeoutLogic } from "../components/timerTokenExpired/timeoutLogic.js";
import { useDispatch } from "react-redux";
import { startLogout } from "../actions/authUser.js";
import Swal from "sweetalert2";
// import { Container, makeStyles } from "@material-ui/core";
// import { useDispatch, useSelector } from "react-redux";
// import { startLogout } from "../actions/authUser.js";
// import Swal from "sweetalert2";
// import SessionTimeout from "../components/SessionTimeout.js";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     flexDirection: "column",
//     minHeight: "100vh",
//   },
//   cardContainer: {
//     paddingBottom: 80,
//     paddingTop: 80,
//   },
// }));

export function LoggedRouter({ history }) {
  let location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    console.log("entre");
    try {
      const response = await dispatch(startLogout());
      console.log(response);
      if (response.state) {
        Swal.fire({
          icon: "success",
          title: `Logout ${response.msgTitle || ""}`,
          timer: 3500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: `Logout hasn't been successful ,try again!`,
          timer: 3500,
          showConfirmButton: false,
        });
      }
      return response;
    } catch (err) {
      console.log(err.data);
      Swal.fire({
        icon: "error",
        title: `Logout hasn't been successful ,try again! : ${
          err.data.msgTitle ||
          err.data.msgTitleDescription ||
          err.data.msgTitleDescription ||
          ""
        }`,
        timer: 3500,
        showConfirmButton: false,
      });
    }
  }, [dispatch]);

  console.log("LoggedRouter", location);
  // const { isLogged } = useSelector((state) => state.authUser);
  // const classes = useStyles();

  return (
    <>
      <NavBar history={history} />
      <TimeoutLogic logOut={handleLogout} />
      <div className="container" style={{ padding: "20px" }}>
        <Switch>
          <Route exact path="/home" render={() => <Home />} />
          <Route exact path="/deposit" render={() => <Deposit />} />
          <Route exact path="/withdraw" render={() => <Withdraw />} />
          <Route exact path="/alldata" render={() => <AllData />} />
          <Route path="/" component={Home} />
        </Switch>
      </div>

      {/*   <SessionTimeout isAuthenticated={isLogged} logOut={handleLogout} />

      <div className="container" style={{ padding: "20px" }}>
        <div className={classes.root}>
          <Container className={classes.cardContainer} maxWidth="sm">
            <Switch>
              <Route exact path="/home" component={Home} />
              <Route exact path="/deposit" component={Deposit} />
              <Route exact path="/withdraw" component={Withdraw} />
              <Route exact path="/alldata" component={AllData} />
              <Route path="/" component={Home} />
            </Switch>
          </Container>
        </div>
      </div> */}
    </>
  );
}
