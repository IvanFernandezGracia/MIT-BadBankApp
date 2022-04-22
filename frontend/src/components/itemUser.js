import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { searchLoadingUsers, startLoadingUsers } from "../actions/allUsers";
import userDefaultPhoto from "../assets/images/userdefault.png"; // with import
import { useForm } from "../hooks/useForm.js";
import { PaymentModal } from "./paymentModal";

export const ItemUser = (props) => {
  const { users } = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [emailPayment, setEmailPayment] = useState("");

  const [formValues, handleInputChange] = useForm({
    searchText: "",
  });

  const { searchText } = formValues;

  const handleSearch = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        ///////////////////
        const response = await dispatch(searchLoadingUsers(e.target[0].value));
        console.log("searchUser", response);
        Swal.fire({
          icon: "success",
          title: `Search Users`,
          timer: 3500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: `Search Users`,
          timer: 3500,
          showConfirmButton: false,
          html: `${err} , try again!`,
        });
      }
    },
    [dispatch]
  );

  const handleLoading = useCallback(async () => {
    try {
      const response = await dispatch(startLoadingUsers());
      console.log("userAllItems", response);
      Swal.fire({
        icon: "success",
        title: `All Users`,
        timer: 3500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: `All Users`,
        timer: 3500,
        showConfirmButton: false,
        html: `${err} , try again!`,
      });
    }
  }, [dispatch]);

  useEffect(() => {
    handleLoading();
  }, [handleLoading]);

  return (
    <>
      <div>
        <h6>Search users by id, name or email</h6>
        <hr />

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search users"
            className="form-control"
            name="searchText"
            autoComplete="off"
            value={searchText}
            onChange={handleInputChange}
          />
          <hr />

          <button className="btn btn-outline-danger" type="submit">
            Search...
          </button>
        </form>
        <hr />
      </div>

      {users.map((user, index) => (
        <div className="content" key={`${user.name}${index}`}>
          <div className="cardAlldata">
            <div className="firstinfo">
              <img
                src={user["url_image"] ? user["url_image"] : userDefaultPhoto}
                alt={`UserPhoto${index}`}
              />
              <div className="profileinfo">
                <h1>{`Name: ${user.name}`}</h1>
                <h3>{`Email: ${user.email}`}</h3>
                <p className="bio">{`Balance:  $${new Intl.NumberFormat().format(
                  user.balance
                )}`}</p>
                <button
                  className="btn btn-outline-dark btn-sm pull-right"
                  onClick={() => {
                    setShowModalPayment(true);
                    setEmailPayment(user.email);
                  }}
                >
                  Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {showModalPayment && (
        <PaymentModal
          isOpen={showModalPayment}
          setShowModalPayment={setShowModalPayment}
          emailToPayment={emailPayment}
        />
      )}
    </>
  );
};
