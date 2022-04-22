import React, { useCallback, useEffect, useState } from "react";
import { TimeoutWarningModal } from "./timeoutWarningModal ";
import {
  addEventListeners,
  removeEventListeners,
} from "../../event/eventsListeners";
import { getCSRFToken } from "../../helpers/csrfToken";
import { requestWithToken } from "../../helpers/handleFetch";

const TIME_EXPIRED_TOKEN_REFRESH =
  parseInt(process.env.REACT_APP_COOKIE_TOKEN_REFRESH_EXPIRATED) * 1000;
const WAITING_FETCH_EXPIRED_TOKEN_REFRESH =
  parseInt(
    process.env.REACT_APP_MIN_FETCH_TIME_COOKIE_TOKEN_REFRESH_EXPIRATED
  ) * 1000;
const TIME_OPEN_MODAL =
  parseInt(process.env.REACT_APP_TIME_OPEN_MODAL_TOKEN_REFRESH_EXPIRATED) *
  1000;

export const TimeoutLogic = ({ logOut }) => {
  const [isWarningModalOpen, setWarningModalOpen] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(
    TIME_OPEN_MODAL / 1000
  );

  const handleLogout = useCallback(async () => {
    try {
      setWarningModalOpen(false);
      await logOut();
    } catch (err) {
      console.error(err);
    }
  }, [logOut]);

  const handleContinue = useCallback(async () => {
    try {
      setWarningModalOpen(false);
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
  }, [handleLogout]);

  useEffect(() => {
    // Timer 1: Time to wait before the refresh token is deleted
    const createTimeout1 = () =>
      setTimeout(() => {
        console.log("end finish timeout 1");
        setWarningModalOpen(true);
        let countDown = TIME_OPEN_MODAL / 1000;
        let countdownInterval = setInterval(() => {
          if (countDown > 0) {
            setTimeoutCountdown(--countDown);
          } else {
            clearInterval(countdownInterval);
          }
        }, 1000);
      }, TIME_EXPIRED_TOKEN_REFRESH - (TIME_OPEN_MODAL + WAITING_FETCH_EXPIRED_TOKEN_REFRESH));

    // Timer 2: Time the user has to wait to create request new tokens, otherwise log out.
    const createTimeout2 = () =>
      setTimeout(() => {
        console.log("end finish timeout 2");
        handleLogout();
      }, TIME_OPEN_MODAL);

    //   If the refresh token is renewed, then reset Timer 1 again.
    const listener = () => {
      console.log("listener");
      if (!isWarningModalOpen) {
        console.log("listener new-token-refresh-received");
        // Reset Timerout 1 before open modal
        clearTimeout(timeout);
        timeout = createTimeout1();
      }
    };

    // Initialization Timers
    let timeout = isWarningModalOpen ? createTimeout2() : createTimeout1();
    // Create event created new refresh token
    addEventListeners("new-token-refresh-received", listener);

    // Cleanup events and Timers
    return () => {
      console.log("MORI TIMER :(");
      removeEventListeners("new-token-refresh-received", listener);
      clearTimeout(timeout);
    };
  }, [isWarningModalOpen, handleLogout]);
  return (
    <div>
      {isWarningModalOpen && (
        <TimeoutWarningModal
          isOpen={isWarningModalOpen}
          onRequestClose={() => handleLogout()}
          onRequestContinue={() => {
            handleContinue();
          }}
          countdown={timeoutCountdown}
        />
      )}
    </div>
  );
};
