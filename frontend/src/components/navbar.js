import { Link } from "react-router-dom";
import homeLogo from "../assets/images/bank.png";
import { NavLink } from "react-router-dom";
import "animate.css";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLogout } from "../actions/authUser";
import Swal from "sweetalert2";
import userDefaultPhoto from "../assets/images/userdefault.png"; // with import

export function NavBar({ history }) {
  const dispatch = useDispatch();
  const { name, isLogged, url_image } = useSelector((state) => state.authUser);
  //console.log(history, "navbar");

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

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#e20000" }}
      >
        <Link className="navbar-brand" to="/">
          <img
            src={homeLogo}
            width="30"
            height="30"
            className="d-inline-block align-top flip-vertical-left"
            alt=""
          />
          {"   "}
          <span className="animate__animated animate__fadeInLeft">
            <b>B</b>ad<b>B</b>ank
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {!isLogged ? (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item ">
                <NavLink
                  className="nav-link animate__animated  animate__zoomIn"
                  data-title="This"
                  to="/auth/login"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div>
                    <i className="fa fa-user-circle"></i>
                  </div>
                  <div style={{ textAlign: "center" }}>Login</div>
                </NavLink>
              </li>
              <li className="nav-item ">
                <NavLink
                  className="nav-link animate__animated  animate__zoomIn"
                  data-title="This"
                  to="/auth/createAccount"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div>
                    <i className="fa fa-user-circle"></i>
                  </div>
                  <div style={{ textAlign: "center" }}> Create Account</div>
                </NavLink>
              </li>
            </ul>
          </div>
        ) : (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item " title="PageHome">
                <NavLink
                  className="nav-link  animate__animated  animate__zoomIn"
                  to="/home"
                  data-title="Home Page "
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div>
                    <i className="fa fa-home"></i>
                  </div>
                  <div style={{ textAlign: "center" }}>Home</div>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link animate__animated  animate__zoomIn"
                  to="/deposit"
                  data-title="Deposit Page"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div>
                    <i className="fa fa-plus-square"></i>
                  </div>
                  <div style={{ textAlign: "center" }}>Deposit</div>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link animate__animated  animate__zoomIn"
                  to="/withdraw"
                  data-title="Withdraw Page"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div>
                    <i className="fa fa-minus-square"></i>
                  </div>
                  <div style={{ textAlign: "center" }}>Withdraw</div>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link animate__animated  animate__zoomIn"
                  to="/allData"
                  data-title="All Users Page"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div>
                    <i className="fa fa-database"></i>
                  </div>
                  <div style={{ textAlign: "center" }}>Payment</div>
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav" style={{ width: "20%" }}>
              <li className="nav-item container-image--cover">
                {" "}
                {!url_image ? (
                  <img
                    src={userDefaultPhoto}
                    alt="user2"
                    style={{ width: "100%" }}
                    className="image--cover"
                  ></img>
                ) : (
                  <img
                    src={url_image}
                    alt="user1"
                    className="image--cover"
                  ></img>
                )}
              </li>
              <li className="nav-item">
                <span
                  className="nav-link animate__animated  animate__zoomIn"
                  style={{
                    marginRight: "20px",
                    color: "white",
                  }}
                >
                  <div style={{ fontSize: "0.2em" }}>! Hello</div>
                  <div style={{ fontSize: "0.2em" }}>{`${name} !`}</div>
                </span>
              </li>
              <li className="nav-item">
                <button
                  id="buttomLogout"
                  className="nav-link animate__animated  animate__zoomIn"
                  data-title="Logout Account"
                  style={{
                    marginRight: "20px",
                    color: "white",
                  }}
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <i className="fa fa-sign-out"></i>
                  Logout
                </button>{" "}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
