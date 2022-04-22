import React, { useCallback, useRef, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import validator from "validator";
import { startPayment } from "../actions/authUser";
import { Card } from "./card";
import { FormCard } from "./formCard";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "100%",
    padding: "50px",
    fontSize: "20px",
    backgroundColor: "rgba(0, 0, 0, 85%)",
    borderRadius: "10%",
  },
};

export const PaymentModal = ({
  isOpen,
  emailToPayment,
  setShowModalPayment,
}) => {
  // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement("#root");
  const [status, setStatus] = useState({ error: null });
  const dispatch = useDispatch();
  const changeStatus = useCallback((status) => {
    setStatus(status);
  }, []);

  const validateStatus =
    Object.entries(status).length === 0 ? "Fields Validated" : " ";

  const fieldsList = useRef({ Email: `${emailToPayment}`, Amount: "" });
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
        const response = await dispatch(
          startPayment(Number(fields.Amount), fields.Email)
        );
        // console.log(response);
        setShowModalPayment(false);
        return response;
      } catch (err) {
        return err.data ? err.data : { state: false, msgTitle: `${err}` };
      }
    },
    [dispatch, setShowModalPayment]
  );

  return (
    <div>
      <Modal isOpen={isOpen} style={customStyles} contentLabel="Example Modal">
        <button
          className="btn btn-white"
          style={{
            float: "right",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
          }}
          onClick={() => {
            setShowModalPayment(false);
          }}
        >
          X
        </button>
        <Card
          txtcolor="black"
          header="Payment Account User"
          status={validateStatus}
          body={
            <FormCard
              action="Payment"
              fieldsList={fieldsList.current}
              validationList={validationList.current}
              changeStatus={changeStatus}
              actionSubmit={actionSubmit}
            />
          }
          animateMount="  animate__animated animate__backInLeft "
        />
      </Modal>
    </div>
  );
};
