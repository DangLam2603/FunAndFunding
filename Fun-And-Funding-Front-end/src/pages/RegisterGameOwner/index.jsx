/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import HttpsIcon from "@mui/icons-material/Https";
import InputField from "../../components/InputField";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PortraitIcon from "@mui/icons-material/Portrait";
import logo from "../../assets/OnlyLogo.png";
import { ToastContainer, toast } from "react-toastify";
import authApiInstance from "../../utils/ApiInstance/authApiInstance";
import { useLoading } from "../../contexts/LoadingContext";
function setCookie(name, value, expiresIn) {
  var now = new Date();
  var time = now.getTime() + 7 * 60 * 60 * 1000;
  var expireTime = time + 1000 * expiresIn;
  now.setTime(expireTime);
  console.log(now);
  console.log(now.toUTCString());
  const cookieString = `${name}=${value}; expires=${now.toUTCString()}; path=/`;
  document.cookie = cookieString;
}
function OwnerForm({ onClose, onOpenLogin, onBack, onOpenOTPForm }) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, setIsLoading } = useLoading();

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
  const handleLoginClick = () => {
    onOpenLogin(); // Switch to the LoginForm without closing the dialog
  };
  const handleOTPClick = () => {
    onOpenOTPForm(); // Switch to the LoginForm without closing the dialog
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleAccountChange = (e) => {
    setUserName(e.target.value);
  };
  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setconfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jsonData = {
      email: email,
      userName: userName,
      fullName: fullName,
      password: password,
      confirmPassword: confirmPassword,
    };
    try {
      setIsLoading(true);
      authApiInstance.post("/game-owner", jsonData).then((res) => {
        if (!res.data._isSuccess) {
          notify(`${res.data._message[0] || "Register failed"}`, "warn");
          console.log("Register failed:", res.data._message);
        } else {
          notify(`${"Register success, please login"}`, "success");
          console.log("Register success, please login");
          setCookie("_username", userName, 7);
          handleOTPClick();
        }
      });
    } catch (error) {
      console.log(error);
      notify(`${error.message || "Register failed"}`, "warn");
    } finally {
      setIsLoading(false);
    }
    // Add your form submission logic here
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl relative shadow-lg w-[45rem] "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-[#1BAA64] top-4 right-4 text-xl"
        >
          &times; {/* X Symbol */}
        </button>
        {/* Back Button */}
        <div className="flex absolute top-4 left-4 justify-center mt-4">
          <span
            type="button"
            onClick={onBack} // Trigger the onBack function when clicked
            className="text-[#1BAA64] cursor-pointer py-2 px-4 rounded-md transition-all duration-200"
          >
            Back
          </span>
        </div>
        {/* Logo and Welcome Message */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo} // Adjust the path of your logo
            alt="Logo"
            className="w-[78px] h-[88px] mb-[1rem]"
          />
          <h2 className="text-4xl font-bold text-gray-800">
            Create an Game Owner account
          </h2>
          <p className="text-gray-500 mt-[0.375rem]">
            Turn Game Ideas into Reality!
          </p>
        </div>
        <div className="flex items-center justify-center w-full space-x-4">
          {/* Account name Input */}
          <div className="w-full">
            <InputField
              label="Account Name"
              startIcon={<PortraitIcon />}
              id="account-input"
              formControlStyles={{ width: "100%" }}
              value={userName}
              onChange={handleAccountChange}
              placeholder="Enter Account Name"
            />
          </div>

          {/* Full Name Input */}
          <div className="w-full">
            <InputField
              label="Full Name"
              id="fullName-input"
              startIcon={<PersonOutlineIcon />}
              formControlStyles={{ width: "100%" }}
              value={fullName}
              onChange={handleFullNameChange}
              placeholder="Enter Full Name"
            />
          </div>
        </div>

        <div className="w-full">
          {/* Email Input */}
          <InputField
            label="Email"
            id="email-input"
            formControlStyles={{ width: "100%" }}
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
          />

          {/* Password Input */}
          <InputField
            label="Password"
            id="password-input"
            startIcon={<HttpsIcon />}
            formControlStyles={{ width: "100%" }}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            isPassword={true} // Password input
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
          {/* Confirm Password Input */}
          <InputField
            label="Confirm Password"
            id="confirm-password-input"
            startIcon={<HttpsIcon />}
            formControlStyles={{ width: "100%" }}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Enter password"
            isPassword={true} // Password input
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-all duration-200"
        >
          Sign Up
        </button>

        {/* Sign Up */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={handleLoginClick}
            className="text-green-500 hover:text-green-700 pointer-events-auto cursor-pointer"
          >
            Sign in
          </span>
        </div>
      </form>
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

export default OwnerForm;
