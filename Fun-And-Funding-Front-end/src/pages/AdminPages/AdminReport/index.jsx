import { useState, useEffect } from "react";
import reportApiInstance from "../../../utils/ApiInstance/reportApiInstance";
import { ToastContainer, toast } from "react-toastify";
import ReportTable from "../../../components/ReportTable";
import userApiInstace from "../../../utils/ApiInstance/userApiInstance";
import fundingProjectApiInstace from "../../../utils/ApiInstance/fundingProjectApiInstance";
import Cookies from "js-cookie";
import { Dialog } from "@mui/material";
import ReactQuill from "react-quill";
import marketplaceProjectApiInstace from "../../../utils/ApiInstance/marketplaceProjectApiInstance";

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

function AdminReport() {
  const [dataLoad, setDataLoad] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [content, setContent] = useState("");
  const [reportId, setReportId] = useState("");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });
  const [mappedData, setMappedData] = useState([]); // State to store the mapped data

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleEmailSubmit = async () => {
    await sendEmail();
    await fetchUpdateStatus(reportId);
  };
  const fetchUserById = async (userId) => {
    try {
      const response = await userApiInstace.get(`/${userId}`);
      return response.data._data;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMarketplaceProjectById = async (Id) => {
    try {
      const response = await marketplaceProjectApiInstace.get(`/${Id}`);
      return response.data._data;
    } catch (error) {
      console.log(error);
    }
  };
  const sendEmail = async () => {
    try {
      const token = Cookies.get("_auth");
      if (!token) {
        notify("Authentication required", "error");
        return;
      }

      console.log("Sending email with content:", content);

      const payload = {
        ReportId: reportId,
        Content: content,
      };
      console.log("Payload:", payload);
      const response = await reportApiInstance.post(`/send-email`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      if (data._isSuccess) {
        notify("Email has been sent", "success");
        fetchReportList();
        handleCloseDialog();
      } else {
        notify(data.message || "Failed to send email", "error");
      }
    } catch (error) {
      console.error("Error while sending email:", error);
      notify("An error occurred while sending the email", "error");
    }
  };

  const fetchUpdateStatus = async (reportId) => {
    try {
      const token = Cookies.get("_auth");
      console.log(token);
      // Make sure the Authorization header is in the headers object
      const response = await reportApiInstance.patch(
        `?id=${reportId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(data);
      if (data._isSuccess === true) {
        notify("Report has been handled", "success");
        fetchReportList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjectById = async (projectId) => {
    try {
      const response = await fundingProjectApiInstace.get(`/${projectId}`);
      return response.data._data;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePagination = (updates) => {
    setPagination((prev) => ({ ...prev, ...updates }));
  };

  const handlePageChange = (newPage) => {
    fetchReportList(newPage, pagination.pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    updatePagination({ pageSize: newPageSize });
    fetchReportList(0, newPageSize);
  };

  const fetchReportList = async (
    page = pagination.currentPage,
    pageSize = pagination.pageSize
  ) => {
    try {
      const response = await reportApiInstance.get("", {
        params: {
          pageIndex: page + 1,
          pageSize: pageSize,
        },
      });
      console.log(response.data);
      const { items, totalItems, totalPages } = response.data._data;
      setDataLoad(items || []); // Ensure items is an array
      updatePagination({ totalItems, totalPages, currentPage: page });
    } catch (error) {
      console.log(error);
      notify("Something went wrong", "error");
    }
  };

  useEffect(() => {
    fetchReportList();
  }, []);

  useEffect(() => {
    const mapData = async () => {
      const mapped = await Promise.all(
        (dataLoad || []).map(async (data) => {
          const user = await fetchUserById(data.reporterId);
          let ViolatorParse = "";

          if (data.type === 0) {
            const Violator = await fetchUserById(data.violatorId);
            ViolatorParse = Violator.userName;
          } else if (data.type === 1) {
            const fundingProject = await fetchProjectById(data.violatorId);
            console.log("project found", fundingProject);
            ViolatorParse = fundingProject.name;
          } else {
            const marketplaceProject = await fetchMarketplaceProjectById(
              data.violatorId
            );
            console.log("Marketplace project found", marketplaceProject);
            ViolatorParse = marketplaceProject.name;
          }

          return {
            Id: data.id,
            REPORTER: user ? user.userName : "Unknown",
            VIOLATOR: ViolatorParse,
            CONTENT: data.content,
            HANDLED: data.isHandle ? "Handled" : "Not handled",
            DATE: formatDate(data.date),
            FILES: data.fileUrls,
            CAUSES: data.faultCauses,
          };
        })
      );
      setMappedData(mapped);
    };

    if (dataLoad.length > 0) {
      mapData();
    }
  }, [dataLoad]); // Re-run whenever dataLoad changes

  const handleRowClick = async (reportId) => {
    try {
      console.log(reportId);
      setReportId(reportId);
      handleOpenDialog();
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="p-12">
      <ReportTable
        data={mappedData} // Use the mapped data here
        handleRowClick={handleRowClick}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="w-[75rem] bg-white p-10 rounded-3xl shadow-lg mb-10 overflow-y-auto max-h-[90vh]">
            <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">
              Send Report Email Description
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEmailSubmit();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <ReactQuill
                  value={content}
                  onChange={(value) => setContent(value)}
                />
              </div>
              <div className="flex justify-around gap-4">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Send email
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
      </Dialog>
    </div>
  );
}

export default AdminReport;
