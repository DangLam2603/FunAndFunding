/* eslint-disable no-unused-vars */
import React from "react";
import TableMilestones from "../../components/TableMilestones";
import { Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import milestoneApiInstace from "../../utils/ApiInstance/milestoneApiInstance";
import CreateMilestone from "../../components/CreateMilestone";

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

function Milestones() {
  const [dataLoad, setDataLoad] = useState(false);
  return (
    <div className="p-12">
      {/* <CreateMilestone setDataLoad={setDataLoad} notify={notify} /> */}
      <TableMilestones dataLoad={dataLoad} notify={notify} />
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
  );
}

export default Milestones;
