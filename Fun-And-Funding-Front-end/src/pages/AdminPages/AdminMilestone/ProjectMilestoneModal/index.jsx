import { ArrowDropUp, ArrowRight, ArrowRightAlt, HelpOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid2,
  Modal,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import projectMilestoneApiInstace from "../../../../utils/ApiInstance/projectMilestoneApiInstance";
import { useEffect, useState } from "react";
import QRCodeModal from "./QRCodeModal";
import PMRequirementModal from "./PMRequirementModal";
import { styled } from '@mui/material/styles';
import WarnModal from "./WarnModal";
import ProjectMilestoneReviewList from "../../../../components/ProjectMilestoneBacker/ProjectMilestoneReviewList";
import { toast, ToastContainer } from "react-toastify";
import { useLoading } from "../../../../contexts/LoadingContext";
import commissionApiInstance from "../../../../utils/ApiInstance/commisionApiInstance";
import milestoneApiInstace from "../../../../utils/ApiInstance/milestoneApiInstance";


const notify = (message, type) => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
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

const ProjectMilestoneModal = ({ pmData, openModal, setOpenModal, setTriggerReload, triggerReload }) => {
  const handleClose = () => {
    setOpenModal(false);
  };

  const [openQRCode, setOpenQRCode] = useState(false);
  const [openPMRequirement, setOpenPMRequirement] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [selectedPMR, setSelectedPMR] = useState(null);
  const [openWarn, setOpenWarn] = useState(false)
  const [newEndDate, setNewEndDate] = useState()

  const handleOpenWarn = () => {
    setOpenWarn(true)
  }

  const handleOpenPMR = (pmr) => {
    setSelectedPMR(pmr);
    setOpenPMRequirement(true);
  };

  const statusString = [
    "Deleted",
    "Pending",
    "Processing",
    "FundedSuccessful",
    "Successful",
    "Failed",
    "Rejected",
    "Approved",
    "Withdrawed",
    "Refunded",
    "Reported",
  ];

  const pmrStatusString = ["ToDo", "Doing", "Done", "Warning", "Failed"];

  const [commissionFee, setCommissionFee] = useState(null);
  const [latestMilestone, setLatestMilestone] = useState(null);
  const { isLoading, setIsLoading } = useLoading()

  useEffect(() => {
    const fetchCommissionFee = async () => {
      setIsLoading(true);
      try {
        const type = 0; // funding fee
        const response = await commissionApiInstance.get("/latest-commission-fee", {
          params: { type },
        });
        setCommissionFee(response.data._data.rate);
        // console.log(response.data._data)
      } catch (err) {
        console.error("Error fetching latest commission fee:", err);
      }
    };

    const fetchLatestMilestone = async () => {
      try {
        const response = await milestoneApiInstace.get("/group-latest-milestone", {
          params: { status: true },
        });
        const milestones = response.data._data;
        // setLatestMilestone(milestones.map((m) => m.milestoneName));
        setLatestMilestone(response.data._data);
        console.log(latestMilestone)
      } catch (err) {
        console.error("Error fetching latest milestone:", err);
      }
    };

    const fetchData = async () => {
      await fetchCommissionFee();
      await fetchLatestMilestone();
      setIsLoading(false);
    };

    fetchData();
  }, [setIsLoading]);

  const handleApprove = async () => {
    try {
      const response = await projectMilestoneApiInstace.put("/", {
        ProjectMilestoneId: pmData?.id,
        Status: 2,
      });
      if (response.data._isSuccess) {
        toast.success("Milestone approved!");
      }

    } catch (error) {
      console.error("Error approving milestone:", error);
    } finally {
      setTriggerReload(!triggerReload)
      handleClose();
    }
  };

  const handleWarn = async () => {
    try {
      const response = await projectMilestoneApiInstace.put("/", {
        ProjectMilestoneId: pmData?.id,
        Status: 3,
        NewEndDate: newEndDate
      });
      toast.success("Milestone warned!");
    } catch (error) {
      console.error("Error warning milestone:", error);
    } finally {
      setTriggerReload(!triggerReload)
      handleClose();
    }
  };


  const handleProcess = async () => {
    try {
      const response = await projectMilestoneApiInstace.put("/", {
        ProjectMilestoneId: pmData?.id,
        Status: 1,
      });
      if (response.status == 200)
        notify(response.data._data, "success");
    } catch (error) {
      toast.warn(error.response.data.message);
      console.error("Error processing milestone:", error);
    } finally {
      setTriggerReload(!triggerReload)
      handleClose();
    }
  };

  const handleFail = async () => {
    try {
      const response = await projectMilestoneApiInstace.put("/", {
        ProjectMilestoneId: pmData?.id,
        Status: 4,
      });
      toast.success("Milestone rejected!");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setTriggerReload(!triggerReload)
      handleClose();
    }
  };

  const formatNumber = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  function renderStatusButton(
    pmData,
    handleProcess,
    handleApprove,
    handleWarn,
    handleFail,
    setOpenWarn
  ) {
    if (pmData?.status == null) return null;

    switch (pmData.status) {
      case 0: // Pending
        return (
          <button
            onClick={handleProcess}
            className="text-white bg-gradient-to-r from-primary-green/70 via-primary-green/80 to-primary-green hover:bg-gradient-to-br font-medium rounded-md text-sm px-5 py-2 text-center me-2 mb-2"
          >
            Change to processing
          </button>
        );
      case 1:
        return (
          <div>
            {/* <button
              onClick={handleProcess}
              className="text-white bg-gradient-to-r from-primary-green/70 via-primary-green/80 to-primary-green hover:bg-gradient-to-br font-medium rounded-md text-sm px-5 py-2 text-center me-2 mb-2">
              Process
            </button> */}
            Game owner is working on milestone evidence
          </div>
        )
      case 2:
        return (
          <div>
            This milestone is completed
          </div>
        )
      case 4: // failed
        return (
          <div>
            This milestone is failed
          </div>
        )
      case 5: // Submitted
        return (
          <div>
            <button
              onClick={handleApprove}
              className="text-white bg-gradient-to-r from-primary-green/70 via-primary-green/80 to-primary-green hover:bg-gradient-to-br font-medium rounded-md text-sm px-5 py-2 text-center me-2 mb-2"
            >
              Approve project milestone
            </button>
            <button
              // onClick={handleWarn}
              onClick={handleOpenWarn}
              className="text-white bg-red-500 hover:bg-gradient-to-br font-medium rounded-md text-sm px-5 py-2 text-center me-2 mb-2"
            >
              Warn this project milestone
            </button>
          </div>
        );

      case 6: // resubmitted
        return (
          <div>
            <button
              onClick={handleApprove}
              className="text-white bg-gradient-to-r from-primary-green/70 via-primary-green/80 to-primary-green hover:bg-gradient-to-br font-medium rounded-md text-sm px-5 py-2 text-center me-2 mb-2"
            >
              Approve project milestone
            </button>
            <button
              onClick={handleFail}
              className="text-white bg-red-500 hover:bg-gradient-to-br font-medium rounded-md text-sm px-5 py-2 text-center me-2 mb-2"
            >
              Fail project milestone
            </button>
          </div>
        );

      case 3: // Warning
        return (
          <div>
            {/* <button
              onClick={handleApprove}
              className="text-white bg-gradient-to-r from-primary-green/70 via-primary-green/80 to-primary-green hover:bg-gradient-to-br font-medium rounded-md text-sm px-5 py-2 text-center me-2 mb-2"
            >
              Approve project milestone
            </button>
            <button
              onClick={handleFail}
              className="text-white bg-red-500 hover:bg-gradient-to-br font-medium rounded-md text-sm px-5 py-2 text-center me-2 mb-2"
            >
              Fail project milestone
            </button> */}
            Game owner is working on milestone evidence
          </div>
        );

      // Optionally, you can add a default case for any unknown status or error handling
      default:
        return null;
    }
  }

  // const milestones = [
  //   "Milestone 1",
  //   "Milestone 2",
  //   "Milestone 3",
  // ];

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));


  return (
    <>
      <ToastContainer />
      <Modal open={openModal} onClose={handleClose}>
        <div className="flex justify-center items-center w-full h-full">
          <div class="relative p-4 w-full max-w-[55%] max-h-full overflow-auto scrollbar-hidden">
            <div class="relative bg-gray-100 rounded-md shadow min-h-[100%]">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-primary-green">
                <h3 class="text-xl font-semibold text-white flex uppercase">
                  Funding withdraw request
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  class="end-2.5 text-gray-400 bg-transparent text-white hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>

              <div class="p-4 md:p-5 h-[35rem] overflow-y-auto scrollbar-hidden">
                <Stepper
                  activeStep={pmData?.latestMilestone?.milestoneOrder - 1}
                  alternativeLabel
                >
                  {latestMilestone?.map((milestone) => (
                    <Step key={milestone}>
                      <StepLabel
                        sx={{
                          "& .MuiStepIcon-root.Mui-active": {
                            color: 'var(--primary-green) !important',
                          },
                          "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed": {
                            color: 'var(--primary-green) !important',
                          },
                          '& .MuiStepIcon-root.Mui-completed': {
                            color: "var(--primary-green) !important",
                          },
                        }}
                      >
                        <span className={`${(milestone.milestoneOrder == pmData?.milestone.milestoneOrder) ? 'bg-primary-green text-white py-0.5 px-1 rounded' : ''}`}>
                          {milestone.milestoneName}

                        </span>

                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box
                  sx={{ borderBottom: 1, borderColor: "divider", my: "1.5rem" }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab value={0} label="Overview" />
                    <Tab value={1} label="Project evidence" />
                    <Tab value={2} label="Reviews" />
                  </Tabs>
                </Box>

                {
                  activeTab === 0
                    ? (
                      <div>
                        <div className="flex justify-center items-center gap-5 my-2 bg-white rounded overflow-hidden shadow">
                          <div className="w-[50%] h-[14rem] overflow-hidden flex justify-center items-center">
                            <img class=" w-[100%] object-cover transition-transform hover:scale-75" alt="Funding project image" src={pmData?.fundingProject.fundingFiles.find((e) => e.filetype == 2)?.url} />
                          </div>
                          <div className="w-[50%] h-[14rem] py-2">
                            <div className="text-primary-green items-center">
                              {statusString[pmData?.fundingProject.status]}

                            </div>
                            <div className="text-2xl font-bold">
                              {pmData?.fundingProject.name}
                            </div>
                            <div className="text-xs text-gray-700 line-clamp-2 mb-1">
                              {pmData?.fundingProject.description}
                            </div>
                            <div className="text-sm font-light text-gray-500 mb-1">
                              by <span className="italic font-semibold">{pmData?.fundingProject.user.email}</span>
                            </div>
                            <div className="text-sm mb-2.5">
                              Fund raised: <span className="font-semibold">{formatNumber(pmData?.fundingProject.balance)}/{formatNumber(pmData?.fundingProject.target)} đ</span>
                            </div>
                            <button
                              onClick={() => { window.location.href = `/funding-detail/${pmData?.fundingProject.id}` }}
                              className="text-white bg-gradient-to-r text-xs from-primary-green/70 via-primary-green/80 to-primary-green hover:bg-gradient-to-br font-medium rounded-md px-3 text-center me-2 mb-2">
                              Go to project <ArrowRightAlt />
                            </button>
                          </div>
                        </div>

                        <div class="relative overflow-x-auto sm:rounded-md mt-[1rem] shadow">
                          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                            <caption class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
                              Milestone request
                            </caption>
                            <thead class="text-xs text-gray-700 uppercase">
                              <tr>
                                <th scope="col" class="px-6 py-3 bg-gray-50">
                                  Information
                                </th>
                                <th scope="col" class="px-6 py-3">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr class="border-b border-gray-200">
                                <th
                                  scope="row"
                                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50"
                                >
                                  (1) {pmData?.milestone.milestoneName} disbursement percentage
                                </th>
                                <td class="px-6 py-4">
                                  {pmData?.milestone.disbursementPercentage * 100}%
                                </td>
                              </tr>
                              <tr class="border-b border-gray-200">
                                <th
                                  scope="row"
                                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50"
                                >
                                  (2) Total fund
                                </th>
                                <td class="px-6 py-4">
                                  {pmData?.fundingProject.balance
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                  đ
                                </td>
                              </tr>
                              <tr class="border-b border-gray-200">
                                <th
                                  scope="row"
                                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50"
                                >
                                  (3) Actual received amount (100% - <span className="font-semibold"><u>{commissionFee * 100}%</u></span>){' '}
                                  <HtmlTooltip
                                    title={
                                      <>
                                        <em className="text-md">{"Funding commission fee: "}</em> <b className="text-md">{'5%'}</b>
                                      </>
                                    }
                                  >
                                    <div className="inline">
                                      <HelpOutline sx={{ fontSize: '1rem' }} />
                                    </div>
                                  </HtmlTooltip>
                                </th>
                                <td class="px-6 py-4">
                                  {(1 - commissionFee) * 100}%
                                </td>
                              </tr>
                              <tr class="border-b border-gray-200">
                                <th
                                  scope="row"
                                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 flex items-center gap-2"
                                >
                                  Milestone requested amount = (1) x (2) x (3) x <u>50%</u>
                                  <HtmlTooltip
                                    title={
                                      <>
                                        <Typography color="inherit">Disbursement policy</Typography>
                                        <em>{"Game owner shall firstly receive"}</em> <b>{'half'}</b>
                                        <em>{" of the milestone fund"}</em> <b>{'for production'}</b> <em>{"and"}</em> <b>{'the remaining'}</b>
                                        <em>{" after having provided sufficient evidences of production"}</em>
                                      </>
                                    }
                                  >
                                    <div>
                                      <HelpOutline sx={{ fontSize: '1rem' }} />
                                    </div>
                                  </HtmlTooltip>
                                </th>
                                <td class="px-6 py-4 font-bold text-black text-lg">
                                  {(
                                    pmData?.milestone.disbursementPercentage *
                                    pmData?.fundingProject.balance * 0.5 * 0.95
                                  )
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                  đ
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-end mt-3">
                          {
                            pmData?.status == 0 || pmData?.status == 5 || pmData?.status == 6
                              ? (
                                <button
                                  type="button"
                                  onClick={() => setOpenQRCode(true)}
                                  class="text-white bg-primary-green font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2 "
                                >
                                  {
                                    pmData?.status == 0
                                      ? ('Transfer Initial Fund')
                                      : ('Transfer Remaining Fund')
                                  }
                                </button>
                              )
                              : ('')
                          }

                        </div>
                        {pmData && (
                          <QRCodeModal
                            openQRCode={openQRCode}
                            setOpenQRCode={setOpenQRCode}
                            pmData={pmData}
                          />
                        )}
                        <WarnModal openWarn={openWarn} setOpenWarn={setOpenWarn} pmData={pmData} newEndDate={newEndDate} setNewEndDate={setNewEndDate} handleWarn={handleWarn} />

                      </div>
                    ) :
                    activeTab === 1
                      ?
                      (
                        < div >
                          {/* <div className="flex justify-center">
                          <Divider sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.7)', my: '1rem', width: '60%', textAlign: 'center' }}>Milestone evidence</Divider>
                        </div> */}
                          <div div class="relative overflow-x-auto rounded overflow-hidden">
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                              <caption class="px-5 py-3 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
                                {/* Project milestone requirement */}
                                <p class="mt-1 text-sm font-normal text-gray-500">
                                  At each milestone, game owners must fulfill the
                                  corresponding requirements before they can withdraw
                                  the funds raised.
                                </p>
                              </caption>
                              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                  <th scope="col" class="px-6 py-3">
                                    Milestone Requirement
                                  </th>
                                  <th scope="col" class="px-6 py-3">
                                    Last update
                                  </th>
                                  <th scope="col" class="px-6 py-3">
                                    Status
                                  </th>
                                  <th scope="col" class="px-6 py-3">
                                    {/* Action */}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {pmData?.projectMilestoneRequirements.map(
                                  (pmr, index) => (
                                    <tr class="bg-white border-b">
                                      <td
                                        scope="row"
                                        class="px-6 py-4 font-medium w-[35%] text-gray-900"
                                      >
                                        <div className="">
                                          <span className="py-.5">
                                            {pmr.requirementTitle}
                                          </span>
                                        </div>
                                        <div className="font-normal text-xs italic">
                                          {pmr.reqDescription}
                                        </div>
                                      </td>
                                      <td class="px-6 py-4">
                                        <span className="text-xs text-right text-gray-600 font-semibold">
                                          {new Date(pmr.updateDate).toLocaleString()}
                                        </span>
                                      </td>
                                      <td class="px-6 py-4">
                                        <span className="bg-blue-200 text-blue-800 px-2 py-.5 ml-2 rounded font-semibold">
                                          {pmrStatusString[pmr.requirementStatus]}
                                        </span>
                                      </td>
                                      <td class="px-6 py-4">
                                        <a
                                          href="#"
                                          onClick={() => handleOpenPMR(pmr)}
                                          class="font-medium text-blue-600 hover:underline"
                                        >
                                          View
                                        </a>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          <PMRequirementModal
                            pmrData={selectedPMR}
                            openPMRequirement={openPMRequirement}
                            setOpenPMRequirement={setOpenPMRequirement}
                          />
                        </div>
                      )
                      :
                      (
                        <ProjectMilestoneReviewList pmId={pmData?.id} />
                      )
                }
              </div>
              <div className="w-[100%] bg-gray-200 rounded-b">
                <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b font-semibold">
                  {pmData
                    ? renderStatusButton(
                      pmData,
                      handleProcess,
                      handleApprove,
                      handleWarn,
                      handleFail,
                      handleOpenWarn
                    )
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div >
      </Modal >
    </>
  );
};

export default ProjectMilestoneModal;
