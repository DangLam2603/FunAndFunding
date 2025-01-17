/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import LoginForm from "../../pages/LoginForm";
import RoleForm from "../../pages/RoleForm";
import BackerForm from "../../pages/RegisterBacker";
import OwnerForm from "../../pages/RegisterGameOwner";
import ForgotPasswordForm from "../../pages/ForgotPassword";
import OTPVerfication from "../../pages/OTPVerfication";
const AuthDialog = ({ isOpen, onClose }) => {
  const [currentForm, setCurrentForm] = useState("login");

  useEffect(() => {
    if (isOpen) {
      setCurrentForm("login"); // Open login form by default when the dialog is opened
    }
  }, [isOpen]);

  const openLoginForm = () => {
    setCurrentForm("login"); // Switch to LoginForm
  };
  // Switch to OwnerForm
  const openOwnerForm = () => {
    setCurrentForm("owner");
  };

  const openBackerForm = () => {
    setCurrentForm("backer"); // Switch to BackerForm
  };
  const openOTPForm = () => {
    setCurrentForm("otp");
  };
  const openForgotPasswordForm = () => {
    setCurrentForm("forgotPassword"); // Switch to ForgotPasswordForm
  };

  const closeDialog = () => {
    onClose(); // This will close the entire dialog
  };

  const goBackRole = () => {
    setCurrentForm("role"); // Go back to RoleForm
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      {currentForm === "login" && (
        <LoginForm
          onClose={closeDialog}
          onOpenRoleSelection={goBackRole}
          onOpenOTPForm={openOTPForm}
          onOpenForgotPassword={openForgotPasswordForm}
        />
      )}
      {currentForm === "backer" && (
        <BackerForm
          onClose={closeDialog}
          onOpenLogin={openLoginForm}
          onOpenOTPForm={openOTPForm}
          onBack={goBackRole}
        />
      )}
      {currentForm === "role" && (
        <RoleForm
          onClose={closeDialog}
          onOpenBackerForm={openBackerForm}
          onOpenOwnerForm={openOwnerForm}
          onBack={openLoginForm}
        />
      )}
      {currentForm === "owner" && (
        <OwnerForm
          onClose={closeDialog}
          onOpenLogin={openLoginForm}
          onOpenOTPForm={openOTPForm}
          onBack={goBackRole}
        />
      )}
      {currentForm === "forgotPassword" && (
        <ForgotPasswordForm onClose={closeDialog} onBack={openLoginForm} />
      )}
      {currentForm === "otp" && (
        <OTPVerfication onClose={closeDialog} onOpenLogin={openLoginForm} />
      )}
    </Dialog>
  );
};

export default AuthDialog;
