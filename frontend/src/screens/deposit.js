import React from "react";
// import { UserContext } from "../hooks/useContext.js";
import { Card } from "../components/card.js";
// import Swal from "sweetalert2";
import validator from "validator";
import { useState, useCallback, useRef } from "react";
import { FormCard } from "../components/formCard.js";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { startDeposit } from "../actions/authUser.js";

export function Deposit() {
  const dispatch = useDispatch();

  const [status, setStatus] = useState({ error: null });
  const { balance } = useSelector((state) => state.authUser);

  const changeStatus = useCallback((status) => {
    setStatus(status);
  }, []);

  const validateStatus =
    Object.entries(status).length === 0 ? "Fields Validated" : " ";

  const fieldsList = useRef({ Amount: "0" });
  const validationList = useRef({
    Amount: {
      msg: ["Is not Number", "Number is Negative or Zero"],
      conditional: [
        (field) => {
          return !validator.isNumeric(field);
        },
        (field) => {
          if (!validator.isNumeric(field)) {
            return false;
          } else {
            return !(Number(field) > 0);
          }
        },
      ],
      type: "number",
    },
  });

  const actionSubmit = useCallback(
    async (fields) => {
      try {
        const response = await dispatch(startDeposit(Number(fields.Amount)));
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
              header="Deposit"
              title={`Balance:  $${new Intl.NumberFormat().format(balance)}`}
              status={validateStatus}
              body={
                <FormCard
                  action="Deposit"
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
