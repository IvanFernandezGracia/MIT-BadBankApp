import React from "react";
// import { UserContext } from "../hooks/useContext.js";
import { Card } from "../components/card.js";
// import Swal from "sweetalert2";
import { useState, useCallback, useRef } from "react";
import { FormCard } from "../components/formCard.js";
import validator from "validator";
import { useDispatch } from "react-redux";
import { startRegister } from "../actions/authUser.js";
import { getCSRFToken } from "../helpers/csrfToken.js";

export function CreateAccount({ history }) {
  const dispatch = useDispatch();

  const [status, setStatus] = useState({ error: null });

  const changeStatus = useCallback((status) => {
    setStatus(status);
  }, []);

  const validateStatus =
    Object.entries(status).length === 0 ? "Fields Validated" : " ";

  const fieldsList = useRef({ Name: "", Email: "", Password: "" });
  const validationList = useRef({
    Name: {
      msg: ["Empty Field Name"],
      conditional: [
        (field) => {
          return field.trim().length === 0;
        },
      ],
      type: "input",
    },
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
          startRegister(fields.Email, fields.Password, fields.Name)
        );
        console.log(response);
        return response;
      } catch (err) {
        return err.data ? err.data : { state: false, msgTitle: `${err}` };
      }
    },
    [dispatch]
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
              header="Create Account"
              status={validateStatus}
              body={
                <FormCard
                  action="Create Account"
                  fieldsList={fieldsList.current}
                  validationList={validationList.current}
                  changeStatus={changeStatus}
                  actionSubmit={actionSubmit}
                />
              }
              animateMount="  animate__animated animate__backInLeft "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
