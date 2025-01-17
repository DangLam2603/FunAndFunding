import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import contractApiInstace from "../../utils/ApiInstance/contractApiInstance";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import commissionApiInstance from "../../utils/ApiInstance/commisionApiInstance";
import { useLoading } from "../../contexts/LoadingContext";

const MarketplaceContract = ({ open, handleClose, id }) => {
  const token = Cookies.get("_auth");
  const [commissionFee, setCommissionFee] = useState(0);
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  const termsStyle = {
    maxHeight: "300px", // Set a max height for the scrollable area
    overflowY: "auto", // Enable vertical scrolling
    paddingRight: "8px", // Space to improve readability
    scrollbarWidth: "none", // Hide scrollbar for Firefox
    "&::-webkit-scrollbar": {
      display: "none", // Hide scrollbar for Chrome, Safari, Edge
    },
    marginBottom: "1rem",
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleAccept = () => {
    if (!isChecked) {
      alert("Please accept the terms and conditions before proceeding.");
      return;
    }
    window.open(`/request-marketplace-project/${id}/basic-info`, "_blank");
    handleClose();
  };

  useEffect(() => {
    const fetchCommissionFee = async () => {
      setIsLoading(true);
      try {
        const type = 0; // funding fee
        const response = await commissionApiInstance.get(
          "/latest-commission-fee",
          {
            params: { type },
          }
        );
        setCommissionFee(response.data._data.rate);
      } catch (err) {
        console.error("Error fetching latest commission fee:", err);
      }
    };

    const fetchData = async () => {
      await fetchCommissionFee();
      setIsLoading(false);
    };

    fetchData();
  }, [setIsLoading]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Terms and Conditions for Selling Games on Fun&Funding
        </Typography>
        <Box sx={termsStyle}>
          <Typography fontSize={"1rem"} sx={{ mb: 2 }}>
            Welcome to{" "}
            <span className="text-[var(--primary-green)] font-semibold">
              Fun&Funding
            </span>
            ! These Terms and Conditions outline the rules and responsibilities
            for Game Owners who wish sell games on our platform. By using our
            platform, you agree to comply with these Terms and Conditions:
          </Typography>
          <ul>
            <li>You must provide accurate information about your game.</li>
            <li>
              All games must meet the platform's quality standards and must not
              contain prohibited content, including malware or illegal material.
            </li>
            <li>
              You agree to follow the provided PDF tutorial for securing game
              packages before uploading to the platform.
              <br />
              Here is our guidance:{" "}
              <a
                href="https://funfundingmediafiles.blob.core.windows.net/fundingprojectfiles/FunAndFundingDRMPackage_ImportGuide_b5a707d8-d7ba-47c2-b394-ea548cc90ea4.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary-green)] font-semibold"
              >
                Guidance
              </a>
            </li>
            <li>
              Revenue from sales will be charged with the system commission fee:{" "}
              {""}
              <span className="text-[var(--primary-green)] font-semibold">
                {commissionFee * 100}%
              </span>
              .
            </li>
            <li>
              These Terms and Conditions are subject to change, and continued
              use of the platform constitutes acceptance of the updated terms.
            </li>
          </ul>
        </Box>
        <FormControlLabel
          control={
            <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
          }
          label="I have read and agree to the terms and conditions."
        />
        <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAccept} variant="contained" color="primary">
            Accept
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default MarketplaceContract;
