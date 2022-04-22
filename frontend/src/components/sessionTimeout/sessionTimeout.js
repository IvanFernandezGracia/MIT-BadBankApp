import React, { useRef, useState } from "react";
import IdleTimer from "react-idle-timer";
import { getCSRFToken } from "../../helpers/csrfToken";
import { requestWithToken } from "../../helpers/handleFetch";
import SessionTimeoutDialog from "./sessionTimeoutDialog";
let countdownInterval;
let timeout;
const SessionTimeout = ({ isAuthenticated, logOut }) => {
  const [timeoutModalOpen, setTimeoutModalOpen] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(0);
  const idleTimer = useRef(null);
  const clearSessionTimeout = () => {
    clearTimeout(timeout);
  };
  const clearSessionInterval = () => {
    clearInterval(countdownInterval);
  };
  const handleLogout = async (isTimedOut = false) => {
    try {
      setTimeoutModalOpen(false);
      clearSessionInterval();
      clearSessionTimeout();
      logOut();
    } catch (err) {
      console.error(err);
    }
  };
  const handleContinue = async () => {
    try {
      setTimeoutModalOpen(false);
      clearSessionInterval();
      clearSessionTimeout();
      await getCSRFToken();
      const response = await requestWithToken("auth/renewTokens", {}, "POST");
      const { resp, body } = response;
      if (resp.status === 200) {
        console.log(body.msg);
      } else {
        handleLogout(true);
      }
    } catch {
      handleLogout(true);
    }
  };
  const onActive = () => {
    if (!timeoutModalOpen) {
      clearSessionInterval();
      clearSessionTimeout();
    }
  };
  const onIdle = () => {
    const delay = 1000 * 1;
    if (isAuthenticated && !timeoutModalOpen) {
      console.log("timeout");
      timeout = setTimeout(() => {
        let countDown = 30;
        setTimeoutModalOpen(true);
        setTimeoutCountdown(countDown);
        countdownInterval = setInterval(() => {
          if (countDown > 0) {
            setTimeoutCountdown(--countDown);
          } else {
            handleLogout(true);
          }
        }, 1000);
      }, delay);
    }
  };

  return (
    <>
      <IdleTimer
        crossTab={true}
        ref={idleTimer}
        onActive={onActive}
        onIdle={onIdle}
        debounce={250}
        startOnMount={false}
        timeout={
          4000 ||
          (process.env.REACT_APP_COOKIE_TOKEN_REFRESH_EXPIRATED - (30 + 10)) *
            1000
        }
      />
      <SessionTimeoutDialog
        countdown={timeoutCountdown}
        onContinue={handleContinue}
        onLogout={() => handleLogout(false)}
        open={timeoutModalOpen}
      />
    </>
  );
};
export default SessionTimeout;
