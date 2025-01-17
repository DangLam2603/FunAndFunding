import { Description, FolderZip, Image, Movie, PictureAsPdf, Terminal } from '@mui/icons-material';
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Backdrop, Box, Button, CircularProgress, Divider, Grid2, IconButton, Tab, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import PackageEvidence from "../../../../components/PackageEvidence";
import CompleteMilestoneButton from "../../../../components/UpdateProject/CompleteMilestoneButton";
import MilestoneQuill from "../../../../components/UpdateProject/MilestoneQuill";

const UpdateMilestone = ({ milestones, render, issueLog, pmId, status, order, type, backers }) => {
  const [milestoneData, setMilestoneData] = useState([]);
  const [anchorEls, setAnchorEls] = useState({});
  const [loading, setLoading] = useState(false);
  const [issueLogData, setIssueLogData] = useState(issueLog || "");

  const getFileIcon = (fileType) => {
    const iconStyles = (color) => ({ fontSize: '1.75rem', color });

    switch (fileType.toLowerCase()) {
      case 'docx':
        return <Description sx={iconStyles('#0078D4')} />;
      case 'pdf':
        return <PictureAsPdf sx={iconStyles('#FF0000')} />;
      case 'jpg':
        return <Image sx={iconStyles('#FFA500')} />;
      case 'jpeg':
        return <Image sx={iconStyles('#FFA500')} />;
      case 'png':
        return <Image sx={iconStyles('#FFA500')} />;
      case 'mp4':
        return <Movie sx={iconStyles('#008000')} />;
      case 'zip':
        return <FolderZip sx={iconStyles('#FFD700')} />;
      case 'exe':
        return <Terminal sx={iconStyles('#800080')} />;
      default:
        return <Description sx={iconStyles('#808080')} />;
    }
  };


  useEffect(() => {
    if (milestones && milestones.length > 0) {
      // Initialize milestone data if milestones are available
      const initialData = milestones.map((milestone) => ({
        id: milestone.id,
        updateDate: new Date().toISOString(),
        content: milestone.content || "",
        requirementStatus: milestone.requirementStatus || 0,
        requirementFiles: milestone.requirementFiles || [],
        addedFiles: [],
      }));
      setMilestoneData(initialData);
      setLoading(false); // Data is loaded, stop loading
    } else if (milestones && milestones.length === 0) {
      setLoading(false); // No milestones found, stop loading
    }
  }, [milestones]);

  const handleQuillChange = (value, index) => {
    const updatedMilestones = [...milestoneData];
    updatedMilestones[index].content = value;
    setMilestoneData(updatedMilestones);
  };

  const handleFilesSelected = (selectedFiles, index) => {
    const updatedMilestones = [...milestoneData];
    updatedMilestones[index].addedFiles.push(...selectedFiles);
    setMilestoneData(updatedMilestones);
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

  const handleRemoveFile = (fileIndex, milestoneIndex, fileSource) => {
    const updatedMilestones = [...milestoneData];
    if (fileSource === "addedFiles") {
      updatedMilestones[milestoneIndex].addedFiles.splice(fileIndex, 1);
    } else if (fileSource === "requirementFiles") {
      updatedMilestones[milestoneIndex].requirementFiles[fileIndex].IsDeleted = true;
    }
    setMilestoneData(updatedMilestones);
  };

  const categorizeFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return 6;
    if (mimeType.startsWith("video/")) return 7;
    return 8; // Default to 2 for documents or other types
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    milestoneData.forEach((milestone, i) => {
      data.append(`request[${i}].Id`, milestone.id);
      data.append(`request[${i}].RequirementStatus`, milestone.requirementStatus);
      data.append(`request[${i}].UpdateDate`, milestone.updateDate);
      data.append(`request[${i}].Content`, milestone.content || "");
      milestone.requirementFiles.forEach((file, fileIndex) => {
        data.append(`request[${i}].RequirementFiles[${fileIndex}].Id`, file.id);
        data.append(`request[${i}].RequirementFiles[${fileIndex}].URL`, file.url);
        data.append(`request[${i}].RequirementFiles[${fileIndex}].Name`, file.name);
      });
      milestone.addedFiles.forEach((file, fileIndex) => {
        data.append(`request[${i}].AddedFiles[${fileIndex}].URL`, file);
        data.append(`request[${i}].AddedFiles[${fileIndex}].Name`, file.name);
        data.append(`request[${i}].AddedFiles[${fileIndex}].Filetype`, categorizeFileType(file.type));
      });
    });
    data.append("issueLog", issueLogData);
    // data.append("type", type);
    console.log(milestoneData);

    try {
      await axios.put("https://localhost:7044/api/project-milestone-requirements", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        title: `Milestone updated successfully`,
        icon: "success"
      });
    } catch (error) {
      console.log(error)
      toast.warn(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
      render();
    }
  };
  console.log(milestoneData)

  const handleCompleteSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    milestoneData.forEach((milestone, i) => {
      data.append(`request[${i}].Id`, milestone.id);
      data.append(`request[${i}].RequirementStatus`, milestone.requirementStatus);
      data.append(`request[${i}].UpdateDate`, milestone.updateDate);
      data.append(`request[${i}].Content`, milestone.content || " ");
      milestone.requirementFiles.forEach((file, fileIndex) => {
        data.append(`request[${i}].RequirementFiles[${fileIndex}].Id`, file.id);
        data.append(`request[${i}].RequirementFiles[${fileIndex}].URL`, file.url);
        data.append(`request[${i}].RequirementFiles[${fileIndex}].Name`, file.name);
      });
      milestone.addedFiles.forEach((file, fileIndex) => {
        // console.log(categorizeFileType(file.type));
        data.append(`request[${i}].AddedFiles[${fileIndex}].URL`, file);
        data.append(`request[${i}].AddedFiles[${fileIndex}].Name`, file.name);
        data.append(`request[${i}].AddedFiles[${fileIndex}].Filetype`, categorizeFileType(file.type));
      });
    });
    data.append("issueLog", issueLogData);
    console.log(milestoneData);

    try {
      await axios.put("https://localhost:7044/api/project-milestone-requirements", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(data);
    } catch (error) {
      // toast.warn("Please fill in all the required fields.");
    } finally {
      setLoading(false);
      render();
    }
  };
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {type == 1 && (
        <Box sx={{}}>
          <CompleteMilestoneButton submit={handleCompleteSubmit} render={() => handleCompleteSubmit()} status={status} pmId={pmId} />
        </Box>
      )}

      {!loading && milestones && milestones.length === 0 && <h2>You have not updated anything for this milestone.</h2>}

      {!loading && milestones && milestones.length > 0 && (
        <form onSubmit={handleSubmit}>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" TabIndicatorProps={{
                style: {
                  backgroundColor: "var(--primary-green)",
                }
              }}>
                <Tab label="Requirements" value="1" sx={{
                  "&.Mui-selected": {
                    color: "var(--primary-green)",
                    fontWeight: "bold",
                  },
                  textTransform: 'none !important'
                }} />
                <Tab label="Issue Logs" value="2" sx={{
                  "&.Mui-selected": {
                    color: "var(--primary-green)",
                    fontWeight: "bold",
                  },
                  textTransform: 'none !important'
                }} />
                {order == 4 && <Tab label="Reward Tracking" value="3" sx={{
                  "&.Mui-selected": {
                    color: "var(--primary-green)",
                    fontWeight: "bold",
                  },
                  textTransform: 'none !important'
                }} />}
              </TabList>
            </Box>
            {/* milestone evidence */}
            <TabPanel value="1" sx={{ padding: 0, mt: '2rem' }}>
              {milestoneData.map((milestone, index) => (
                <div key={milestone.id} style={{ marginBottom: index < milestoneData.length - 1 ? "4rem" : "2rem" }}>
                  <Grid2 container columnSpacing={6}>
                    <Grid2 size={8.4} sx={{ height: '100%' }}>
                      <Typography style={{ fontWeight: '500', fontSize: '1rem', marginBottom: '1.5rem' }}>{milestones[index] && milestones[index].reqDescription || ""}</Typography>
                      <div>
                        <MilestoneQuill
                          value={milestone.content || " "}
                          onChange={(value) => handleQuillChange(value, index)}
                        />
                      </div>
                    </Grid2>
                    <Grid2 size={3.6} sx={{ maxHeight: '100%' }}>
                      <Typography style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Requirement Files</Typography>
                      {milestone.requirementFiles.length > 0 || milestone.addedFiles.length > 0 ?
                        <div
                          className='max-h-[100%]'
                          style={{
                            height: '23rem',
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                          }}
                        >
                          {milestone.requirementFiles.map((item, fileIndex) =>
                            <div
                              className="flex flex-row justify-between items-center rounded-[0.5rem] p-[1rem] mb-[1rem]"
                              style={{ border: '2px solid #E4E0E1', overflow: 'hidden' }}
                            >
                              <div>
                                {getFileIcon(item.name.substring(item.name.lastIndexOf('.') + 1).toLowerCase())}
                              </div>
                              <a
                                onClick={() => handleDownload(item.url)}
                                download={item.name}
                                style={{ textDecoration: 'none', cursor: 'default' }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    width: '8rem',
                                    color: 'var(--black)',
                                    whiteSpace: 'normal',
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
                                  visibility: 'hidden',
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          )}
                          <Divider orientation="horizontal" sx={{ borderColor: '#DBDBDB', mt: '1rem', mb: '1.5rem' }} />
                          {milestone.addedFiles.map((item, fileIndex) =>
                            <div
                              className="flex flex-row justify-between items-center rounded-[0.5rem] p-[1rem] mb-[1rem]"
                              style={{ border: '2px solid var(--primary-green)', overflow: 'hidden' }}
                            >
                              <div>
                                {getFileIcon(item.name.substring(item.name.lastIndexOf('.') + 1).toLowerCase())}
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
                                onClick={() => handleRemoveFile(fileIndex, index, "addedFiles")}
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
                              Upload new files
                            </Typography>
                          </Button>
                        </div>
                        : <label
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
                        </label>
                      }
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
                value={issueLogData}
                onChange={(value) => setIssueLogData(value)}
              />
            </TabPanel>
            <TabPanel value="3" sx={{ padding: 0, mt: '2rem', mb: '2rem' }}>
              <PackageEvidence backers={backers} />
            </TabPanel>
          </TabContext>
          {type == 0 && status != "completed" && (
            <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: '#1BAA64', textTransform: 'none', fontWeight: '600' }}>
              Update Milestones
            </Button>
          )}
        </form>
      )}
    </div>
  );
};

export default UpdateMilestone;