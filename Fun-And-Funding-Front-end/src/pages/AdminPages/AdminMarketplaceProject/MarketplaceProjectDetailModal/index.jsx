import { ArrowRightAlt } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid2,
  IconButton,
  Modal,
  Paper,
  Tab,
  Tabs,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useLoading } from "../../../../contexts/LoadingContext";
import marketplaceProjectApiInstace from "../../../../utils/ApiInstance/marketplaceProjectApiInstance";
import MarketplaceProjectOverview from "./MarketplaceProjectOverview";
import Purchases from "../../../../components/AdminMarketplaceProject/Purchases";
import orderApiInstance from "../../../../utils/ApiInstance/orderApiInstance";
import orderDetailApiInstance from "../../../../utils/ApiInstance/orderDetailApiInstance";
import MarketplaceProjectGameFile from "./MarketplaceProjectGameFile";
import EmailIcon from "@mui/icons-material/Email";

const notify = (message, type) => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: "#ffffff",
      color: "#2F3645",
      fontWeight: "600",
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

const projectStatus = {
  0: { name: "Deleted", color: "var(--red)" },
  1: { name: "Pending", color: "#FFC107" },
  2: { name: "Processing", color: "#2196F3" },
  3: { name: "Funded Successful", color: "var(--primary-green)" },
  4: { name: "Successful", color: "var(--primary-green)" },
  5: { name: "Failed", color: "var(--red)" },
  6: { name: "Rejected", color: "var(--red)" },
  7: { name: "Approved", color: "var(--primary-green)" },
  8: { name: "Withdrawed", color: "#9C27B0" },
  9: { name: "Refunded", color: "#FF5722" },
  10: { name: "Reported", color: "#E91E63" },
};

