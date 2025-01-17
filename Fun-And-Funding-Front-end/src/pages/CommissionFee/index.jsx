/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import CommisionTable from "../../components/CommisionTable";
import commissionApiInstance from "../../utils/ApiInstance/commisionApiInstance";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Dialog } from "@mui/material";
import InputField from "../../components/InputField";
import PercentIcon from "@mui/icons-material/Percent";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SelectWithIcon from "../../components/SelectionCommision";
import { useLoading } from "../../contexts/LoadingContext";
import Cookies from "js-cookie";
import { FaPlus } from "react-icons/fa";
import { VERSION } from "@microsoft/signalr";

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
function CommissionFee() {
  const [dataLoad, setDataLoad] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setUpdateDialog] = useState(false);
  const [rate, setRate] = useState();
  const [latestType, setLatestType] = useState([]);
  const [selectId, setSelectId] = useState("");
  const [commision, setCommision] = useState({
    rate: "",
    commissionType: "",
    version: "",
  });
  const [pagination, setPagination] = React.useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });
  const { isLoading, setIsLoading } = useLoading();

  // Update a specific pagination value
  const updatePagination = (updates) => {
    setPagination((prev) => ({ ...prev, ...updates }));
  };
  const handleUpdateCloseDialog = () => {
    setUpdateDialog(false);
  };
  const handleUpdateOpenDialog = () => {
    setUpdateDialog(true);
  };
  const handleUpdateChange = (e) => {
    const { value } = e.target;
    const sanitizedValue = value.replace(/,/g, ""); // Remove commas
    setRate(sanitizedValue);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === "rate" ? value.replace(/,/g, "") : value;
    setCommision((prevCommision) => ({
      ...prevCommision,
      [name]: sanitizedValue,
    }));
  };
  const fetchCommisonFee = async (
    page = pagination.currentPage,
    pageSize = pagination.pageSize
  ) => {
    try {
      const response = await commissionApiInstance.get("", {
        params: {
          pageIndex: page + 1, // Adjust for 1-based index if API uses 1-based pages
          pageSize: pageSize,
        },
      });
      const { items, totalItems, totalPages } = response.data._data;
      setIsLoading(true);
      setDataLoad(items);
      updatePagination({ totalItems, totalPages, currentPage: page });
      fetchLatestVersion();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Usage in handlers
  const handlePageChange = (newPage) => {
    fetchCommisonFee(newPage, pagination.pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    updatePagination({ pageSize: newPageSize });
    fetchCommisonFee(0, newPageSize);
  };
  const fetchLatestVersion = async () => {
    try {
      const response = await commissionApiInstance.get(
        "/list-applied-commission-fee"
      );

      if (response.data._isSuccess && Array.isArray(response.data._data)) {
        setLatestType(response.data._data); // Set it directly if it's an array
      } else if (response.data._isSuccess && response.data._data) {
        // If it's not an array, wrap it in an array
        setLatestType([response.data._data]);
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching latest commission type:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const mappingLatestData =
    latestType?.map((data) => ({
      Id: data.id,
      Rate: data.rate,
      Version: data.version,
      Type: data.commissionType === 0 ? "Funding" : "Marketplace",
      "Last Updated": formatDate(data.updateDate),
    })) || [];

  const mappingData = dataLoad.map((data) => {
    const isLatest = latestType?.some(
      (latestData) => latestData.id === data.id
    );

    return {
      Id: data.id,
      RATE: data.rate,
      VERSION: data.version,
      TYPE: data.commissionType === 0 ? "Funding" : "Marketplace",
      "LAST UPDATED": formatDate(data.updateDate),
      STATUS: isLatest ? "Applied" : "Outdated", // Set "Latest" if it matches, otherwise "Outdated"
    };
  });

  useEffect(() => {
    fetchCommisonFee();
  }, [pagination.currentPage, pagination.pageSize]);

  const handleRowClick = async (id) => {
    console.log("Row clicked with ID:", id);
    try {
      setSelectId(id);
      handleUpdateOpenDialog();
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const token = Cookies.get("_auth");
      const response = await commissionApiInstance.put(
        `/${selectId}`,
        { rate }, // Send as an object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(selectId, rate);
      if (response.data._isSuccess) {
        console.log(response.data._data);
        notify("Commission fee updated successfully", "success");
        handleUpdateCloseDialog();
        fetchCommisonFee();
        // Refresh data
      }
    } catch (error) {
      console.log(error);
      notify("Error updating commission fee", "error");
    }
  };
  const handleSubmit = async () => {
    console.log("submit", commision);
    try {
      const token = Cookies.get("_auth");
      const response = await commissionApiInstance.post("", commision, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data._isSuccess) {
        console.log(response.data._data);
        notify("Commision fee created successfully", "success");
        fetchCommisonFee();
        fetchLatestVersion();
        handleCloseDialog();
      }
    } catch (error) {
      console.log(error);
      notify("Error creating commision fee", "error");
    }
  };

  return (
    <div className="p-12">
      <div className="flex justify-center items-end flex-col gap-4">
        <button
          type="button"
          className=" font-medium bg-[#1BAA64] w-1/5 text-white py-3 my-4 rounded-lg mt-6 hover:bg-white hover:text-[#1BAA64] border border-[#1BAA64] transition-all duration-200"
          onClick={handleOpenDialog}
        >
          <div className="flex gap-4 flex-row justify-center items-center">
            <FaPlus />
            <p>Create Commision</p>
          </div>
        </button>
      </div>
      <div>
        <CommisionTable
          data={mappingData}
          handleRowClick={handleRowClick} // Assuming you have a handler for row clicks
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange} // Pass the page change handler
          onPageSizeChange={handlePageSizeChange} // Pass the page size change handler
        />
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl text-center my-4 font-bold text-gray-800 ">
                Create Commision Fee
              </h2>

              <div className="w-full flex flex-col gap-4">
                <InputField
                  name="rate"
                  formControlStyles={{ width: "100%" }}
                  label="Rate"
                  startIcon={<PercentIcon />}
                  value={commision.rate}
                  onChange={handleChange}
                  placeholder="Rate"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                />
                <SelectWithIcon
                  name="commissionType"
                  formControlStyles={{ width: "100%" }}
                  label="Type"
                  startIcon={<MonetizationOnIcon />}
                  value={commision.commissionType}
                  onChange={handleChange}
                  options={[
                    { value: 0, label: "Funding Commission" },
                    { value: 1, label: "Marketplace Commission" },
                  ]}
                />

                <InputField
                  name="version"
                  formControlStyles={{ width: "100%" }}
                  label="Version"
                  value={commision.version}
                  onChange={handleChange}
                  startIcon={<FormatListNumberedIcon />}
                  placeholder="Version"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                />
              </div>

              <div className="flex justify-around gap-4 mt-6">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
      <Dialog open={openUpdateDialog} onClose={handleUpdateCloseDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
            <form onSubmit={handleUpdateSubmit}>
              <h2 className="text-xl text-center my-4 font-bold text-gray-800 ">
                Update Commision Fee
              </h2>

              <div className="w-full flex flex-col gap-4">
                <InputField
                  name="rate"
                  formControlStyles={{ width: "100%" }}
                  label="Rate"
                  startIcon={<PercentIcon />}
                  value={rate}
                  onChange={handleUpdateChange}
                  placeholder="Rate"
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]*[.]?[0-9]*",
                  }}
                />
              </div>

              <div className="flex justify-around gap-4 mt-6">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleUpdateCloseDialog}
                  className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
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

export default CommissionFee;
