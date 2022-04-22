import React from "react";
import Modal from "react-modal";
import { Flippen } from "./Flippen";

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
    border: "solid",
    "box-shadow": "-20px -20px 50px  black",
    backgroundColor: "black",
    color: "white",
  },
};

export const TimeoutWarningModal = ({
  isOpen,
  onRequestClose,
  onRequestContinue,
  countdown,
}) => {
  // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement("#root");

  return (
    <div>
      <Modal isOpen={isOpen} style={customStyles} contentLabel="Example Modal">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>Session Timeout!!</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div>Your session will expire soon!</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div>Do you want to stay in the bank?</div>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Flippen value={countdown} />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div> Seconds </div>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={onRequestClose}
            className="btn btn-danger"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={onRequestContinue}
            className="btn btn-success"
          >
            Again
          </button>
        </div>
      </Modal>
    </div>
  );
};
