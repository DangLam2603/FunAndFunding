import React, { useState } from "react";
import { Box, Typography, Modal, IconButton, Button } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // Icon for Withdraw
import Swal from "sweetalert2"; // Import Swal
import projectMilestoneApiInstace from "../../../utils/ApiInstance/projectMilestoneApiInstance";

const StatBox = ({ title, subtitle, icon, withdraw, pmId, render }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleWithdraw = async () => {
    setOpenModal(false);
    try {
      const response = await projectMilestoneApiInstace.post(
        `/withdraw-process?projectMilestoneId=${pmId}`
      );
      console.log(response);

      // Show success notification
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Withdrawal successful!",
        confirmButtonColor: "#66C7F4",
      });

      // Refresh the page or trigger a re-render
      render();
    } catch (error) {
      console.error("Withdrawal failed:", error);

      // Show error notification
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Withdrawal failed. Please try again later.",
        confirmButtonColor: "#f44336",
      });
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box
      width="280px"
      height="120px"
      p="16px"
      borderRadius="8px"
      backgroundColor="#1a1d2c"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      boxSizing="border-box"
    >
      <Box display="flex" alignItems="center">
        <Box mr="8px" color="#66C7F4">
          {icon}
        </Box>
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#FFFFFF"
          >
            {title}
          </Typography>
          <Typography variant="body2" color="#66C7F4">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      {withdraw == false && (
        <IconButton
          onClick={handleOpenModal}
          sx={{
            color: "#66C7F4",
            backgroundColor: "#2C3E50",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#34495E",
            },
          }}
        >
          <AccountBalanceWalletIcon />
        </IconButton>
      )}

      {/* Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="withdraw-confirmation-title"
        aria-describedby="withdraw-confirmation-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            id="withdraw-confirmation-title"
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Confirm Withdrawal
          </Typography>
          <Typography id="withdraw-confirmation-description" variant="body2" sx={{ mb: 3 }}>
            Are you sure you want to withdraw? This action can only be performed once.
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleWithdraw}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default StatBox;