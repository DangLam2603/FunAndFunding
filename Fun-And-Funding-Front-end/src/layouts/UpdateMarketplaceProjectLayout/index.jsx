/* eslint-disable no-unused-vars */
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Collapse,
  Container,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MarketplaceWithdrawButton from "../../components/MarketplaceWithdrawButton";
import { useLoading } from "../../contexts/LoadingContext";
import { useUpdateMarketplaceProject } from "../../contexts/UpdateMarketplaceProjectContext";
import marketplaceProjectApiInstace from "../../utils/ApiInstance/marketplaceProjectApiInstance";
import { editorList } from "./UpdateMarketplaceProjectLayout";

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

function UpdateMarketplaceProjectLayout() {
  const { id } = useParams();
  const token = Cookies.get("_auth");
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditExpanded, setIsEditExpanded] = useState(false);
  const { marketplaceProject, setMarketplaceProject, edited, setEdited } =
    useUpdateMarketplaceProject();
  const { isLoading, setIsLoading } = useLoading();

  const handleSaveAll = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      console.log(marketplaceProject);

      const formData = new FormData();

      formData.append("Id", id);
      formData.append("Name", marketplaceProject.name);
      formData.append("Description", marketplaceProject.description);
      formData.append("Introduction", marketplaceProject.introduction);
      formData.append("Price", marketplaceProject.price);

      if (marketplaceProject.bankAccount) {
        formData.append("BankAccount.Id", marketplaceProject.bankAccount.id);
        formData.append(
          "BankAccount.BankNumber",
          marketplaceProject.bankAccount.bankNumber
        );
        formData.append(
          "BankAccount.BankCode",
          marketplaceProject.bankAccount.bankCode
        );
      }

      if (marketplaceProject.marketplaceFiles) {
        marketplaceProject.marketplaceFiles.forEach((file, index) => {
          formData.append(`MarketplaceFiles[${index}].Id`, file.id);
          formData.append(`MarketplaceFiles[${index}].Name`, file.name);
          formData.append(`MarketplaceFiles[${index}].URL`, file.url);
          formData.append(`MarketplaceFiles[${index}].Version`, file?.version);
          formData.append(
            `MarketplaceFiles[${index}].Description`,
            file.description
          );
          formData.append(
            `MarketplaceFiles[${index}].FileType`,
            file?.fileType
          );
          formData.append(
            `MarketplaceFiles[${index}].IsDeleted`,
            file.isDeleted
          );
        });
      }
      if (marketplaceProject.existingFiles) {
        marketplaceProject.existingFiles.forEach((file, index) => {
          formData.append(`ExistingFiles[${index}].Id`, file.id);
          formData.append(`ExistingFiles[${index}].Name`, file.name);
          formData.append(`ExistingFiles[${index}].URL`, file.url);
          formData.append(`ExistingFiles[${index}].Version`, file.version);
          formData.append(
            `ExistingFiles[${index}].Description`,
            file.description
          );
          formData.append(`ExistingFiles[${index}].FileType`, file.fileType);
          formData.append(`ExistingFiles[${index}].IsDeleted`, file.isDeleted);
        });
      }

      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await marketplaceProjectApiInstace.put(
        `/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        notify("Project saved successfully!", "success");
        console.log(response);
        setEdited(false);
      } else {
        console.error(`Unexpected status code: ${response.error}`);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      notify("Save project failed.", "error");
      fetchProject();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardAll = async () => {
    fetchProject();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEdited(false);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleNavigatePreview = (id) => {
    navigate(`/account/marketplace-projects/update/${id}/preview`);
  };

  const fetchProject = async () => {
    try {
      const response = await marketplaceProjectApiInstace.get(`/${id}`);
      if (response && response.data) {
        const data = response.data._data;

        setMarketplaceProject({
          name: data.name || "",
          description: data.description || "",
          introduction: data.introduction || "",
          price: data.price || 0,
          marketplaceFiles: [],
          existingFiles:
            data.marketplaceFiles?.map((file) => ({
              id: file.id || "",
              name: file.name || "",
              url: file.url || "",
              version: file.version || "",
              description: file.description || "",
              fileType: file.fileType || 0,
              isDeleted: file.isDeleted || false,
            })) || [],
          bankAccount: {
            id: data.wallet?.bankAccount.id || "",
            bankNumber: data.wallet?.bankAccount.bankNumber || "",
            bankCode: data.wallet?.bankAccount.bankCode || "",
          },
          categories:
            data.categories?.map((category) => ({
              id: category.id || "",
              name: category.name || "",
            })) || [],
          wallet: {
            id: data.wallet?.id || "",
            balance: data.wallet?.balance || 0
          }
        });
      } else {
        console.error("No project data found");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    } finally {
      // setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditExpanded(!isEditExpanded);
  };

  const getActiveEditor = (id) => {
    const matchedEditor = editorList.find((item) =>
      location.pathname.includes(item.link(id))
    );
    return matchedEditor ? `Project Editor / ${matchedEditor.name}` : "";
  };

  const getActiveCoupon = () => {
    const matchedEditor = location.pathname.includes('coupons');
    return matchedEditor ? `Project Coupons` : "";
  };

  const getActivePreview = () => {
    const matchedEditor = location.pathname.includes('preview');
    return matchedEditor ? `Project Preview` : "";
  };

  const handleNavigation = (link) => {
    navigate(link);
  };

  const isEditorActive = editorList.some((item) =>
    location.pathname.includes(item.link(id))
  );

  const isCouponActive = location.pathname.includes('coupons');

  const isPreviewActive = location.pathname.includes('preview');

  const getActiveSection = (id) => {
    const activeEditor = getActiveEditor(id);
    const activeCoupon = getActiveCoupon();
    const activePreview = getActivePreview();
    if (activeEditor) return activeEditor;
    if (activeCoupon) return activeCoupon;
    if (activePreview) return activePreview;
    return "Unknown Section";
  };

  return (
    <>
      <Container
        sx={{
          mx: "0",
          px: "0 !important",
          width: "100% !important",
          maxWidth: "100% !important",
        }}
      >
        <Grid2 container>
          <Grid2
            size={2.5}
            sx={{
              minHeight: "100vh",
              backgroundColor: "#2F3645",
              pt: "4rem",
              color: "#F5F7F8",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "visible",
            }}
          >
            <div className="sticky mb-[8rem] top-[1.5rem] z-10">
              <div className="flex flex-col gap-[0.5rem] px-[2rem]">
                <span
                  className={`bg-[#1BAA64] text-[#EAEAEA] text-[0.75rem] px-[0.5rem] py-[0.25rem] rounded w-fit font-semibold ${marketplaceProject.status >= 0 &&
                    marketplaceProject.status <= 8
                    ? "bg-[#1BAA64]"
                    : "bg-[#FABC3F]"
                    } `}
                >
                  Marketplace
                </span>
                <Typography
                  sx={{
                    color: "#F5F7F8",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    userSelect: "none",
                    width: "100%",
                  }}
                >
                  {marketplaceProject.name ? marketplaceProject.name : "N/A"}
                </Typography>
              </div>
              <div>
                <div className="mt-[2rem]">
                  <Typography
                    className="update-project-section"
                    sx={{
                      backgroundColor:
                        isPreviewActive
                          ? "#88D1AE"
                          : "transparent",
                      color:
                        isPreviewActive
                          ? "#F5F7F8"
                          : "inherit",
                    }}
                    onClick={() =>
                      navigate(
                        `/account/marketplace-projects/update/${id}/preview`
                      )
                    }
                  >
                    Project Preview
                  </Typography>
                </div>
                <div>
                  <Typography
                    className="update-project-section"
                    onClick={handleEditToggle}
                    sx={{
                      backgroundColor:
                        isEditorActive && !isEditExpanded
                          ? "#88D1AE"
                          : "transparent",
                      color:
                        isEditorActive && !isEditExpanded
                          ? "#F5F7F8"
                          : "inherit",
                    }}
                  >
                    Project Editor
                    <IconButton sx={{ color: "#F5F7F8", ml: 1 }} size="small">
                      {isEditExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Typography>
                  <Collapse in={isEditExpanded} timeout="auto" unmountOnExit>
                    <List component="nav">
                      {editorList.map((item) => (
                        <ListItem
                          button
                          key={item.name}
                          onClick={() => handleNavigation(item.link(id))}
                          sx={{
                            backgroundColor: location.pathname.includes(
                              item.link(id)
                            )
                              ? "#88D1AE"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: "#88D1AE",
                              "& .MuiListItemText-root": {
                                color: "#F5F7F8",
                              },
                            },
                          }}
                        >
                          <ListItemText
                            primary={item.name}
                            sx={{
                              color: location.pathname.includes(item.link(id))
                                ? "#F5F7F8"
                                : "#F5F7F8",
                              fontSize: "1rem",
                              fontWeight: "600",
                              height: "2rem",
                              px: "2rem",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </div>
                <div className="">
                  <Typography
                    className="update-project-section"
                    sx={{
                      backgroundColor:
                        isCouponActive
                          ? "#88D1AE"
                          : "transparent",
                      color:
                        isCouponActive
                          ? "#F5F7F8"
                          : "inherit",
                    }}
                    onClick={() =>
                      navigate(
                        `/account/marketplace-projects/update/${id}/coupons`
                      )
                    }
                  >
                    Project Coupons
                  </Typography>
                </div>
              </div>
            </div>
            <div>
              <Typography className="update-project-section">
                Learn More About Crowdfunding Policy
              </Typography>
              <Typography className="update-project-section">
                Get Help & Support
              </Typography>
            </div>
          </Grid2>
          <Grid2 size={9.5} style={{ position: "relative" }}>
            <div>
              <div className="fixed-update-header">
                <div>
                  <Typography
                    sx={{
                      color: "#2F3645",
                      fontSize: "1rem",
                      fontWeight: "700",
                      userSelect: "none",
                      width: "100%",
                    }}
                  >
                    {getActiveSection(id)}
                  </Typography>
                </div>
                <div className={`${isEditorActive ? 'flex' : 'hidden'} justify-between gap-[1.5rem] items-center w-fit`}>
                  <Typography
                    sx={{
                      color: "#2F3645",
                      fontSize: "1rem",
                      fontWeight: "400",
                      userSelect: "none",
                      width: "fit-content",
                    }}
                  >
                    Have you finished?
                  </Typography>
                  <div className="flex gap-[1rem]">
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={!edited}
                      sx={{
                        backgroundColor: "transparent",
                        textTransform: "none",
                      }}
                      onClick={() => handleDiscardAll()}
                    >
                      Discard All Changes
                    </Button>
                    <Button
                      variant="contained"
                      disabled={!edited}
                      sx={{ backgroundColor: "#1BAA64", textTransform: "none" }}
                      onClick={(event) => handleSaveAll(event)}
                    >
                      Save All Changes
                    </Button>
                  </div>
                </div>
                <div className={`${isPreviewActive ? 'flex' : 'hidden'} justify-between gap-[1.5rem] items-center w-fit`}>
                  <Typography
                    sx={{
                      color: "#2F3645",
                      fontSize: "1rem",
                      fontWeight: "400",
                      userSelect: "none",
                      width: "fit-content",
                    }}
                  >
                    Want to withdraw your money?
                  </Typography>
                  <div className="flex gap-[1rem]">
                    <MarketplaceWithdrawButton id={id} />
                  </div>
                </div>
              </div>
              <Outlet />
            </div>
          </Grid2>
        </Grid2>
      </Container>
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
}

export default UpdateMarketplaceProjectLayout;
