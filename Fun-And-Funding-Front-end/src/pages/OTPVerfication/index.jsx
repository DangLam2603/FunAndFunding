/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";
import { MuiOtpInput } from "mui-one-time-password-input";
import React, { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { ToastContainer, toast } from "react-toastify";
import authApiInstance from "../../utils/ApiInstance/authApiInstance";
import logo from "../../assets/OnlyLogo.png";
import "./index.css";
import Swal from "sweetalert2";

function OTPVerification({ onClose, onOpenLogin }) {
  const [name, setName] = useState("");
  const [otp, setOTP] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const maxAttempts = 5;
  const targetTime = useRef(Date.now() + 6 * 60 * 1000);
  const handleLoginClick = () => {
    onOpenLogin(); // Switch to the LoginForm without closing the dialog
  };
  useEffect(() => {
    const userName = Cookies.get("_username");
    if (userName) {
      setName(userName);
    } else {
      //onClose();
    }
  }, [onClose]);

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
    } else if (type === "error") {
      toast.error(message, options);
    }
  };

  const handleChange = (newValue) => {
    setOTP(newValue);
  };

  const renderer = ({ minutes, seconds }) => {
    return (
      <span className="text-[#1BAA64] font-bold">
        {minutes} minutes {seconds} seconds
      </span>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonDisable(true);
    setButtonLoading(true);

    try {
      const res = await authApiInstance.post(
        `/login-2FA?code=${otp}&username=${name}`
      );
      if (res.data._data == null) {
        notify(`${res.data._message[0]}`, "warn");
      } else {
        notify("Verification successful, please login", "success");
        Cookies.remove("_username");
        setTimeout(() => {
          handleLoginClick(); // Navigate to LoginForm
        }, 1000);
      }
    } catch (error) {
      notify("Invalid OTP. Please try again.", "warn");
      console.log(error);
      setFailedAttempts((prev) => prev + 1);

      if (failedAttempts + 1 >= maxAttempts) {
        //onClose();

        Cookies.remove("_username");
        onClose();
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: "You have reached the maximum number of attempts.",
          customClass: {
            confirmButton: "custom-confirm-button", // Add a custom class
          },
          buttonsStyling: false, // Disable default styles if you want full control
        });
      }
    }

    setButtonDisable(false);
    setButtonLoading(false);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-10 rounded-3xl relative shadow-lg w-[45rem]">
        {/* Logo and Welcome Message */}
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-[78px] h-[88px] mb-[1rem]" />
        </div>
        <div className="text-[#44494D] text-[2rem] font-bold mb-[0.4rem] text-center !w-full">
          Email Confirmation
        </div>
        <div>{}</div>
        <p className="text-[#44494D]/70 mb-2 text-center !w-full">
          Enter the OTP code sent to your email to authenticate your account
        </p>
        <Box noValidate sx={{ marginTop: "2.4rem", width: "100%" }}>
          <div className="my-4">
            <MuiOtpInput
              length={6}
              name="otp"
              value={otp}
              onChange={handleChange}
              className="otpBox"
              validateChar={(val) => !isNaN(val)}
            />
          </div>
        </Box>
        <div className="flex my-6 gap-1 text-[1rem] otpTimer">
          <h2>Your OTP code is still valid in</h2>
          <Countdown date={targetTime.current} renderer={renderer} />
        </div>
        <Box component="form" noValidate sx={{ width: "100%" }}>
          <div className="w-full mt-[1.4rem]">
            <Box sx={{ position: "relative" }}>
              <Button
                type="submit"
                sx={{
                  width: "100%",
                  backgroundColor: "#D9D9D9",
                  color: "#44494D",
                  fontWeight: 700,
                  height: "40px",
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
                className="login-btn"
                disabled={buttonDisable}
                onClick={handleSubmit}
              >
                Confirm
              </Button>
              {buttonLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "#44494D",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>
          </div>
        </Box>
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </div>
    </div>
  );
}

export default OTPVerification;
