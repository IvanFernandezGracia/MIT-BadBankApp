import React from "react";
import { useEffect, useRef } from "react";

export const GoogleSignIn = () => {
  const divRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: window.handleCredentialResponse,
      });
      // window.google.accounts.id.prompt((notification) => {
      //   console.log(notification);
      //   if (notification.isNotDisplayed()) {
      //     console.log(notification.getNotDisplayedReason());
      //   } else if (notification.isSkippedMoment()) {
      //     console.log(notification.getSkippedReason());
      //   } else if (notification.isDismissedMoment()) {
      //     console.log(notification.getDismissedReason());
      //   }
      // });//
      if (divRef.current) {
        console.log("GOOGLE");
        window.google.accounts.id.renderButton(divRef.current, {});
      }
    }
  }, [divRef]);

  return (
    <div className="googleSignIn" ref={divRef}>
      <div
        id="g_id_onload"
        data-client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        data-callback="handleCredentialResponse"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="filled_blue"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </div>
  );
};
