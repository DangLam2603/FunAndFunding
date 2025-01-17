import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Modal, Box, Typography, Button, Stack, Alert, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from 'sweetalert2';
import './index.css'
import { IoMdClose } from "react-icons/io";
import projectMilestoneApiInstance from '../../utils/ApiInstance/projectMilestoneApiInstance';
import zIndex from '@mui/material/styles/zIndex';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import utc from "dayjs/plugin/utc";
import fundingProjectApiInstace from '../../utils/ApiInstance/fundingProjectApiInstance';
const RequestMilestoneModal = ({ render, open, handleClose, milestone, projectId, handleCloseBackdrop }) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    zIndex: 9999,
  };
  console.log(milestone);
  const [alert, setAlert] = useState(false);
  const [pmIntro, setPmIntro] = useState("")
  const [pmTitle, setPmTitle] = useState("")
  const [project, setProject] = useState(null);
  const [totalAmount, setTotalAmount] = useState()
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fundingProjectApiInstace.get(`/${projectId}`);
        setProject(response.data._data);
        if (project && milestone) {
          setTotalAmount(project.balance * milestone.disbursementPercentage)
        }

      } catch (err) {
        console.log(err.message || "Something went wrong");
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, milestone]);


  const handleSubmit = () => {
    try {
      projectMilestoneApiInstance.post("", {
        "status": 0,
        "milestoneId": milestone.id,
        "fundingProjectId": projectId,
        "title": pmTitle,
        "introduction": pmIntro,
        "totalAmount": totalAmount
      })
        .then(res => {
          console.log(res);
          if (res.data._isSuccess) {
            handleCloseBackdrop && handleCloseBackdrop();
            Swal.fire({
              title: `Request for ${milestone.milestoneName} sent!`,
              text: "The waiting process can take 2-5 days. Thank you for your patience.Please check your email for more details.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) {
                // Run the render function only when the user clicks "OK"
                render && render();
              }
            });
            handleClose();

          } else {
            toast.warn(res.data._message[0])
          }
        })
        .catch(error => {
          handleClose();
          console.log(error)
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
          });
        });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error"
      });
    } finally {
    }
  };

  return (
    <Modal open={open} onClose={handleClose} sx={{ margin: '20px 0' }}>
      <Box sx={modalStyle}>
        <ToastContainer />
        <Typography variant="h5" gutterBottom
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className='font-semibold text-2xl'>{milestone.milestoneName}</span>
          <IoMdClose onClick={handleClose} style={{ cursor: 'pointer' }} />
        </Typography>
        <div className='p-3 border border-gray-300 rounded bg-gray-100'>
          <span className='font-semibold text-md'>
            Milestone Goal:
          </span>
          <ul>
            <li>{milestone.description}</li>
          </ul>
          <div className='mt-3'></div>
          <span className='font-semibold text-md'>
            Milestone Duration:
          </span>
          <ul>
            <li>{milestone.duration} days</li>
          </ul>

          {/* <Typography variant="body2" gutterBottom>
            <strong>Partial Disbursement:</strong>
          </Typography>
          <ul>
            <li>5% of the milestone amount is transferred upfront.</li>
            <li>Another 5% upon successful completion.</li>
          </ul> */}
          <div className='mt-3'></div>
          <span className='font-semibold text-md'>
            Requirements:
          </span>
          {milestone.requirements?.map((req, index) => (
            <ul>
              <li key={index}>{req.description}</li>
            </ul>
          ))}
        </div>

        {/* <Typography variant="h6" gutterBottom>
          Validation Criteria:
        </Typography>
        <Typography variant="body1" gutterBottom>
          Additional context about our criteria can be found
          <span style={{ color: '#1BAA64', fontWeight: 600, cursor: 'pointer', marginLeft: '5px' }}>here</span>
        </Typography> */}
        <div className='gap-3 w-[100%]'>
          <div className='w-[100%]'>
            <div className='font-semibold text-xl mt-5'>Milestone Title</div>
            <TextField
              placeholder='Project milestone title...'
              fullWidth
              variant="outlined"
              required
              value={pmTitle}
              onChange={(e) => setPmTitle(e.target.value)}
            />
          </div>
          <div className='w-[100%]'>
            <div className='font-semibold text-xl mt-5'>Milestone Description</div>
            <TextField
              placeholder='Project milestone description...'
              fullWidth
              rows={4}
              multiline
              variant="outlined"
              value={pmIntro}
              onChange={(e) => setPmIntro(e.target.value)}
            />
          </div>
        </div>


        <Stack spacing={2} mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default RequestMilestoneModal