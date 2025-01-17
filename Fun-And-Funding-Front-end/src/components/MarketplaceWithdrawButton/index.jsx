import { Button } from '@mui/material';
import Cookies from "js-cookie";
import React from "react";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import withdrawApiInstace from "../../utils/ApiInstance/withdrawApiInstance";

const MarketplaceWithdrawButton = () => {
  const token = Cookies.get("_auth");
  const { id } = useParams();
  console.log("mp Id", id);
  const handleClick = async () => {
    try {
      const result = await Swal.fire({
        title: "Do you want to withdraw money from the game?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        customClass: {
          confirmButton: "swal2-confirm",
          cancelButton: "swal2-cancel",
        },
        didRender: () => {
          const confirmButton = document.querySelector(".swal2-confirm");
          const cancelButton = document.querySelector(".swal2-cancel");

          if (confirmButton) {
            confirmButton.style.backgroundColor = "var(--primary-green)";
            confirmButton.style.color = "white";
            confirmButton.style.fontWeight = "bold";
            confirmButton.style.border = "none";
            confirmButton.style.borderRadius = "0.25rem";
            confirmButton.style.padding = "0.5rem 1rem";
            confirmButton.style.cursor = "pointer";
          }

          if (cancelButton) {
            cancelButton.style.backgroundColor = "#f5f5f5";
            cancelButton.style.color = "black";
            cancelButton.style.fontWeight = "bold";
            cancelButton.style.border = "none";
            cancelButton.style.borderRadius = "0.25rem";
            cancelButton.style.padding = "0.5rem 1rem";
            cancelButton.style.cursor = "pointer";
          }
        },
      });

      if (result.isConfirmed) {
        const response = await withdrawApiInstace.post(
          `/marketplace/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200 && response.data._isSuccess) {
          Swal.fire({
            title: "Success!",
            text: response.data._message,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal2-confirm",
            },
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.data._message,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "swal2-confirm",
            },
          });
        }
      }
    } catch (error) {
      Swal.close();
      console.error("Error while withdrawing money:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal2-confirm",
        },
      });
    }
  };


  return (
    <div>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#1BAA64", textTransform: "none" }}
        onClick={() => handleClick()}
      >
        Withdraw Now
      </Button>
    </div>
  );
};

export default MarketplaceWithdrawButton;
