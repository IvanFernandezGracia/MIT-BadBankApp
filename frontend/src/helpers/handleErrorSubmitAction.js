export const errorAlertFormat = (
  name = "Error",
  msgTitle = "has not been successful!",
  body
) => {
  let err = new Error(name);
  err.data = {
    state: false,
    msgTitle: msgTitle,
    msgTitleDescription: `${handleResponseError(body)} `,
  };
  console.log(handleResponseError(body));
  return err;
};

const handleResponseError = (body) => {
  if (body.errors) {
    return body.errors
      .map((error) => {
        return error.msg;
      })
      .join(" , ");
  }
  if (body.msg) {
    return body.msg;
  }
  if (body.message) {
    return body.message;
  }

  return "Error input data";
};
