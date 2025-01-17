/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { TabContext, TabList } from "@mui/lab";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  LinearProgress,
  linearProgressClasses,
  Stack,
  styled,
  Tab,
  tabsClasses,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DOMPurify from "dompurify";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import BackerSection from "../../components/BackerSection";
import CommentSection from "../../components/CommentSection";
import PackageReward from "../../components/PackageList/PackageReward";
import PackageSide from "../../components/PackageList/PackageSide";
import ProjectImages from "../../components/ProjectImages";
import ProjectIntro from "../../components/ProjectIntro";
import ReportForm from "../../components/ReportPopUp";
import RequestMilestoneModal from "../../components/RequestMilestoneModal";
import UpdatesSection from "../../components/UpdatesSection";
import fundingProjectApiInstance from "../../utils/ApiInstance/fundingProjectApiInstance";
import milestoneApiInstace from "../../utils/ApiInstance/milestoneApiInstance";
import "./index.css";
import { useNavigate } from "react-router-dom";
import packageBackerApiInstance from "../../utils/ApiInstance/packageBackerApiInstance";
import { AutoAwesome, Bookmark, Favorite, Report, ReportGmailerrorred } from "@mui/icons-material";
import followApiInstace from "../../utils/ApiInstance/followApiInstance";
const ProjectDetail = () => {
  const token = Cookies.get("_auth");
  //sample owwner
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  //sample data
  const { id } = useParams();
  console.log(id);

  const convertPercentage = (a, b) => Math.ceil((a / b) * 100);
  const [tabValue, setTabValue] = useState("1");
  const [projectData, setProjectData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [saniIntro, setSaniIntro] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [firstMilestone, setFirstMilestone] = useState({});
  const [buttonActive, setButtonActive] = useState(false);
  const [buttonBackerActive, setButtonBackerActive] = useState(false);
  const [isBacker, setIsBacker] = useState(false);
  const [packBackers, setPackBackers] = useState([]);
  // project status
  const deleted = 0;
  const pending = 1;
  const processing = 2;
  const fundedSuccessful = 3;
  const successful = 4;
  const failed = 5;
  const rejected = 6;
  const approved = 7;
  const withdrawed = 8;
  const refunded = 9;
  const reported = 10;
  const [openDialog, setOpenDialog] = useState(false);

  //fetch backers
  const fetchBackers = async (id) => {
    try {
      await packageBackerApiInstance
        .get(`/project-backers-detail?projectId=${id}`)
        .then((res) => {
          console.log(res.data);
          if (res.data._isSuccess) {
            setPackBackers(res.data._data);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  // status logic onclick
  const handleRequestMilestone = () => {
    setIsModalOpen(true);
    console.log(firstMilestone);
  };
  const handleUpdateProject = () => {
    navigate("/account/projects")
  };

  const handleProcess = () => {
    const fixStatus = projectData.status;
    console.log(fixStatus);
    switch (fixStatus) {
      case processing:
        return handleUpdateProject();
      case fundedSuccessful:
        // return handleRequestMilestone();
        return navigate(`/account/projects/update/${projectData.id}/basic-info`)
      default:
        return;
    }
  };
  //check project owner
  const checkOwner = (status) => {
    token &&
      fundingProjectApiInstance
        .get("/project-owner", {
          params: {
            projectId: id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data._data) {
            if (response.data._message == "owner") {
              setButtonBackerActive(true);
              setIsOwner(response.data._data);
              if (status == processing || status == fundedSuccessful) {
                setButtonActive(false);
              } else {
                setButtonActive(true);
              }
            } else if (response.data._message == "backer of this project") {
              setIsBacker(response.data._data);
              if (status == processing) {
                setButtonActive(false);
                setButtonBackerActive(false);
              } else {
                setButtonActive(true);
                setButtonBackerActive(true);
              }
            }
          }
        });
  };
  //fetch milestones
  const fetchMilestones = async () => {
    try {
      milestoneApiInstace.get(`/group-latest-milestone`).then((response) => {
        setMilestones(response.data._data);
        let first = response.data._data.find(
          (milestone) => milestone.milestoneOrder === 1
        );
        setFirstMilestone(first);
        console.log(response.data._data);
      });
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };
  //fetch project data
  const fetchProject = async () => {
    try {
      const data = await fundingProjectApiInstance
        .get(`/${id}`)
        .then((response) => {
          setProjectData(response.data._data);
          setIsLoading(true);
          const start = new Date();
          const end = new Date(response.data._data.endDate);
          // Set both dates to midnight to only compare calendar dates
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          const timeDiff = end - start;
          const sanitizeIntro = DOMPurify.sanitize(
            response.data._data.introduction
          );
          setSaniIntro(sanitizeIntro);
          console.log(sanitizeIntro);
          // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 ms)
          const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));
          setDaysLeft(dayDiff);
          //setButton disabled status
          checkOwner(response.data._data.status);
          fetchBackers(response.data._data.id);
        });
      console.log(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };
  useEffect(() => {
    fetchProject();
    fetchMilestones();
  }, [id]);

  console.log(projectData);

  //handleTab
  const handleTabValue = (event, newValue) => {
    const validValues = ["1", "2", "3", "4", "5", "6"];
    setTabValue(validValues.includes(newValue) ? newValue : "1"); // Default to "Introduction"
  };
  const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 15,
    borderRadius: 40,
    // marginTop: 20,
    marginBottom: 20,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#D8D8D8",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 40,
      backgroundColor: "#1BAA64",
    },
  }));
  //handle modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    console.log(isModalOpen);
  };

  const renderButtonContent = () => {
    const fixStatus = projectData.status;
    switch (fixStatus) {
      case processing:
        return "Manage Project";
      case fundedSuccessful:
        return "Request Milestone";
      default:
        // setButtonActive(true);
        return "Unable to take action";
    }
  };

  const handleSendNotification = async () => {
    try {
      const notification = {
        message: "User suongck donated to your project!",
        notificationType: 0,
        objectId: "4fb92d5b-f332-4d12-4858-08dcf8e9388d",
        date: new Date(),
        isRead: false,
      };

      const userIdList = [
        "f766c910-4f6a-421e-a1a3-61534e6005c3",
        "408D9BDB-7AAF-4AAA-B31A-968E0BEF4813",
      ];

      const payload = {
        notification,
        userIds: userIdList,
      };

      await fetch("https://localhost:7044/api/notification/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  // bg-gradient-to-br from-dark-green via-primary-green to-gray-200 background-animate

  const handleFollow = async () => {
    await followApiInstace
      .post(
        `/${id}/funding-project`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  };

  const projectStatusString = [
    'Deleted',
    'Pending',
    'Processing',
    'Funded Successfully',
    'Successful',
    'Failed',
    'Rejected',
    'Approved',
    'Withdrawed',
    'Refunded',
    'Reported'
  ]

  const targetRef = useRef(null)

  const handleScroll = () => {
    if (targetRef.current) {
      setTabValue("2")
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box>
      {isLoading && (
        <>
          <div className="bg-gradient-to-r from-primary-green via-dark-green to-primary-green background-animate h-[4rem] flex items-center">
            <div className="px-[7rem]">
              {isOwner ? (
                <div className="text-gray-200 font-semibold flex items-center gap-1">
                  <AutoAwesome /> You are the owner of this funding project{" "}
                  <AutoAwesome />
                  <button
                    onClick={() =>
                      navigate(`/account/projects/update/${id}/basic-info`)
                    }
                    className="text-sm ml-4 text-white bg-gray-200/40 px-2 py-1 rounded backdrop-blur-3xl"
                  >
                    Manage project
                  </button>
                </div>
              ) : (
                <div className="text-gray-200 font-semibold flex items-center gap-1">
                  Explore other funding project
                  <button
                    onClick={() => navigate(`/crowdfunding`)}
                    className="text-sm ml-4 text-white bg-gray-200/40 px-2 py-1 rounded backdrop-blur-3xl"
                  >
                    Explore
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="pt-[2.5rem] pb-[1rem] bg-gray-200/60">
            <div className="w-[85%] mx-auto">
              <Grid container spacing={1}>
                <Grid size={6.5} sx={{ mt: "0 !important" }}>
                  <Box>
                    <ProjectImages files={projectData.fundingFiles} />
                  </Box>
                </Grid>
                <Grid
                  size={5.5}
                  sx={{ mt: "0 !important", justifyContent: "space-between" }}
                >
                  {/* project detail */}
                  <Container>
                    <div className="flex justify-between">
                      <div className="text-primary-green font-semibold">
                        {projectStatusString[projectData.status]}
                      </div>
                      {/* <Report
                        className="text-red-700 hover:cursor-pointer"
                        onClick={handleOpenDialog}
                      /> */}
                    </div>

                    <ReportForm
                      violatorId={id}
                      type={"1"}
                      closeDialog={handleCloseDialog}
                      openDialog={openDialog}
                    />
                    <div className="text-[2.8rem] font-semibold">
                      {projectData.name.toUpperCase()}
                    </div>
                    <div className="text-gray-800 font-medium">
                      {projectData.description}
                    </div>

                    {/* owner info */}
                    <div className="flex items-center my-5">
                      <Avatar
                        sx={{
                          width: "3rem",
                          height: "3rem",
                          marginRight: "10px",
                        }}
                      />
                      <Box>
                        <div className="font-semibold text-lg">
                          {projectData.user.fullName}
                        </div>
                        <Typography sx={{ fontSize: "12px", opacity: "0.6" }}>
                          {/* 1 campaign | Rollinsofrd, United States */}
                          {projectData.user.email}
                        </Typography>
                      </Box>
                    </div>
                    {/* progress bar */}
                    <Box className="my-[2rem]">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography sx={{ fontSize: "1rem", fontWeight: 800 }}>
                          {projectData.balance.toLocaleString("de-DE")}{" "}
                          <span style={{ fontSize: "1rem", fontWeight: "400" }}>
                            VND
                          </span>
                        </Typography>
                        <Typography sx={{ fontSize: "1rem", fontWeight: 800 }}>
                          {packBackers.length}{" "}
                          <span style={{ fontSize: "1rem", fontWeight: "400" }}>
                            backers
                          </span>
                        </Typography>
                      </Box>
                      <BorderLinearProgress
                        variant="determinate"
                        sx={{ width: "100%", my: 0, py: 1 }}
                        value={convertPercentage(
                          projectData.balance,
                          projectData.target
                        ) <= 100 ? convertPercentage(projectData.balance, projectData.target) : 100}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "5px",
                        }}
                      >
                        <Typography sx={{ fontSize: "1rem" }}>
                          {convertPercentage(
                            projectData.balance,
                            projectData.target
                          )}
                          %{" "}
                          <span style={{ fontSize: "1rem" }}>
                            out of {projectData.target.toLocaleString("de-DE")}{" "}
                            vnd
                          </span>
                        </Typography>
                        <Typography sx={{ fontSize: "1rem" }}>
                          {daysLeft >= 0 ? daysLeft : 0}{" "}
                          <span style={{ fontSize: "1rem" }}>days left</span>
                        </Typography>
                      </Box>
                    </Box>

                    {/* buttons interaction */}
                    <Stack spacing={1} direction="column">
                      <Button
                        variant="contained"
                        disabled={buttonActive}
                        sx={{
                          width: "100%",
                          whiteSpace: "nowrap",
                          background: "#1BAA64",
                          fontWeight: "900",
                          height: "3rem",
                          "&:hover": {
                            boxShadow: "none",
                            border: "2px solid var(--primary-green)",
                          },
                        }}
                        onClick={() => {
                          if (isOwner) {
                            handleProcess();
                          }
                          else {
                            handleScroll()
                          }
                        }}
                        className="like-btn"
                      >
                        {isOwner ? (
                          <Typography sx={{ fontWeight: "600" }}>
                            {renderButtonContent()}
                          </Typography>
                        ) : (
                          <Typography
                            sx={{ fontWeight: "600" }}
                            onClick={() =>
                              handleTabValue(null, "2")
                            }
                          >
                            Back this project
                          </Typography>
                        )}
                      </Button>
                      {firstMilestone && (
                        <RequestMilestoneModal
                          milestone={firstMilestone && firstMilestone}
                          open={isModalOpen}
                          handleClose={() => handleClose()}
                          projectId={projectData.id}
                        />
                      )}
                      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                        <Grid size={6}>
                          <Button
                            variant="contained"
                            onClick={handleFollow}
                            sx={{
                              width: "100%",
                              whiteSpace: "nowrap",
                              background: "#FFFFFF",
                              fontWeight: "900",
                              py: 1,
                              color: "rgba(0, 0, 0, 0.7)",
                              boxShadow: "none",
                              border: "2px solid rgba(0, 0, 0, 0.5)",
                              height: "3rem",
                            }}
                            className="like-btn flex items-center gap-1"
                          >
                            <Bookmark sx={{ fontSize: "1.2rem" }} />{" "}
                            <span className="text-[1rem]">Follow</span>
                          </Button>
                        </Grid>
                        <Grid size={6}>
                          <Button
                            variant="contained"
                            className="marketplace-project-report-button"
                            onClick={handleOpenDialog}

                          >
                            <ReportGmailerrorredIcon
                              style={{
                                marginRight: "0.5rem",
                                fontSize: "1.5rem",
                              }}
                            />
                            Report
                          </Button>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Container>
                </Grid>
              </Grid>
            </div>
          </div>

          <Divider />
          {/* tab value */}
          <TabContext value={tabValue}>
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 2,
              }}
            >
              <Box>
                <TabList
                  onChange={handleTabValue}
                  // centered
                  // variant="fullWidth"
                  className="detail-tab"
                  sx={{
                    background: "white",
                    [`& .${tabsClasses.scrollButtons}`]: {
                      "&.Mui-disabled": { opacity: 0.3 },
                    },
                    [`& .MuiTabs-indicator`]: {
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  {/* intro */}
                  <Tab
                    label="Introduction"
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "bold",
                      px: 4,
                      py: 2,
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                      textTransform: "none",
                      color: "rgba(0, 0, 0, 0.6) !important",
                      "&:active": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                      "&:focus": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                    }}
                    value="1"
                  />
                  {/* reward */}
                  <Tab
                    label="Rewards"
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "bold",
                      px: 4,
                      py: 2,
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                      textTransform: "none",
                      color: "rgba(0, 0, 0, 0.6) !important",
                      "&:active": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                      "&:focus": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                    }}
                    value="2"
                  />
                  {/* comment  */}
                  <Tab
                    label="Comments"
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "bold",
                      px: 4,
                      py: 2,
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                      textTransform: "none",
                      color: "rgba(0, 0, 0, 0.6) !important",
                      "&:active": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                      "&:focus": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                    }}
                    value="3"
                  />
                  <Tab
                    label="Updates"
                    ref={targetRef}
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "bold",
                      px: 4,
                      py: 2,
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                      textTransform: "none",
                      color: "rgba(0, 0, 0, 0.6) !important",
                      "&:active": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                      "&:focus": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                    }}
                    value="4"
                  />
                  <Tab
                    label="Backers"
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "bold",
                      px: 4,
                      py: 2,
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                      textTransform: "none",
                      color: "rgba(0, 0, 0, 0.6) !important",
                      "&:active": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                      "&:focus": {
                        outline: "none !important",
                        color: "#1BAA64 !important",
                        background: "transparent !important",
                      },
                    }}
                    value="5"
                  />
                </TabList>
              </Box>
              <Divider />
            </Box>

            <div className="bg-white flex justify-center py-[3rem] min-h-[40rem] overflow-y-auto">
              <div className="w-[90%]">
                {tabValue === "1" && (
                  <Grid2 container spacing={4}>
                    <Grid2 size={8}>
                      <ProjectIntro intro={saniIntro} />
                    </Grid2>
                    <Grid2 size={4}>
                      <PackageSide
                        isButtonActive={buttonBackerActive}
                        packageList={projectData.packages}
                        reloadDetail={fetchProject}
                      />
                    </Grid2>
                  </Grid2>
                )}
                {tabValue === "2" && (
                  <div>
                    <PackageReward
                      isButtonActive={buttonBackerActive}
                      packageList={projectData.packages}
                      reloadDetail={fetchProject}
                    />
                  </div>
                )}
                {tabValue === "3" && (
                  <Grid2 container spacing={4}>
                    <Grid2 size={8} className="flex justify-center">
                      <div className="w-[80%]">
                        {
                          isBacker && (
                            <CommentSection
                              isBacker={isBacker || isOwner}
                              projectId={projectData.id}
                            />
                          )
                        }

                      </div>
                    </Grid2>
                    <Grid2 size={4}>
                      <PackageSide
                        isButtonActive={buttonBackerActive}
                        packageList={projectData.packages}
                        reloadDetail={fetchProject}
                      />
                    </Grid2>
                  </Grid2>
                )}
                {tabValue === "4" && (
                  <Grid2 container spacing={4}>
                    <Grid2 size={12} className="flex justify-center">
                      <div className="w-[55%]">
                        <Box>
                          <UpdatesSection />
                        </Box>
                      </div>
                    </Grid2>
                    {/* <Grid2 size={0} sx={{ height: "100%" }}>
                      <PackageSide
                        isButtonActive={buttonBackerActive}
                        packageList={projectData.packages}
                        reloadDetail={fetchProject}
                      />
                    </Grid2> */}
                  </Grid2>
                )}
                {tabValue === "5" && (
                  <Grid2 container spacing={4}>
                    <Grid2 size={8} className="flex justify-center">
                      <div className="w-[80%]">
                        <Box>
                          <BackerSection backers={packBackers} />
                        </Box>
                      </div>
                    </Grid2>
                    <Grid2 size={4}>
                      <PackageSide
                        isButtonActive={buttonBackerActive}
                        packageList={projectData.packages}
                        reloadDetail={fetchProject}
                      />
                    </Grid2>
                  </Grid2>
                )}
              </div>
            </div>
          </TabContext>
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
        </>
      )}
    </Box>

    // tab value
  );
};

export default ProjectDetail;
