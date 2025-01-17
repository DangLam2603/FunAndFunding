import UploadIcon from '@mui/icons-material/Upload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  Collapse,
  Grid2,
  IconButton,
  Modal,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography
} from "@mui/material";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";

import axios from "axios";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

const PackageEvidence = ({ backers, rerender }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [galleryModal, setGalleryModal] = useState({ open: false, image: "" });
  const [selectedBackerId, setSelectedBackerId] = useState(null);
  const [files, setFiles] = useState([]);

  const handleToggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleOpenModal = (id) => {
    setSelectedBackerId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFiles([]);
  };

  const handleSaveEvidence = async () => {
    if (!selectedBackerId || files.length === 0) {
      alert("Please upload at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("id", selectedBackerId);
    files.forEach((file) => {
      formData.append("files", file.file);
    });

    try {
      const response = await axios.put(
        "https://localhost:7044/api/package-backers/upload-evidence",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Evidence uploaded successfully!");
      console.log(response.data);
      handleCloseModal();
    } catch (error) {
      console.error("Error uploading evidence:", error);
      alert("Failed to upload evidence.");
    }
    finally{
      if(rerender){
        rerender();
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGalleryOpen = (image) => {
    setGalleryModal({ open: true, image });
  };

  const handleGalleryClose = () => {
    setGalleryModal({ open: false, image: "" });
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#F8F9FA" }}>
      <TableContainer component={Paper} sx={{ marginBottom: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--light-grey)' }}>
              <TableCell sx={{ width: '15%' }}><strong>User Name</strong></TableCell>
              <TableCell sx={{ width: '25%' }}><strong>Email</strong></TableCell>
              <TableCell sx={{ width: '25%' }}><strong>Package Name</strong></TableCell>
              <TableCell sx={{ width: '20%' }}><strong>Donate Amount</strong></TableCell>
              <TableCell sx={{ width: '15%' }}><strong>Evidence</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {backers.map((backer) => (
              <React.Fragment key={backer.id}>
                {/* Main Row */}
                <TableRow>
                  <TableCell sx={{ borderBottom: 0 }}>{backer.userName}</TableCell>
                  <TableCell sx={{ borderBottom: 0 }}><strong>{backer.email}</strong></TableCell>
                  <TableCell sx={{ borderBottom: 0 }}>{backer.name}</TableCell>
                  <TableCell sx={{ borderBottom: 0 }}>{backer.donateAmount.toLocaleString()} VND</TableCell>
                  <TableCell sx={{ borderBottom: 0 }}>
                    <Tooltip title={`Show Evidences`}>
                      <IconButton onClick={() => handleToggleRow(backer.id)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Upload Evidence`}>
                      <IconButton onClick={() => handleOpenModal(backer.id)}>
                        <UploadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>

                {/* Expanded Row */}
                <TableRow >
                  <TableCell sx={{ borderBottom: '1px solid var(--grey)', p: 0 }} colSpan={12}>
                    <Collapse in={expandedRow === backer.id} timeout="auto" unmountOnExit>
                      <Box sx={{ borderRadius: 1, p: 2 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{
                          style: {
                            backgroundColor: "var(--primary-green)",
                          },
                        }}>
                          <Tab label="Evidence Images" sx={{
                            "&.Mui-selected": {
                              color: "var(--primary-green)",
                              fontWeight: "bold",
                            },
                            textTransform: 'none !important'
                          }} />
                          <Tab label="Reward Items" sx={{
                            "&.Mui-selected": {
                              color: "var(--primary-green)",
                              fontWeight: "bold",
                            },
                            textTransform: 'none !important'
                          }} />
                        </Tabs>
                        <Box mt={2}>
                          {tabValue === 0 && (
                            <Grid2 container spacing={2}>
                              {backer.evidenceImages.length > 0 ? (
                                backer.evidenceImages.map((image, index) => (
                                  <Grid2 size={4} key={index}>
                                    <img
                                      src={image}
                                      alt={`Evidence ${index + 1}`}
                                      style={{
                                        width: "100%",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleGalleryOpen(image)}
                                    />
                                  </Grid2>
                                ))
                              ) : (
                                <Typography>No evidence images available.</Typography>
                              )}
                            </Grid2>
                          )}
                          {tabValue === 1 && (
                            <Box>
                              {backer.rewardItems.length > 0 ? (
                                backer.rewardItems.map((item, index) => (
                                  <div className='flex justify-between items-center my-[1.5rem] w-[18rem]' key={index}>
                                    <img src={item.imageUrl ?? NoImage} style={{ width: '4rem', height: '4rem', objectFit: 'cover', borderRadius: '0.625rem' }} />
                                    <div className='flex flex-col justify-start'>
                                      <Typography sx={{ fontSize: '1.25rem', fontWeight: '700', mb: '0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        {item.name}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.75rem', fontWeight: '400', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        {item.description}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.75rem', fontWeight: '400', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        Quantity: {item.quantity}
                                      </Typography>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <Typography>No reward items available.</Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Upload Evidence */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="upload-evidence-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography id="upload-evidence-modal" sx={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center', mb: '2rem' }} mb={2}>
            Upload Evidence
          </Typography>
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={5}
            name="files"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
          <Box mt={"2rem"} display="flex" justifyContent="space-between">
            <Button variant="outlined" sx={{ borderColor: 'var(--grey)', textTransform: 'none', color: 'var(--grey)' }} onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveEvidence} sx={{ backgroundColor: 'var(--primary-green)', textTransform: 'none' }}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for Gallery View */}
      <Modal
        open={galleryModal.open}
        onClose={handleGalleryClose}
        aria-labelledby="gallery-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: 4,
            borderRadius: 2,
          }}
        >
          <img
            src={galleryModal.image}
            alt="Evidence"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default PackageEvidence;
