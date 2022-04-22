import React from "react";
import Modal from "react-modal";
import RotateLoader from "react-spinners/RotateLoader";
import { css } from "@emotion/react";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    padding: "50px",
    fontSize: "20px",
    border: "none",
    backgroundColor: "transparent",
  },
};

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  speedmultiplier: 2;
`;

export const Loading = ({ isLoading }) => {
  // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement("#root");

  return (
    <div>
      <Modal
        isOpen={isLoading}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <RotateLoader
          color={"red"}
          loading={isLoading}
          css={override}
          margin={20}
          size={30}
        />
        <br />
      </Modal>
    </div>
  );
};
