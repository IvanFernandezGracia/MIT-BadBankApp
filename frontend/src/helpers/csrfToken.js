import { requestWithoutToken } from "./handleFetch";

export const getCSRFToken = async () => {
  try {
    console.log("entre a csfr funciton ");
    await deleteCSRFToken();

    const response = await requestWithoutToken("csrf/getCSRFToken");

    const { body } = response;

    const tag_token_csrf = document.head.querySelector(
      'meta[name="csrf-token"]'
    );
    tag_token_csrf.setAttribute(
      "content",
      body.hasOwnProperty("csrfToken") ? body.csrfToken : ""
    );
  } catch (err) {
    console.log("Error csrf", err);
  }
};

export const deleteCSRFToken = async () => {
  try {
    console.log("entre a csfr funciton delete ");
    await requestWithoutToken("csrf/deleteCSRFToken");
  } catch (err) {
    console.log("Error csrf delete", err);
  }
};
