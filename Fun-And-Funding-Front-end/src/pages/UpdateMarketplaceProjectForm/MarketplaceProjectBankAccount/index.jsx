import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUpdateMarketplaceProject } from "../../../contexts/UpdateMarketplaceProjectContext";

function MarketplaceProjectBankAccount() {
  const { id } = useParams();
  const { marketplaceProject, setMarketplaceProject, edited, setEdited } =
    useUpdateMarketplaceProject();

  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerNameError, setOwnerNameError] = useState(null);
  const [checked, isChecked] = useState(true);
  const [bankAccountEdited, setBankAccountEdited] = useState(false);

  useEffect(() => {
    fetchBank();
    if (marketplaceProject.bankAccount) {
      setBankAccountNumber(marketplaceProject.bankAccount.bankNumber);
      checkInitialBankAccount();
    }
  }, [id, marketplaceProject]);

  const fetchBank = async () => {
    await axios.get("https://api.httzip.com/api/bank/list").then((res) => {
      setBankList(res.data.data);
    });
  };

  const checkInitialBankAccount = async () => {
    try {
      const response = await axios.get("https://api.httzip.com/api/bank/list");
      if (response.data.code === 200) {
        const bankList = response.data.data;
        const bankCode = marketplaceProject.bankAccount.bankCode;
        const foundBank = bankList.find((record) => record.code === bankCode);
        if (foundBank) {
          setSelectedBank(foundBank);
          const bankAccountResponse = await axios.post(
            "https://api.httzip.com/api/bank/id-lookup-prod",
            {
              bank: foundBank.code,
              account: marketplaceProject.bankAccount.bankNumber,
            },
            {
              headers: {
                "x-api-key": "11f028b5-b964-4efa-ab9c-db4e199dccb4key",
                "x-api-secret": "691b9c60-353e-4e68-946f-ce68292884d0secret",
              },
            }
          );

          if (bankAccountResponse.data.code === 200) {
            setOwnerName(bankAccountResponse.data.data.ownerName);
          } else {
            console.error(
              "Error checking bank account:",
              bankAccountResponse.data.message
            );
          }
        }
      } else {
        console.error("Error fetching bank list:", response.data.message);
      }
    } catch (error) {
      console.error("Error during initial bank account check:", error.message);
    } finally {
    }
  };

  const checkBankAccount = async (choosenBank, accountNumber) => {
    console.log(accountNumber);
    if (marketplaceProject.bankAccount) {
      try {
        const response = await axios.post(
          "https://api.httzip.com/api/bank/id-lookup-prod",
          {
            bank: choosenBank && choosenBank.code,
            account: accountNumber,
          },
          {
            headers: {
              "x-api-key": "11f028b5-b964-4efa-ab9c-db4e199dccb4key",
              "x-api-secret": "691b9c60-353e-4e68-946f-ce68292884d0secret",
            },
          }
        );
        if (
          response.data &&
          response.data.code === 200 &&
          response.data.data &&
          response.data.data.ownerName
        ) {
          setOwnerName(response.data.data.ownerName);
          isChecked(true);
          setBankAccountEdited(true);
        } else {
          setOwnerName("");
          setOwnerNameError("No result found for the bank account.");
          isChecked(false);
          setBankAccountEdited(false);
        }
      } catch (error) {
        setOwnerNameError("Error checking bank account: " + error.message);
        setBankAccountEdited(false);
        isChecked(false);
      } finally {
      }
    }
  };

  const handleChangeSelectedBank = (event, newValue) => {
    if (newValue) {
      const updateSelectedBank = newValue;
      console.log(updateSelectedBank);
      setSelectedBank(updateSelectedBank);
      checkIfEdited(updateSelectedBank, bankAccountNumber);
    }
  };

  const handleChangeBankAccountNumber = (event) => {
    const updatedBankAccountNumber = event.target.value;
    setBankAccountNumber(updatedBankAccountNumber);
    checkIfEdited(selectedBank, updatedBankAccountNumber);
  };

  const checkIfEdited = (updatedSelectedBank, updatedBankAccount) => {
    if (marketplaceProject.bankAccount) {
      if (
        updatedSelectedBank.bankCode !==
          marketplaceProject.bankAccount.bankCode ||
        updatedBankAccount !== marketplaceProject.bankAccount.bankNumber
      ) {
        isChecked(false);
      } else {
        isChecked(true);
      }
    }
  };

  const handleCheckBankAccount = () => {
    if (marketplaceProject.bankAccount) {
      checkBankAccount(selectedBank, bankAccountNumber);
    }
  };

  const handleSaveAll = async () => {
    try {
      const updatedProject = {
        ...marketplaceProject,
        bankAccount: {
          ...marketplaceProject.bankAccount,
          bankNumber: bankAccountNumber,
          bankCode:
            selectedBank?.code || marketplaceProject.bankAccount.bankCode,
        },
      };
      setMarketplaceProject(updatedProject);
      setEdited(true);
      setBankAccountEdited(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
    }
  };

  const handleDiscardAll = async () => {
    try {
      setBankAccountNumber(marketplaceProject.bankAccount.bankNumber || "");
      checkInitialBankAccount();
      setBankAccountEdited(false);
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
    }
  };

  return (
    <div className="w-full pb-[3rem]">
      <div className="basic-info-section !mb-[2rem]">
        <Typography
          sx={{
            color: "#2F3645",
            fontSize: "1.5rem",
            fontWeight: "700",
            userSelect: "none",
            marginBottom: "1rem",
            width: "70%",
          }}
        >
          Bank Account
        </Typography>
        <Typography
          sx={{
            color: "#2F3645",
            fontSize: "1rem",
            fontWeight: "400",
            userSelect: "none",
            width: "70%",
          }}
        >
          Set up your bank account as a withdrawal source when funding
          successfully completed.
        </Typography>
      </div>
      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Your bank<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Please select your bank from the options.
        </Typography>
        <Autocomplete
          freeSolo
          className="custom-update-textfield"
          disableClearable
          value={selectedBank}
          options={bankList}
          getOptionLabel={(option) => option.name || ""}
          onChange={handleChangeSelectedBank}
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            return (
              <Box component="li" key={key} {...restProps}>
                <Avatar
                  alt={option.name}
                  src={option.logo_url}
                  sx={{
                    marginRight: 2,
                    objectFit: "fill",
                    width: 60,
                    height: 24,
                  }}
                  variant="rounded"
                />
                <Typography variant="body1">{option.name}</Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select bank" />
          )}
        />
      </div>
      <div className="basic-info-section !mb-0">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Your bank number<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Provide a short description that best describes your campaign to your
          audience.
        </Typography>
        <TextField
          value={bankAccountNumber}
          className="custom-update-textfield"
          type="number"
          placeholder="Enter your account number"
          onChange={handleChangeBankAccountNumber}
        />
      </div>
      <div className="basic-info-section !mb-0">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "70%",
            gap: "1rem",
          }}
        >
          <Button
            disabled={checked}
            variant="contained"
            sx={{ backgroundColor: "#1BAA64", textTransform: "none" }}
            onClick={handleCheckBankAccount}
          >
            Check
          </Button>
          <Typography sx={{ color: "#d9534f", fontWeight: "500" }}>
            {ownerNameError}
          </Typography>
        </Box>
      </div>
      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Account owner
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          If you change your bank account info, the bank's owner name should be
          newly displayed after you click "Check".
        </Typography>
        <TextField
          disabled
          placeholder="Name of the account owner"
          value={ownerName}
          sx={{ width: "70%" }}
        />
      </div>
      <div className="basic-info-section !mb-0">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "70%",
            gap: "1rem",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            disabled={!bankAccountEdited}
            sx={{ backgroundColor: "transparent", textTransform: "none" }}
            onClick={() => handleDiscardAll()}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            disabled={!bankAccountEdited}
            sx={{ backgroundColor: "#1BAA64", textTransform: "none" }}
            onClick={() => handleSaveAll()}
          >
            Save
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default MarketplaceProjectBankAccount;
