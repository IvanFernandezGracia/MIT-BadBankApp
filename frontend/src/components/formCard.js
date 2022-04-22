import { useEffect } from "react";
import { useState, useCallback, useRef } from "react";
import Swal from "sweetalert2";
// import PropTypes from "prop-types";

export const FormCard = (props) => {
  const { changeStatus, fieldsList, validationList, actionSubmit } = props;
  const [show, setShow] = useState(true);
  const [errors, setErrors] = useState({ error: null });
  const [fields, setFields] = useState(fieldsList);
  const [disableFetchLoad, setdisableFetchLoad] = useState(false);

  const initialRender = useRef(true);
  const isMounted = useRef(false);

  const validateList = useRef({ ...validationList });

  const validatorAll = useCallback(
    (fieldstoValided, fieldsValidateList) => {
      let okValidation = true;
      let error = {};

      const saveErrorMessage = (type, msg) => {
        if (error[type] === undefined) {
          error[type] = [];
        }
        error[type].push(msg);
        return false;
      };

      const validationField = (field, msg, conditionField) => {
        okValidation =
          field in fieldstoValided
            ? conditionField
              ? saveErrorMessage(field, msg)
              : okValidation
            : okValidation;
      };

      for (const field in fieldsValidateList) {
        for (const [index, condition] of fieldsValidateList[
          field
        ].conditional.entries()) {
          validationField(
            field,
            fieldsValidateList[field].msg[index],
            condition(fieldstoValided[field])
          );
        }
      }

      if (okValidation) {
        setErrors({});
        changeStatus({});
      } else {
        setErrors(error);
        changeStatus(error);
      }

      return okValidation;
    },
    [changeStatus]
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      validatorAll(fields, validateList.current);
    }
  }, [fields, validatorAll]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);
  async function handleSubmit(actionSubmit) {
    //console.log({ ...fields });
    if (!validatorAll(fields, validateList.current)) {
      return;
    } else {
      setdisableFetchLoad(true);
      let response = await actionSubmit(fields);
      console.log(response);
      if (response.state) {
        let html = "";
        for (const field in fields) {
          html = html + `<b>${field}: ${fields[field]}</b> <br/>`;
        }

        Swal.fire({
          icon: "success",
          title: `${props.action} ${response.msgTitle}`,
          timer: 3500,
          showConfirmButton: false,
          html: `${html}`,
        });
        if (isMounted.current) {
          clearForm();
          setShow(false);
        }
      } else {
        setdisableFetchLoad(false);
        Swal.fire({
          icon: "error",
          title: `${props.action} ${response.msgTitle}`,
          timer: 3500,
          showConfirmButton: false,
          html: `${response.msgTitleDescription}`,
        });
      }
    }
  }

  function clearForm() {
    setFields(props.fieldsList);
    changeStatus({ error: null });
  }

  return (
    <div>
      {show ? (
        <>
          {Object.keys(fieldsList).map((field) => (
            <div key={`${field}`}>
              {field}
              <br />
              <input
                type={`${validateList.current[`${field}`].type}`}
                className="form-control"
                id={`${field}`}
                placeholder={`Enter ${field}`}
                value={fields[field]}
                onChange={(e) =>
                  setFields({ ...fields, [field]: e.currentTarget.value })
                }
              />
              {errors[field] &&
                errors[field].map((errorMsg, index) => (
                  <p
                    key={field + index}
                    className="errorForm  animate__animated animate__zoomIn"
                  >
                    {errorMsg}
                  </p>
                ))}
            </div>
          ))}
          <br />
          <button
            type="submit"
            className="btn btn-danger"
            onClick={() => {
              handleSubmit(actionSubmit);
            }}
            disabled={
              !(Object.entries(errors).length === 0) || disableFetchLoad
            }
          >
            {`${props.action}`}
          </button>
        </>
      ) : (
        <>
          <button
            type="submit"
            className="btn btn-danger"
            onClick={() => {
              clearForm();
              setShow(true);
              setdisableFetchLoad(false);
            }}
          >
            {`Again ${props.action}`}
          </button>
        </>
      )}
    </div>
  );
};

// FormCreateAccount.propTypes = {
//   changeStatus: PropTypes.func.isRequired,
// };