const MarketplaceProjectDetailModal = ({
  selectedMarketplaceProjectId,
  openModal,
  setOpenModal,
  fetchMarketplaceProjectList,
}) => {
  const { isLoading, setIsLoading } = useLoading();
  const token = Cookies.get("_auth");
  const [selectedMarketplaceProject, setSelectedMarketplaceProject] =
    useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [displayNoteModal, setDisplayNoteModal] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    boxShadow: 24,
    px: "2rem",
    py: "2rem",
    minHeight: "90%",
    borderRadius: 1,
  };

  const noteStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "35%",
    bgcolor: "background.paper",
    boxShadow: 24,
    px: "2rem",
    py: "2rem",
    height: "fit-content",
    borderRadius: 1,
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedMarketplaceProject(null);
    setActiveTab(0);
  };

  const handleNoteClose = () => {
    setRejectNote("");
    setOpenNoteModal(false);
  };

  useEffect(() => {
    if (openModal && selectedMarketplaceProjectId) {
      fetchMarketplaceProject();
      fecthOrders();
    }
  }, [selectedMarketplaceProjectId, openModal]);

  const fetchMarketplaceProject = async () => {
    try {
      setIsLoading(true);
      const res = await marketplaceProjectApiInstace.get(
        `${selectedMarketplaceProjectId}`
      );
      if (res.status == 200) {
        setSelectedMarketplaceProject(res.data._data);
      }
    } catch (error) {
      notify(
        error.response?.data?.message || error.message || "An error occurred",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fecthOrders = async () => {
    try {
      setIsLoading(true);
      const res = await orderDetailApiInstance.get(
        `/${selectedMarketplaceProjectId}/purchases`
      );
      if (res.status == 200) {
        setOrders(res.data._data);
      }
    } catch (error) {
      notify(
        error.response?.data?.message || error.message || "An error occurred",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = async (status) => {
    try {
      const message =
        status === 6
          ? "Do you want to reject this project?"
          : status === 2
          ? "Do you want to approve this project?"
          : "Do you want to block this project?";
      const actionText =
        status === 6 ? "Reject" : status === 2 ? "Approve" : "Block";

      Swal.fire({
        title: "Are you sure?",
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--red)",
        cancelButtonColor: "var(--grey)",
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes",
        customClass: {
          popup: "manage-user-detail-popup",
          cancelButton: "manage-user-detail-popup-cancel-button",
          confirmButton: "manage-user-detail-popup-confirm-button",
        },
        didOpen: () => {
          const swalPopup = document.querySelector(".manage-user-detail-popup");
          swalPopup.style.zIndex = 9999;
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await marketplaceProjectApiInstace.patch(
              `${selectedMarketplaceProjectId}/status?status=${status}`,
              status == 6 ? JSON.stringify(rejectNote) : null,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(res.data);

            setRejectNote("");
            setOpenNoteModal(false);

            if (res.status === 200) {
              fetchMarketplaceProject();
              fetchMarketplaceProjectList();
              Swal.fire({
                title: `${actionText}d!`,
                text: `${actionText} the project successfully.`,
                icon: "success",
                confirmButtonColor: "var(--primary-green)",
                confirmButtonText: "I understand",
                customClass: {
                  popup: "manage-user-detail-popup",
                },
              });
            }
          } catch (error) {
            notify(
              error.response?.data?.message ||
                error.message ||
                "An error occurred",
              "error"
            );
          }
        }
      });
    } catch (error) {
      notify(
        error.response?.data?.message || error.message || "An error occurred",
        "error"
      );
    }
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{ zIndex: "50 !important" }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            {selectedMarketplaceProject != null &&
              JSON.stringify(selectedMarketplaceProject) !== "{}" && (
                <>
                  <div className="mb-[1.5rem] mx-[0.5rem]">
                    <Typography sx={{ fontSize: "1.5rem", fontWeight: "700" }}>
                      Marketplace project detail
                    </Typography>
                    <Typography
                      sx={{ mt: "0.5rem", fontSize: "1rem", fontWeight: 400 }}
                    >
                      Showing marketplace project detail of{" "}
                      <span className="text-[var(--primary-green)] font-semibold">
                        {selectedMarketplaceProject?.name}
                      </span>
                    </Typography>
                  </div>
                  <Box
                    sx={{
                      height: [1, 2].includes(
                        selectedMarketplaceProject?.status
                      )
                        ? "33.5rem"
                        : "30rem",
                      overflowY: "auto",
                      overflowX: "visible",
                      px: "0.5rem",
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        bgcolor: "var(--white)",
                        py: "1rem",
                        px: "1rem",
                        mt: "0.25rem",
                        mb: "1.5rem",
                        borderRadius: "0.625rem",
                      }}
                    >
                      <Grid2 container columnSpacing={4} alignItems="center">
                        <Grid2 size={5}>
                          <div className="overflow-hidden flex justify-start items-center w-fit">
                            <img
                              className=" h-[11rem] object-cover rounded-[0.625rem] w-[20rem]"
                              alt="Funding project image"
                              src={
                                selectedMarketplaceProject?.marketplaceFiles.find(
                                  (e) => e.fileType == 2
                                )?.url
                              }
                            />
                          </div>
                        </Grid2>
                        <Grid2 size={7}>
                          <div className="flex justify-between">
                            <Typography sx={{ mb: "0.5rem" }}>
                              <span
                                className={`text-[0.75rem] font-semibold me-2 px-2.5 py-1 rounded text-white`}
                                style={{
                                  backgroundColor:
                                    projectStatus[
                                      selectedMarketplaceProject.status
                                    ]?.color || "#9E9E9E",
                                }}
                              >
                                {projectStatus[
                                  selectedMarketplaceProject.status
                                ]?.name || "Unknown"}
                              </span>
                            </Typography>
                            {selectedMarketplaceProject?.note != null &&
                              selectedMarketplaceProject.note.length > 0 && (
                                <Tooltip
                                  title="Show feedback"
                                  arrow
                                  placement="left-end"
                                >
                                  <IconButton
                                    onClick={() => setDisplayNoteModal(true)}
                                    sx={{ padding: 0, ml: "1.5rem" }}
                                  >
                                    <Box
                                      sx={{
                                        backgroundColor: "var(--white)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "1.25rem",
                                        height: "1rem",
                                      }}
                                    >
                                      <EmailIcon
                                        sx={{
                                          width: "1.75rem",
                                          height: "1.75rem",
                                          color: "var(--primary-green)",
                                        }}
                                      />
                                    </Box>
                                  </IconButton>
                                </Tooltip>
                              )}
                          </div>
                          <Typography
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "700",
                              mb: "0.25rem",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              width: "25rem",
                            }}
                          >
                            {selectedMarketplaceProject.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: "500",
                              mb: "1rem",
                              color: "var(--grey)",
                            }}
                          >
                            {new Date(
                              selectedMarketplaceProject.createdDate
                            ).toLocaleString()}
                          </Typography>
                          {selectedMarketplaceProject.status !== undefined &&
                            ![0, 1, 6, 7].includes(
                              selectedMarketplaceProject.status
                            ) && (
                              <button
                                onClick={() => {
                                  window.open(
                                    `/marketplace-detail/${selectedMarketplaceProject?.id}`,
                                    "_blank"
                                  );
                                }}
                                className="text-[var(--white)] bg-gradient-to-r text-[0.9rem] from-primary-green/70 via-primary-green/80 to-primary-green hover:bg-gradient-to-br font-semibold rounded-[0.5rem] px-3 text-center me-2 py-1.5"
                              >
                                Go to project <ArrowRightAlt />
                              </button>
                            )}
                        </Grid2>
                      </Grid2>
                    </Paper>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        my: "1.5rem",
                      }}
                    >
                      <Tabs
                        value={activeTab}
                        onChange={handleChange}
                        indicatorColor="primary"
                        sx={{
                          "& .MuiTabs-indicator": {
                            backgroundColor: "var(--primary-green) !important",
                          },
                        }}
                      >
                        <Tab
                          value={0}
                          label="Overview"
                          sx={{
                            textTransform: "none",
                            color:
                              activeTab === 0
                                ? "var(--primary-green) !important"
                                : "var(--grey)",
                            fontSize: activeTab === 0 ? "1rem" : "inherit",
                            fontWeight: activeTab === 0 ? 600 : 500,
                          }}
                        />
                        <Tab
                          value={1}
                          label="Game Content"
                          sx={{
                            textTransform: "none",
                            color:
                              activeTab === 1
                                ? "var(--primary-green) !important"
                                : "var(--grey)",
                            fontSize: activeTab === 1 ? "1rem" : "inherit",
                            fontWeight: activeTab === 1 ? 600 : 500,
                          }}
                        />
                        <Tab
                          value={2}
                          label="Purchases"
                          sx={{
                            textTransform: "none",
                            color:
                              activeTab === 2
                                ? "var(--primary-green) !important"
                                : "var(--grey)",
                            fontSize: activeTab === 2 ? "1rem" : "inherit",
                            fontWeight: activeTab === 2 ? 600 : 500,
                          }}
                        />
                      </Tabs>
                    </Box>
                    {activeTab == 0 ? (
                      <MarketplaceProjectOverview
                        marketplaceProject={selectedMarketplaceProject}
                      />
                    ) : activeTab == 2 ? (
                      <Purchases orders={orders} />
                    ) : (
                      <MarketplaceProjectGameFile
                        marketplaceProject={selectedMarketplaceProject}
                      />
                    )}
                  </Box>
                  <div
                    className="mx-[0.5rem] pt-[1rem] justify-end gap-[1rem] shadow-[0_-4px_4px_-2px_rgba(0,0,0,0.1)] h-[3.5rem]"
                    style={{
                      display:
                        selectedMarketplaceProject?.status == 1
                          ? "flex"
                          : "none",
                    }}
                  >
                    <Button
                      variant="contained"
                      className="manage-user-detail-block-button"
                      onClick={() => setOpenNoteModal(true)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      className="manage-user-detail-unblock-button"
                      onClick={() => handleChangeStatus(2)}
                    >
                      Approve
                    </Button>
                  </div>
                  <div
                    className="mx-[0.5rem] pt-[1rem] justify-end gap-[1rem] shadow-[0_-4px_4px_-2px_rgba(0,0,0,0.1)] h-[3.5rem]"
                    style={{
                      display: [2].includes(selectedMarketplaceProject?.status)
                        ? "flex"
                        : "none",
                    }}
                  >
                    <Button
                      variant="contained"
                      className="manage-user-detail-block-button"
                      onClick={() => handleChangeStatus(10)}
                    >
                      Block Project
                    </Button>
                  </div>
                </>
              )}
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={openNoteModal}
        onClose={handleNoteClose}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{ zIndex: "51 !important" }}
      >
        <Fade in={openNoteModal}>
          <Box sx={noteStyle}>
            <div className="flex justify-center flex-col items-center mb-[2rem]">
              <Typography sx={{ fontSize: "1.5rem", fontWeight: "700" }}>
                Provide feedbacks
              </Typography>
              <Typography
                sx={{ mt: "0.25rem", fontSize: "1rem", fontWeight: 400 }}
              >
                Give reasons to why this project is rejected
              </Typography>
            </div>
            <TextareaAutosize
              minRows={10}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid var(--light-grey)",
                borderRadius: "4px",
                outline: "none",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              onFocus={(e) =>
                (e.target.style.border = "1px solid var(--black)")
              }
              onBlur={(e) =>
                (e.target.style.border = "1px solid var(--light-grey)")
              }
            />
            <div className="mt-[1rem] flex flex-row justify-center gap-[1rem]">
              <Button
                variant="contained"
                className="manage-user-detail-cancel-button !bg-[var(--light-grey)]"
                onClick={() => handleNoteClose()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="manage-user-detail-unblock-button"
                onClick={() => handleChangeStatus(6)}
              >
                Send
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={displayNoteModal}
        onClose={() => setDisplayNoteModal(false)}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{ zIndex: "1000000 !important" }}
      >
        <Fade in={displayNoteModal}>
          <Box sx={noteStyle}>
            <div className="flex justify-center flex-col items-center mb-[2rem]">
              <Typography sx={{ fontSize: "1.5rem", fontWeight: "700" }}>
                Feedback
              </Typography>
              <Typography
                sx={{ mt: "0.25rem", fontSize: "1rem", fontWeight: 400 }}
              >
                Reasons to why this project is rejected.
              </Typography>
            </div>
            <TextareaAutosize
              minRows={10}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid var(--light-grey)",
                borderRadius: "4px",
                outline: "none",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
              value={selectedMarketplaceProject?.note ?? null}
              disabled
              onFocus={(e) =>
                (e.target.style.border = "1px solid var(--black)")
              }
              onBlur={(e) =>
                (e.target.style.border = "1px solid var(--light-grey)")
              }
            />
          </Box>
        </Fade>
      </Modal>

      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
      />
    </>
  );
};

export default MarketplaceProjectDetailModal;
