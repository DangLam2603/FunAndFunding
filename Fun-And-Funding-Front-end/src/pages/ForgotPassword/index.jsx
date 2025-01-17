/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import InputField from "../../components/InputField";
import logo from "../../assets/OnlyLogo.png";
import { ToastContainer, toast } from "react-toastify";

function ForgotPasswordForm({ onClose, onBack }) {
  const handleSubmit = (event) => {};

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
      <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1BAA64] text-xl"
        >
          &times;
        </button>
        <div className="flex absolute top-4 left-4">
          <span
            onClick={onBack}
            className="text-[#1BAA64] cursor-pointer py-2 px-4 rounded-md transition-all duration-200"
          >
            Back
          </span>
        </div>

        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-[4.875rem] h-[5.5rem] mb-4" />
          <h2 className="text-4xl font-bold text-gray-800 mb-1.5">
            Forgot Password
          </h2>
          <p className="text-gray-500 mt-1">
            Please type your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-6"></div>

          <div className="flex flex-col gap-4">
            <InputField label="Emal" type="email" />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-all duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
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
  );
}

export default ForgotPasswordForm;
