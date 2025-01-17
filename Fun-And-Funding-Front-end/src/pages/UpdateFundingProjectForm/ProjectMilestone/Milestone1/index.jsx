import { Description, Image, Movie, PictureAsPdf } from '@mui/icons-material';
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Backdrop,
  Box, Button,
  CircularProgress,
  Grid2,
  IconButton,
  Tab,
  Typography
} from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useLocation, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import PackageEvidence from '../../../../components/PackageEvidence';
import Timer from "../../../../components/Timer";
import BackdropRequestMilestone from "../../../../components/UpdateProject/BackdropRequestMilestone";
import MilestoneQuill from "../../../../components/UpdateProject/MilestoneQuill";
import milestoneApiInstace from "../../../../utils/ApiInstance/milestoneApiInstance";
import packageBackerApiInstance from '../../../../utils/ApiInstance/packageBackerApiInstance';
import { checkAvailableMilestone } from "../../../../utils/Hooks/checkAvailableMilestone";
import UpdateMilestone from "../UpdateMilestone";

const Milestone1 = () => {
  const { id } = useParams();
  const projectId = id;
  const location = useLocation();
  const milestoneId = location.state?.milestoneId;
  const [milestone, setMilestone] = useState(null);
  const [formDataArray, setFormDataArray] = useState([]);
  const [milestoneData, setMilestoneData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEls, setAnchorEls] = useState({})
  const [isBackdropHidden, setIsBackdropHidden] = useState(false);
  const [issueLog, setIssueLog] = useState("");
  const [daysLeft, setDaysLeft] = useState(0);
  const [packageBackers, setPackBackers] = useState([]);

  const getFileIcon = (fileType) => {
    const iconStyles = (color) => ({ fontSize: '1.75rem', color });

    switch (fileType) {
      case 'docx':
        return <Description sx={iconStyles('#0078D4')} />;
      case 'pdf':
        return <PictureAsPdf sx={iconStyles('#FF0000')} />;
      case 'jpg': <Image sx={iconStyles('#FFA500')} />;
      case 'jpeg': <Image sx={iconStyles('#FFA500')} />;
      case 'png':
        return <Image sx={iconStyles('#FFA500')} />;
      case 'mp4':
        return <Movie sx={iconStyles('#008000')} />;
      default:
        return <Description sx={iconStyles('#808080')} />;
    }
  };

  //check available project milestone
  const getMilestoneData = async (id) => {
    setIsLoading(true); // Start loading when data fetch begins
    try {
      const data = await checkAvailableMilestone(projectId, id);
      setMilestoneData(data); // Set data after fetching
      console.log(data);
      const start = data.data[0] && new Date(data.data[0].createdDate);
      const end = data.data[0] && new Date(data.data[0].endDate);
      const timeDiff = end - start;
      const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));
      setDaysLeft(dayDiff);
      if (data.status === 'create' || data.status === 'edit' || data.status === 'warning') {
        setIsLoading(false)
      } else {
        setIsBackdropHidden(true)
      }
    } catch (error) {
      console.error('Error fetching milestone data:', error);
    } finally {
      setIsLoading(false); // Stop loading once data fetch is complete
    }
  };

  const fetchFixedMilestone = async () => {
    try {
      const response = await milestoneApiInstace.get(
        `/${milestoneId}?filter=1`
      );
      console.log(response.data);
      if (response.data.result._isSuccess) {
        const milestoneData = response.data.result._data;
        setMilestone(milestoneData);
        // Initialize formDataArray for requirements
        const initialFormData = milestoneData.requirements.map((req) => ({
          requirementId: req.id,
          content: " ", // Initial content
          requirementStatus: 0,
          updateDate: new Date(),
          milestoneId: milestoneData.id,
          fundingProjectId: projectId,
          requirementFiles: [],
        }));
        setFormDataArray(initialFormData);
      }
    } catch (error) {
      console.error("Error fetching milestone:", error);
    }
  };

  const fetchPackageBackers = async (id) => {
    setIsLoading(true);
    await packageBackerApiInstance.get(`/project-backers-detail?projectId=${id}`).then((res) => {
      if (res.data._isSuccess) {
        setPackBackers(res.data._data);
        setIsLoading(false);
      }
    })
  }

  const handleBackdropClose = () => {
    setIsBackdropHidden(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchFixedMilestone(); // Fetch fixed milestone data first
        await getMilestoneData(milestoneId); // Then fetch milestone data
        await fetchPackageBackers(projectId);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [milestoneId]);

  const handleQuillChange = (value, index) => {
    const updatedFormData = [...formDataArray];
    updatedFormData[index].content = value;
    setFormDataArray(updatedFormData);
  };

  const categorizeFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return 6;
    if (mimeType.startsWith("video/")) return 7;
    return 8; // Default to 2 for documents or other types
  };
  //form submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formDataArray);
    const data = new FormData();
    formDataArray.forEach((formData, i) => {
      data.append(`request[${i}].RequirementStatus`, formData.requirementStatus);
      data.append(`request[${i}].UpdateDate`, formData.updateDate.toISOString());
      data.append(`request[${i}].Content`, formData.content || " ");
      data.append(`request[${i}].MilestoneId`, formData.milestoneId);
      data.append(`request[${i}].FundingProjectId`, formData.fundingProjectId);
      data.append(`request[${i}].RequirementId`, formData.requirementId);

      formData.requirementFiles.forEach((file, fileIndex) => {
        data.append(`request[${i}].RequirementFiles[${fileIndex}].URL`, file);
        data.append(`request[${i}].RequirementFiles[${fileIndex}].Name`, file.name);
        data.append(`request[${i}].RequirementFiles[${fileIndex}].Filetype`, categorizeFileType(file.type));
      });
    });
    data.append("issueLog", issueLog);
    try {
      await axios.post(
        "https://localhost:7044/api/project-milestone-requirements",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Swal.fire({
        title: "You have been successfully updated evidence for this milestone",
        text: "Milestone created successfully",
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to submit requirements",
        icon: "error"
      });
    } finally {
      getMilestoneData(milestoneId);
    }
  };

  //resubmit when complete

  //dropdown files
  const [anchorEl, setAnchorEl] = useState(null); // Tracks dropdown state
  const [currentIndex, setCurrentIndex] = useState(null); // Tracks which requirement files are open


  const handleFilesSelected = (selectedFiles, index) => {
    console.log(index);
    const updatedFormData = [...formDataArray];
    updatedFormData[index].requirementFiles = [
      ...updatedFormData[index].requirementFiles,
      ...selectedFiles,
    ];
    setFormDataArray(updatedFormData);
  };

  const openDropdown = (event, index) => {
    setAnchorEls((prev) => ({
      ...prev,
      [index]: event.currentTarget,
    }));
  };

  const closeDropdown = (index) => {
    setAnchorEls((prev) => ({
      ...prev,
      [index]: null,
    }));
  };

  const handleRemoveFile = (fileIndex, requirementIndex) => {
    const updatedFormData = [...formDataArray];
    updatedFormData[requirementIndex].requirementFiles.splice(fileIndex, 1);
    setFormDataArray(updatedFormData);
  };

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className='mr-[6rem] pb-[2rem]'>
      {(isLoading && !milestone || !milestoneData) ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true} // Force the Backdrop to open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : <>
        {milestoneData && milestone && !isLoading && milestone.milestoneType == 1
          && <BackdropRequestMilestone
            isHidden={isBackdropHidden}
            projectId={projectId}
            milestone={milestone}
            status={milestoneData.status}
            onCloseBackdrop={handleBackdropClose}
            render={() => getMilestoneData(milestoneId)} />}

        <div className='basic-info-section'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '2rem' }}>
            <Box>
              <Typography
                sx={{
                  color: '#2F3645',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  userSelect: 'none',
                  marginBottom: '1rem'
                }}
              >
                {milestone.milestoneName} <span className='text-[#1BAA64]'>*</span>
              </Typography>
              <Typography
                sx={{
                  color: '#2F3645',
                  fontSize: '1rem',
                  fontWeight: '400',
                  userSelect: 'none',
                }}
              >
                {milestone.description}
              </Typography>
            </Box>
            <Box>
              <Timer days={daysLeft} />
            </Box>
          </Box>

          {!isLoading && (milestoneData && milestoneData.status == 'create')
            ? (
              <form onSubmit={handleSubmit}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} TabIndicatorProps={{
                      style: {
                        backgroundColor: "var(--primary-green)",
                      },
                    }}>
                      <Tab
                        label="Requirements"
                        value="1"
                        sx={{
                          "&.Mui-selected": {
                            color: "var(--primary-green)",
                            fontWeight: "bold",
                          },
                          textTransform: 'none !important'
                        }}
                      />
                      <Tab
                        label="Issue Logs"
                        value="2"
                        sx={{
                          "&.Mui-selected": {
                            color: "var(--primary-green)",
                            fontWeight: "bold",
                          },
                          textTransform: 'none !important'
                        }}
                      />
                      {milestone.milestoneOrder == 4 && (
                        <Tab
                          label="Reward Tracking"
                          value="3"
                          sx={{
                            "&.Mui-selected": {
                              color: "var(--primary-green)",
                              fontWeight: "bold",
                            },
                            textTransform: 'none !important'
                          }}
                        />
                      )}
                    </TabList>
                  </Box>
                  <TabPanel value="1" sx={{ padding: 0, mt: '2rem' }}>
                    {milestone.requirements.map((req, index) => (
                      <div key={req.id} style={{ marginBottom: index < milestone.requirements.length - 1 ? "4rem" : "2rem" }}>
                        <Grid2 container columnSpacing={6}>
                          <Grid2 size={8.4} sx={{ height: '100%' }}>
                            <Typography style={{ fontWeight: '500', fontSize: '1rem', marginBottom: '1.5rem' }}>{req.description}</Typography>
                            <div>
                              <>
                                <div>
                                  <MilestoneQuill
                                    value={formDataArray[index]?.content || " "}
                                    onChange={(value) => handleQuillChange(value, index)}
                                  />
                                </div>
                              </>
                            </div>
                          </Grid2>
                          <Grid2 size={3.6} sx={{ maxHeight: '100%' }}>
                            <Typography style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Requirement Files</Typography>
                            {formDataArray[index].requirementFiles.length > 0 ?
                              <div
                                className='max-h-[100%]'
                                style={{
                                  height: '23rem',
                                  overflowY: 'auto',
                                  scrollbarWidth: 'none',
                                  msOverflowStyle: 'none',
                                }}
                              >
                                {formDataArray[index].requirementFiles.map((item, fileIndex) =>
                                  <div
                                    className="flex flex-row justify-between items-center rounded-[0.5rem] p-[1rem] mb-[1rem]"
                                    style={{ border: '2px solid var(--primary-green)', overflow: 'hidden' }}
                                  >
                                    <div>
                                      {getFileIcon(item.type.split('/')[1])}
                                    </div>
                                    <a
                                      href={URL.createObjectURL(item)}
                                      download={item.name}
                                      style={{ textDecoration: 'none' }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: '0.875rem',
                                          fontWeight: '600',
                                          width: '8rem',
                                          color: 'var(--primary-green)',
                                          whiteSpace: 'normal',
                                          ':hover': {
                                            textDecoration: 'underline',
                                            transition: 'all 0.3s ease-in-out'
                                          },
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                        }}
                                      >
                                        {item.name}
                                      </Typography>
                                    </a>
                                    <IconButton
                                      aria-label="delete"
                                      onClick={() => handleRemoveFile(fileIndex, index)}
                                      sx={{
                                        flexShrink: 0,
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </div>
                                )}
                                <Button
                                  variant="contained"
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--grey)',
                                    color: 'var(--white)',
                                    borderRadius: '0.5rem',
                                    textTransform: 'none',
                                    width: '100%',
                                    mb: '1rem',
                                    overflowX: 'visible'
                                  }}
                                  onClick={() => document.getElementById(`fileInput-${index}`).click()}
                                >
                                  <FileUploadIcon sx={{ fontSize: '1.5rem' }} />
                                  <Typography sx={{ fontSize: '1rem', fontWeight: '600' }}>
                                    Upload more files
                                  </Typography>
                                </Button>
                              </div> : <label
                                className="flex flex-col items-center justify-center w-full h-fit border-2 border-[#2F3645] border-dashed rounded-lg cursor-pointer bg-[#EAEAEA]"
                                onClick={() => document.getElementById(`fileInput-${index}`).click()}
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <svg
                                    className="w-8 h-8 mb-4 text-gray-500"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                  </svg>
                                  <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload file</p>
                                  <p className="text-xs text-gray-500">
                                    docx, exe, pdf, etc. (max. 500mb)
                                  </p>
                                </div>
                              </label>}
                            <input
                              type="file"
                              id={`fileInput-${index}`}
                              multiple
                              hidden
                              onChange={(e) => handleFilesSelected(Array.from(e.target.files), index)}
                            />
                          </Grid2>
                        </Grid2>
                      </div>
                    ))}
                  </TabPanel>
                  <TabPanel value="2" sx={{ padding: 0, mt: '2rem', mb: '2rem' }}>
                    <MilestoneQuill
                      value={issueLog || ""}
                      onChange={(value) => setIssueLog(value)}
                    />
                  </TabPanel>
                  <TabPanel value="3" sx={{ padding: 0, mt: '2rem', mb: '2rem' }}>
                    <PackageEvidence backers={packageBackers} />
                  </TabPanel>
                </TabContext>
                <Button ype="submit" variant="contained" color="primary" sx={{
                  backgroundColor: '#1BAA64'
                  , textTransform: 'none', fontWeight: '600', width: '100px'
                }} type="submit">
                  Save
                </Button >
              </form>
            ) : <UpdateMilestone render={() => getMilestoneData(milestoneId)}
              backers={packageBackers}
              type={milestone.milestoneType}
              milestones={milestoneData?.data[0]?.projectMilestoneRequirements}
              issueLog={milestoneData?.data[0]?.issueLog} pmId={milestoneData?.data[0]?.id}
              status={milestoneData?.status} order={milestone.milestoneOrder} />}
        </div>
      </>}
    </div>
  );
};

export default Milestone1;