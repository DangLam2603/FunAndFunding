import { ArrowRightAlt, HelpOutline } from "@mui/icons-material"
import { Box, Divider, Grid2, Modal, Step, StepLabel, Stepper, Tab, Tabs, Typography } from "@mui/material"
// import projectMilestoneApiInstace from "../../../../utils/ApiInstance/projectMilestoneApiInstance"
import projectMilestoneApiInstace from "../../../utils/ApiInstance/projectMilestoneApiInstance"
import { useEffect, useState } from "react"
import QRCodeModal from "./QRCodeModal"
import PMRequirementModal from "./PMRequirementModal"
import ProjectMilestoneReviewList from "../../../components/ProjectMilestoneBacker/ProjectMilestoneReviewList"
import ProjectMilestoneReviewForm from "../../../components/ProjectMilestoneBacker/ProjectMilestoneReviewForm"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import projectMilestoneBackerApiInstance from "../../../utils/ApiInstance/projectMilestoneBackerApiInstance"
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils"
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useLoading } from "../../../contexts/LoadingContext"
import commissionApiInstance from "../../../utils/ApiInstance/commisionApiInstance"
import milestoneApiInstace from "../../../utils/ApiInstance/milestoneApiInstance"

const ProjectMilestoneModal = ({ pmData, openModal, setOpenModal }) => {

  const handleClose = () => {
    setOpenModal(false)
  }

  const [openQRCode, setOpenQRCode] = useState(false)
  const [openPMRequirement, setOpenPMRequirement] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const [selectedPMR, setSelectedPMR] = useState(null)

  const handleOpenPMR = (pmr) => {
    setSelectedPMR(pmr)
    setOpenPMRequirement(true)
  }

  const statusString = ['Deleted',
    'Pending',
    'Processing',
    'FundedSuccessful',
    'Successful',
    'Failed',
    'Rejected',
    'Approved',
    'Withdrawed',
    'Refunded',
    'Reported']

  const pmrStatusString = [
    'ToDo',
    'Doing',
    'Done',
    'Warning',
    'Failed'
  ]

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


  const [isQualified, setIsQualified] = useState()

  const token = Cookies.get("_auth")
  const decoded = jwtDecode(token)
  const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]


  useEffect(() => {
    const handleCheckQualification = async () => {
      try {
        const response = await projectMilestoneBackerApiInstance.get("/CheckIfQualifiedForReview",
          {
            params: {
              projectMilestoneId: pmData?.id,
              userId: userId,
            },
          }
        );
        setIsQualified(response.data._data)
      } catch (err) {
        console.log("Error occurred during qualification check:", err);
        console.log(
          err.response?.data?.message || "An error occurred while checking qualification."
        );
      }
    };

    handleCheckQualification()
  }, [pmData, userId, setOpenModal])


  const milestones = [
    'Milestone 1',
    'Milestone 2',
    'Milestone 3',
  ];

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
      <Modal
        open={openModal}
        onClose={handleClose}
      >
        <div className="flex justify-center items-center w-full h-full scrollbar-hidden">
          <div className="relative p-4 w-full max-w-[60%] max-h-full overflow-auto flex scrollbar-hidden flex-col">
            <div className="relative bg-gray-100 rounded-lg shadow min-h-[100vh] pb-[7rem] overflow-auto scrollbar-hidden flex-grow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-primary-green">
                <h3 className="text-xl font-semibold text-white flex uppercase">
                  Project milestone
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="end-2.5 bg-transparent text-white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    className="w-3 h-3"
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
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 md:p-5 flex-grow overflow-auto">
                {/* Stepper and Tabs */}
                {/* <Stepper activeStep={pmData?.latestMilestone.milestoneOrder - 1}
                  alternativeLabel>
                  {latestMilestone?.map((milestone) => (
                    <Step key={milestone}>
                      <StepLabel
                        sx={{
                          "& .MuiStepIcon-root.Mui-active": {
                            color: 'var(--primary-green) !important',
                          },
                          '& .MuiStepIcon-root.Mui-completed': {
                            color: "var(--primary-green) !important",
                          },
                        }}
                      >
                        <span className={`${(milestone.milestoneOrder == pmData?.milestone.milestoneOrder) ? 'bg-primary-green/80 text-white py-0.5 px-1 rounded' : ''}`}>
                          {milestone.milestoneName}

                        </span>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper> */}

                <div className="">
                  {
                    (pmData?.milestone.milestoneOrder != 1 && pmData?.milestone.milestoneOrder != 2)
                      ? (
                        <div className="relative overflow-x-auto sm:rounded-lg mt-[1rem] shadow-md">
                          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
                              Milestone request
                            </caption>
                            <thead className="text-xs text-gray-700 uppercase">
                              <tr>
                                <th scope="col" className="px-6 py-3 bg-gray-50">
                                  Information
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">
                                  (1) {pmData?.milestone.milestoneName} disbursement percentage
                                </th>
                                <td className="px-6 py-4">
                                  {pmData?.milestone.disbursementPercentage * 100}%
                                </td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50">
                                  (2) Total fund
                                </th>
                                <td className="px-6 py-4">
                                  {pmData?.fundingProject.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
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
                              <tr className="border-b border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 flex items-center gap-2">
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
                                <td className="px-6 py-4 font-bold text-black text-lg">
                                  {(pmData?.milestone.disbursementPercentage * pmData?.fundingProject.balance * 0.5 * 0.95).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )
                      : ('')
                  }


                </div>

                <div>
                  <div className="flex justify-center">
                    <Divider sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.7)', my: '1rem', width: '60%', textAlign: 'center' }}>Milestone Evidence</Divider>
                  </div>
                  <div class="relative overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" class="px-6 py-3">
                            Requirement
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
                        {pmData?.projectMilestoneRequirements.map((pmr, index) => (
                          <tr class="bg-white border-b">
                            <td scope="row" class="px-6 py-4 font-medium text-gray-900">
                              <div className="">
                                <span className="py-.5">
                                  {pmr.requirementTitle}
                                </span>
                              </div>
                              <div className="font-normal italic">
                                {pmr.reqDescription}
                              </div>
                            </td>
                            <td class="px-6 py-4">
                              <span className="text-xs text-right text-gray-600 italic font-semibold">{new Date(pmr.updateDate).toLocaleString()}</span>
                            </td>
                            <td class="px-6 py-4">
                              <span className="bg-blue-200 text-blue-800 px-2 py-.5 ml-2 rounded font-semibold">
                                {pmrStatusString[pmr.requirementStatus]}
                              </span>
                            </td>
                            <td class="px-6 py-4">
                              <a href="#"
                                onClick={() => handleOpenPMR(pmr)}
                                class="font-medium text-blue-600 hover:underline">View</a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <PMRequirementModal pmrData={selectedPMR} openPMRequirement={openPMRequirement} setOpenPMRequirement={setOpenPMRequirement} />
                </div>

              </div>

              {/* Modal Footer
              <div className="absolute bottom-0 w-[100%]">
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                  {pmData ? renderStatusButton(pmData, handleProcess, handleApprove, handleWarn, handleFail) : ''}
                </div>
              </div> */}
            </div>
          </div>


          <div className="relative p-4 w-full max-w-[30%] max-h-full overflow-auto scrollbar-hidden flex flex-col ">
            <div className="relative rounded-lg shadow min-h-[100vh] pb-[7rem] overflow-auto scrollbar-hidden flex-grow bg-gray-200">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-primary-green">
                <h3 className="text-xl font-semibold text-white flex uppercase">
                  Backer reviews
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="end-2.5 bg-transparent text-white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    className="w-3 h-3"
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
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="py-5 px-3 ">
                {
                  pmData &&
                  (
                    <div>
                      {isQualified && (
                        <ProjectMilestoneReviewForm pmId={pmData.id} setOpenModal={setOpenModal} />
                      )}
                      <ProjectMilestoneReviewList pmId={pmData.id} />
                    </div>

                  )
                }

              </div>
            </div>
          </div>


        </div>
      </Modal>
    </>
  );

}

export default ProjectMilestoneModal