/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import milestoneApiInstance from "../../utils/ApiInstance/milestoneApiInstance";
import Cookies from "js-cookie";
import { Dialog } from "@mui/material";
import InputField from "../InputField";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import TimerIcon from "@mui/icons-material/Timer";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function CreateMilestone({ setDataLoad, notify }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [milestone, setMilestone] = useState({
    milestoneName: "",
    description: "",
    duration: 0,
    milestoneOrder: 0,
    disbursementPercentage: 0,
  });

  // Open dialog function
  const onOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close dialog function
  const closeDialog = () => {
    setOpenDialog(false);
    setMilestone({
      milestoneName: "",
      description: "",
      duration: 0,
      milestoneOrder: 0,
      disbursementPercentage: 0,
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Parse the value to the correct type for specific fields
    const parsedValue = isNaN(value) ? value : Number(value);

    setMilestone((prevMilestone) => ({
      ...prevMilestone,
      [name]: parsedValue,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchPostMilestone();
    closeDialog();
  };

  // POST request to create a new milestone
  const fetchPostMilestone = async () => {
    try {
      const token = Cookies.get("_auth");
      await milestoneApiInstance.post("", milestone, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDataLoad(true);
      notify("Milestone updated successfully", "success");
    } catch (error) {
      notify("something wrong", "error");
    }
  };

  return (
    <div>
      <button
        type="button"
        className="w-full font-medium bg-[#1BAA64] text-white py-3 my-4 rounded-lg mt-6 hover:bg-white hover:text-[#1BAA64] border border-[#1BAA64] transition-all duration-200"
        onClick={onOpenDialog}
      >
        Create new Milestone
      </button>

      <Dialog open={openDialog} onClose={closeDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl text-center my-4 font-bold text-gray-800 ">
                Create Milestone
              </h2>

              <div className="w-full flex flex-col gap-4">
                <InputField
                  name="milestoneName"
                  formControlStyles={{ width: "100%" }}
                  label="Milestone Name"
                  startIcon={<DriveFileRenameOutlineIcon />}
                  value={milestone.milestoneName}
                  onChange={handleChange}
                  placeholder="Milestone Name"
                />

                <InputField
                  name="description"
                  formControlStyles={{ width: "100%" }}
                  label="Description"
                  value={milestone.description}
                  onChange={handleChange}
                  placeholder="Description"
                  startIcon={<DescriptionIcon />}
                />

                <InputField
                  name="duration"
                  formControlStyles={{ width: "100%" }}
                  label="Duration"
                  type="number"
                  value={milestone.duration}
                  onChange={handleChange}
                  startIcon={<TimerIcon />}
                  placeholder="Duration"
                />

                <InputField
                  name={"milestoneOrder"}
                  formControlStyles={{ width: "100%" }}
                  label="Milestone Order"
                  type="number"
                  value={milestone.milestoneOrder}
                  onChange={handleChange}
                  placeholder="Milestone Order"
                  startIcon={<FormatListNumberedIcon />}
                />

                <InputField
                  name={"disbursementPercentage"}
                  formControlStyles={{ width: "100%" }}
                  label="Disbursement Percentage"
                  type="number"
                  value={milestone.disbursementPercentage}
                  onChange={handleChange}
                  placeholder="Disbursement Percentage"
                  startIcon={<AttachMoneyIcon />}
                />
              </div>

              <div className="flex justify-around gap-4 mt-6">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Create
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
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default CreateMilestone;
