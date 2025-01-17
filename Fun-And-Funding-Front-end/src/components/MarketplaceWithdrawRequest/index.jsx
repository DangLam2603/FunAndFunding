/* eslint-disable no-unused-vars */
import React from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import withdrawApiInstance from "../../utils/ApiInstance/withdrawApiInstance";
import Cookies from "js-cookie";

const MARKETPLACE_ID = "02D71681-FB04-4C91-ACBE-D660F512621D";
//fix cứng
function MarketplaceWithdrawRequest() {
  const notify = (message, type) => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        backgroundColor: "#ffffff",
        color: "#000000",
        fontWeight: "bold",
      },
    };

    if (type === "warn") {
      toast.warn(message, options);
    } else if (type === "success") {
      toast.success(message, options);
    }
  };
  const handleSubmit = () => {
    Swal.fire({
      title: "Request sent!",
      text: "The waiting process can take 5-7 days. Thank you for your patience.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FBB03B",
      cancelButtonColor: "D8D8D8",
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetchWithdrawRequest();
      }
    });
  };
  const fetchWithdrawRequest = async () => {
    try {
      const token = Cookies.get("_auth"); // Replace with the actual token
      const response = await withdrawApiInstance.post(
        `/marketplace/${MARKETPLACE_ID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        console.log(response.data);
        notify("Successfully created", "success");
      }
    } catch (error) {
      console.log(error);
      notify("Something went wrong, please try again", "warn");
    }
  };

  return (
    <div>
      <button
        onClick={handleSubmit}
        className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-all duration-200"
      >
        Create withdraw request
      </button>
      <ToastContainer
        position="bottom-left" // Set the position for the Toast notifications
        autoClose={3000} // Automatically close after 3 seconds
        hideProgressBar={false} // Show progress bar
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
}

export default MarketplaceWithdrawRequest;
