import React from "react";

export const GoogleOneTap = () => {
  return (
    <div className="googleOneTap">
      <div
        id="g_id_onload"
        data-client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        data-callback="handleCredentialResponse"
        data-prompt_parent_id="g_id_onload"
        style={{
          position: "absolute",
          top: "100px",
          right: "30px",
          width: "0",
          height: "0",
          zindex: "1001",
        }}
      ></div>
    </div>
  );
};
