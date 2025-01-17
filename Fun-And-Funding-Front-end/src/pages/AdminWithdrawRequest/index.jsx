/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./index.css";
import CustomPaginationActionsTable from "../../components/AdminTable";
import withdrawApiInstance from "../../utils/ApiInstance/withdrawApiInstance";
import bankAccountApiInstance from "../../utils/ApiInstance/bankAccountApiInstance";
import { Dialog } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

// Helper function to map withdraw request status
const mapWithdrawRequestStatus = (status) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Processing";
    case 2:
      return "Rejected";
    case 3:
      return "Approved";
    default:
      return "Unknown Status";
  }
};

// Helper function to map project status
const mapProjectStatus = (status) => {
  switch (status) {
    case 0:
      return "Deleted";
    case 1:
      return "Pending";
    case 2:
      return "Wallet";
    case 3:
      return "Funded Successful";
    case 4:
      return "Successful";
    case 5:
      return "Failed";
    case 6:
      return "Rejected";
    case 7:
      return "Approved";
    case 8:
      return "Marketplace";
    case 9:
      return "Refunded";
    default:
      return "Unknown Status";
  }
};
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
function AdminWithdrawRequest() {
  const [data, setData] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // Change initial value to null
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bankNumber, setBankNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [status, setStatus] = useState(0);
  const [pagination, setPagination] = React.useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });
  const [note, setNote] = useState(null);
  const [tempNote, setTempNote] = useState(null);
  const updatePagination = (updates) => {
    setPagination((prev) => ({ ...prev, ...updates }));
  };

  const openNoteDialog = () => {
    setNoteDialogOpen(true);
  };
  const closeNoteDialog = () => setNoteDialogOpen(false);
  const openProcessDialog = () => {
    setIsProcessDialogOpen(true);
  };
  const closeProcessDialog = () => setIsProcessDialogOpen(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const fetchWithdrawRequest = async (
    page = pagination.currentPage,
    pageSize = pagination.pageSize
  ) => {
    try {
      const res = await withdrawApiInstance.get("/all", {
        params: {
          pageIndex: page + 1, // Adjust for 1-based index if API uses 1-based pages
          pageSize: pageSize,
        },
      });
      const { items, totalItems, totalPages } = res.data._data;
      console.log(res.data._data);
      setData(res.data._data.items);
      updatePagination({ totalItems, totalPages, currentPage: page });
    } catch (error) {
      console.error("Fetch error:", error.message || error);
    }
  };
  const handlePageChange = (newPage) => {
    fetchWithdrawRequest(newPage, pagination.pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    updatePagination({ pageSize: newPageSize });
    fetchWithdrawRequest(0, newPageSize);
  };

  useEffect(() => {
    fetchWithdrawRequest();
  }, [pagination.currentPage, pagination.pageSize]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  };

  const mappingData = data.map((item) => ({
    Id: item.id,
    AMOUNT: item.amount,
    HANDLED: item.isFinished ? "Finish" : "Not Finish",
    TYPE: mapProjectStatus(item.requestType),
    STATUS: mapWithdrawRequestStatus(item.status),
    "CREATE DATE": formatDate(item.createdDate),
    "EXPIRED DATE": formatDate(item.expiredDate),
  }));

  const handleRowClick = async (id) => {
    console.log("Row clicked with ID:", id);
    const mappingData = await fetchGetWithdrawById(id);

    if (mappingData) {
      // Check if mappingData is defined
      console.log(mappingData);

      switch (mappingData.status) {
        case 0:
          // Handle status 0
          console.log("Status 0"); //pending
          Swal.fire({
            title: "Warning?",
            text: "Do You Want To Processing This Request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FBB03B",
            cancelButtonColor: "D8D8D8",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
            reverseButtons: true,
          }).then(async (result) => {
            if (result.isConfirmed) {
              await fetchProcessWithdraw(id);
            } else {
              console.log("Request Not Processed");
            }
          });

          break;
        case 1:
          // Handle status 1
          console.log("Status 1"); //processing
          fetchBankAccount(mappingData.walletId, mappingData.status);

          break;
        case 2:
          // Handle status 2
          console.log("Status 2"); //rejected
          fetchBankAccount(mappingData.walletId, mappingData.status);
          break;
        case 3:
          // Handle status 3
          console.log("Status 3"); //approved
          fetchBankAccount(mappingData.walletId, mappingData.status);
          break;
        // Add more cases as needed
        default:
          console.log("Unknown status");
      }
    } else {
      console.error("No data returned for this ID");
    }
  };
  const handleNoteClick = async (id) => {
    console.log("Note clicked with ID:", id);
    const mappingData = await fetchGetWithdrawById(id);
    setNote(mappingData.note);
    console.log("Data of note", note);
    openNoteDialog();
  };
  const handleNoteSumit = async (id) => {
    console.log("Note sumit with ID:", id);
    handleCancel();
  };

  const fetchGetWithdrawById = async (id) => {
    try {
      const res = await withdrawApiInstance.get(`/${id}`);
      const data = res.data._data; // Assuming the expected data is in _data
      setSelectedRequest(data);
      console.log("Selected Request:", data); // Log after setting
      return data; // Return data to handleRowClick
    } catch (error) {
      console.error("Fetch error:", error.message || error);
      return null; // Return null on error
    }
  };

  const fetchProcessWithdraw = async (id) => {
    try {
      const token = Cookies.get("_auth");
      const res = await withdrawApiInstance.patch(
        `/${id}/process`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      if (res.data._isSuccess === false) {
        notify(res.data._data._message, "error");
      }
      setBankCode(res.data._data.bankCode);
      setBankNumber(res.data._data.bankNumber);
      setStatus(1);
      openDialog();
      fetchWithdrawRequest();
      notify("Request Processed", "success");
    } catch (error) {
      console.error("Fetch error:", error.message || error);
    }
  };
  const fetchBankAccount = async (id, status) => {
    try {
      const res = await bankAccountApiInstance.get(`/${id}`);
      if (res.data._data._isSuccess === false) {
        console.log(res.data._data._message);
      }
      setBankCode(res.data._data.bankCode);
      setBankNumber(res.data._data.bankNumber);
      setStatus(status);
      openDialog();
    } catch (error) {
      console.error("Fetch error:", error.message || error);
    }
  };
  const fetchApprovedWithdraw = async (id) => {
    try {
      const token = Cookies.get("_auth");
      console.log("Token:", token);
      const res = await withdrawApiInstance.patch(
        `/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      if (res.data._isSuccess === true) {
        notify(res.data._message[0], "success"); // Use the first element of the _message array
      }
    } catch (error) {
      console.error("Fetch error:", error.message || error);
    }
  };

  const fetchCancelWithdraw = async (id, inputNote) => {
    try {
      const token = Cookies.get("_auth");
      console.log("Token:", token);
      const res = await withdrawApiInstance.patch(
        `/${id}/cancel?note=${inputNote}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      if (res.data._isSuccess === true) {
        notify(res.data._message[0], "success"); // Use the first element of the _message array
      }
    } catch (error) {
      console.error("Fetch error:", error.message || error);
    }
  };
  const handleApprove = async (id) => {
    await fetchApprovedWithdraw(id);
    closeDialog();
    fetchWithdrawRequest();
  };
  const handleCancel = async (id) => {
    openNoteDialog();
    closeDialog();
    console.log("tempNote is ", tempNote);
    await fetchCancelWithdraw(id, tempNote);
    closeDialog();
    fetchWithdrawRequest();
  };

  return (
    <div className="p-12">
      <CustomPaginationActionsTable
        data={mappingData}
        handleRowClick={handleRowClick} // Assuming you have a handler for row clicks
        handleNoteClick={handleNoteClick}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        onPageChange={handlePageChange} // Pass the page change handler
        onPageSizeChange={handlePageSizeChange} // Pass the page size change handler
      />
      <Dialog open={isNoteDialogOpen} onClose={closeNoteDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
            <button
              onClick={closeNoteDialog}
              className="absolute top-4 right-4 text-[#1BAA64] text-xl"
            >
              &times;
            </button>
            <h2 className="text-gray-800 font-bold mb-4">Note:</h2>
            {note ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600">
                {note}
              </div>
            ) : (
              <>
                <textarea
                  placeholder="Enter your note..."
                  value={tempNote} // Bind to tempNote
                  onChange={(e) => setTempNote(e.target.value)} // Update tempNote state
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring focus:ring-green-500"
                />
                <button
                  onClick={() => handleCancel(selectedRequest.id, tempNote)} // Pass note to handleCancel
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-300 rounded-md shadow-sm text-[#1BAA64] hover:bg-[#aa1b1b] hover:text-white transition-all duration-200"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog open={isProcessDialogOpen} onClose={closeProcessDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
            <button
              onClick={closeProcessDialog}
              className="absolute top-4 right-4 text-[#1BAA64] text-xl"
            >
              &times;
            </button>
            {status && (
              <div className="flex justify-center">
                <img
                  src={`https://img.vietqr.io/image/${bankCode}-${bankNumber}-compact2.jpg?amount=${
                    selectedRequest.amount
                  }&addInfo=${"Withdraw Request"}`}
                  style={{ width: "24rem", height: "24rem" }}
                />
              </div>
            )}
          </div>
        </div>
      </Dialog>
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 text-[#1BAA64] text-xl"
            >
              &times;
            </button>
            {status && (
              <div className="flex justify-center">
                <img
                  src={`https://img.vietqr.io/image/${bankCode}-${bankNumber}-compact2.jpg?amount=${
                    selectedRequest.amount
                  }&addInfo=${"Withdraw Request"}`}
                  style={{ width: "24rem" }}
                />
              </div>
            )}

            {status === 1 && (
              <div className="flex justify-center gap-5">
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-300 rounded-md shadow-sm text-[#1BAA64] hover:bg-[#1BAA64] hover:text-white transition-all duration-200"
                >
                  Approved
                </button>
                <button
                  onClick={() => handleNoteSumit(selectedRequest.id)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-300 rounded-md shadow-sm text-[#1BAA64]-600 hover:bg-[#aa1b1b] hover:text-white transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
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

export default AdminWithdrawRequest;
