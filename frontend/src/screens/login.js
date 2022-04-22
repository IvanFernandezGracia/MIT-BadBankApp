import React from "react";
import { Card } from "../components/card.js";
import { useState, useCallback, useRef } from "react";
import { FormCard } from "../components/formCard.js";
import validator from "validator";
// import { GoogleOneTap } from "../components/googleOneTap.js";
import { GoogleSignIn } from "../components/googleSignIn";
import { useDispatch } from "react-redux";
import { startLogin } from "../actions/authUser.js";
import { getCSRFToken } from "../helpers/csrfToken.js";

export function Login({ history }) {
  const dispatch = useDispatch();

  const [status, setStatus] = useState({ error: null });

  const changeStatus = useCallback((status) => {
    setStatus(status);
  }, []);

  const validateStatus =
    Object.entries(status).length === 0 ? "Fields Validated" : " ";

  const fieldsList = useRef({ Email: "", Password: "" });
  const validationList = useRef({
    Email: {
      msg: ["Format Incorrect"],
      conditional: [
        (field) => {
          return !validator.isEmail(field);
        },
      ],
      type: "input",
    },
    Password: {
      msg: ["Less than 8 characters"],
      conditional: [
        (field) => {
          return field.length < 8;
        },
      ],
      type: "password",
    },
  });

  const actionSubmit = useCallback(
    async (fields) => {
      try {
        await getCSRFToken();
        const response = await dispatch(
          startLogin(fields.Email, fields.Password)
        );
        console.log(response);
        return response;
      } catch (err) {
        return err.data ? err.data : { state: false, msgTitle: `${err}` };
      }
    },
    [dispatch]
    // [ctx, history]
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div
            style={{
              justifyContent: "center",
              margin: "auto",
              display: "flex",
            }}
          >
            <Card
              txtcolor="black"
              header="Login Account"
              status={validateStatus}
              body={
                <>
                  <FormCard
                    action="Login Account"
                    fieldsList={fieldsList.current}
                    validationList={validationList.current}
                    changeStatus={changeStatus}
                    actionSubmit={actionSubmit}
                  />
                  <hr></hr>
                  <GoogleSignIn />
                  {/* <GoogleSignIn renderGoogle={status} /> */}
                </>
              }
              animateMount="  animate__animated animate__backInLeft "
            />
          </div>
        </div>
      </div>
      {/* <GoogleOneTap /> */}
    </div>
  );
}
