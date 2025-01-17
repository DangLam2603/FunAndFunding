/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import ReactQuill from "react-quill";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
} from "@mui/material";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import reportApiInstance from "../../utils/ApiInstance/reportApiInstance";
import Cookies from "js-cookie";
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

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
function ReportForm({ violatorId, type, closeDialog, openDialog }) {
  const [checkedItems, setCheckedItems] = useState([]);
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState("");
  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    setCheckedItems((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleSubmit = async () => {
    try {
      console.log("report projectid:", violatorId);
      console.log("files:", files);
      // Create FormData instance
      const formData = new FormData();
      // Append projectId and content to FormData
      formData.append("ViolatorId", violatorId);
      formData.append("Type", type);
      formData.append("Content", content);
      // Append each file (assuming `files` is an array of objects with a file property)
      files.forEach((file) => {
        formData.append("FileUrls", file.file); // Adjust based on file structure
      });
      // Append fault causes
      checkedItems.forEach((cause) => {
        formData.append("FaultCauses", cause); // Adjust if needed
      });
      // Make the API request
      const res = await createReport(formData);
      if (res.data._isSuccess) {
        closeDialog();
        notify("Report submitted successfully", "success");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const createReport = async (formData) => {
    try {
      const token = Cookies.get("_auth");
      const res = await reportApiInstance.post("", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res;
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  return (
    <div>
      <Dialog open={openDialog} onClose={closeDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="w-[75rem] bg-white p-10 rounded-3xl shadow-lg mb-10 overflow-y-auto max-h-[90vh]">
            <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">
              Report Form
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Types
                </label>
                <FormGroup>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Inappropriate Content"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Inappropriate Content"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Intellectual Property Violation"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Intellectual Property Violation"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Fraudulent Activity"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Fraudulent Activity"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Harassment or Abuse"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Harassment or Abuse"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Spam or Fake Project"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Spam or Fake Project"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Harmful or Dangerous Product"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Harmful or Dangerous Product"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Hate Speech or Discrimination"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Hate Speech or Discrimination"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="False Claims or Misrepresentation"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="False Claims or Misrepresentation"
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Misuse of Funds"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Misuse of Funds"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Violating Platform Guidelines"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Violating Platform Guidelines"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Inappropriate or Misleading Rewards"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Inappropriate or Misleading Rewards"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Unauthorized Use of Personal Information"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Unauthorized Use of Personal Information"
                      />
                    </Box>
                  </Box>
                </FormGroup>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Files
                </label>
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  maxFiles={4}
                  acceptedFileTypes={["image/*"]}
                  name="images"
                  labelIdle='Drag & drop files here or <span class="filepond--label-action">Browse</span>'
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Note
                </label>
                <ReactQuill value={content} onChange={setContent} />
              </div>
              <div className="flex justify-around gap-4">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Submit Report
                </button>
                <button
                  type="button"
                  onClick={closeDialog}
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

export default ReportForm;
