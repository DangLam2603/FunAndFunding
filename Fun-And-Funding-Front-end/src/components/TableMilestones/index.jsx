/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import "./index.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import requirementApiInstance from "../../utils/ApiInstance/requirementApiInstance";
import Cookies from "js-cookie";
import { Dialog, TextareaAutosize } from "@mui/material";
import InputField from "../InputField";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState, useEffect } from "react";
import milestoneApiInstance from "../../utils/ApiInstance/milestoneApiInstance";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
};

const columns = [
  { id: "milestoneName", label: "Name", minWidth: 150 },
  { id: "description", label: "Description", minWidth: 150 },
  { id: "duration", label: "Duration (days)", minWidth: 100, align: "center" },
  { id: "version", label: "Version", minWidth: 150, align: "center" },
  { id: "milestoneOrder", label: "Order", minWidth: 150, align: "center" },
  {
    id: "disbursementPercentage",
    label: "Disbursement (%)",
    minWidth: 150,
    align: "center",
  },
  { id: "updateDate", label: "Update Date", minWidth: 200, align: "center" },
];

function MilestoneTable({ dataLoad, notify }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openRows, setOpenRows] = React.useState({});
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [dataReload, setDataReload] = useState([]);
  const [addRequirmentForm, setAddRequirementForm] = useState(false);
  const [addRequirementJson, setAddRequirementJson] = useState({
    title: "",
    description: "",
    milestoneId: "",
  });

  const fetchMilestoneData = async () => {
    try {
      const res = await milestoneApiInstance.get(
        "/group-latest-milestone?status=false"
      );

      if (res.data._isSuccess) {
        setDataReload(res.data._data);
        console.log("success");
      }
      console.log(res.data._data);
    } catch (error) {
      console.error("Error fetching milestone data:", error);
    }
  };

  useEffect(() => {
    fetchMilestoneData();
  }, [dataLoad]);

  const onOpenDialog = (id) => {
    setOpenDialog(true);
    fetchRequirement(id);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setTitle(""); // Reset title on close
    setDescription(""); // Reset description on close
  };

  const onOpenAddRequirementForm = () => {
    setAddRequirementForm(true);
  };
  const onCloseAddRequirementForm = () => {
    setAddRequirementForm(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Log changes for debugging
    setAddRequirementJson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateRequirement = (id) => {
    setSelectedRequirementId(id);
    onOpenDialog(id);
  };

  const fetchRequirement = async (id) => {
    try {
      const response = await requirementApiInstance.get(`/${id}`);
      setTitle(response.data._data.title);
      setDescription(response.data._data.description);
    } catch (error) {
      console.error("Error fetching milestone data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    await fetchUpdateRequirement(selectedRequirementId, title, description);
    closeDialog();
  };

  const fetchUpdateRequirement = async (id, title, description) => {
    try {
      const token = Cookies.get("_auth");
      await requirementApiInstance.put(
        "",
        {
          requirementId: id,
          title: title,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchMilestoneData();
      notify("Requirement updated successfully", "success");
    } catch (error) {
      console.error("Error updating requirement:", error);
    }
  };
  const handleAddRequirement = async (id) => {
    setAddRequirementJson((prev) => ({
      ...prev,
      milestoneId: id,
    }));
    onOpenAddRequirementForm(id);
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("_auth");
      const response = await requirementApiInstance.post(
        ``,
        addRequirementJson,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data); // Log the response
      fetchMilestoneData();
      onCloseAddRequirementForm();
      notify("Requirement add successfully", "success");
    } catch (error) {
      console.error("Error adding requirement:", error.response || error);
      notify("Something wrongs", "error");
    } finally {
      // Reset state after the operation
      setAddRequirementJson({}); // Resetting the state here if needed
    }
  };

  return (
    <Paper className="milestoneTable-container">
      <TableContainer>
        <Table stickyHeader aria-label="milestone table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  backgroundColor: "#e5e7eb",
                }}
              />
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  className="milestoneTable-header"
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: "#e5e7eb",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataReload
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((milestone) => (
                <React.Fragment key={milestone.id}>
                  <TableRow
                    className="milestoneTable-row"
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    sx={{
                      width: "100%",
                      overflow: "hidden",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      textTransform: "capitalize",
                    }}
                  >
                    <TableCell className="milestoneTable-cell">
                      <IconButton
                        className="milestoneTable-iconButton"
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleRow(milestone.id)}
                      >
                        {openRows[milestone.id] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell className="milestoneTable-cell">
                      {milestone.milestoneName}
                    </TableCell>
                    <TableCell className="milestoneTable-cell">
                      {milestone.description}
                    </TableCell>
                    <TableCell align="center" className="milestoneTable-cell">
                      {milestone.duration}
                    </TableCell>
                    <TableCell align="center" className="milestoneTable-cell">
                      {milestone.version}
                    </TableCell>
                    <TableCell align="center" className="milestoneTable-cell">
                      {milestone.milestoneOrder}
                    </TableCell>
                    <TableCell align="center" className="milestoneTable-cell">
                      {milestone.disbursementPercentage + "%"}
                    </TableCell>
                    <TableCell align="center" className="milestoneTable-cell">
                      {formatDate(milestone.updateDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                    >
                      <Collapse
                        in={openRows[milestone.id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box className="requirementsContainer">
                          <div className="flex justify-between">
                            <Typography
                              className="requirementsTitle flex items-center" // Use items-center for vertical centering
                              variant="h6"
                              gutterBottom
                            >
                              Requirements
                            </Typography>
                            <button
                              type="button"
                              onClick={() => handleAddRequirement(milestone.id)}
                              className="w-[12rem] bg-green-500 text-white py-3 rounded-lg mb-4  hover:bg-green-600 transition-all duration-20"
                            >
                              Create Requirement
                            </button>
                          </div>

                          {milestone.requirements.length > 0 ? (
                            <Table size="small" aria-label="requirements">
                              <TableHead>
                                <TableRow
                                  sx={{
                                    width: "100%",
                                    overflow: "hidden",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <TableCell align="center">Order</TableCell>
                                  <TableCell align="center">Title</TableCell>
                                  <TableCell align="center">
                                    Description
                                  </TableCell>
                                  <TableCell align="center">Version</TableCell>
                                  <TableCell align="center">Status</TableCell>
                                  <TableCell align="center">
                                    Create Date
                                  </TableCell>
                                  <TableCell align="center">Update</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {milestone.requirements
                                  .sort((a, b) => a.order - b.order)
                                  .map((requirement, index) => (
                                    <TableRow key={requirement.id}>
                                      <TableCell align="center">
                                        {index + 1}
                                      </TableCell>
                                      <TableCell align="center">
                                        {requirement.title}
                                      </TableCell>
                                      <TableCell align="center">
                                        {requirement.description}
                                      </TableCell>
                                      <TableCell align="center">
                                        {requirement.version}
                                      </TableCell>
                                      <TableCell align="center">
                                        {requirement.status === 0
                                          ? "Mandatory"
                                          : "Optional"}
                                      </TableCell>
                                      <TableCell align="center">
                                        {formatDate(requirement.createDate)}
                                      </TableCell>
                                      <TableCell align="center">
                                        <div className="requirementsButtons">
                                          <button
                                            className="w-full bg-green-500 text-white p-3 rounded-lg my-4 hover:bg-green-600 transition-all duration-20"
                                            onClick={() =>
                                              handleUpdateRequirement(
                                                requirement.id
                                              )
                                            }
                                          >
                                            Update
                                          </button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body1">
                              No requirements available.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={dataReload.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openDialog} onClose={closeDialog}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl text-center my-4 font-bold text-gray-800 ">
                Update Requirement
              </h2>

              <div className="w-full">
                <InputField
                  formControlStyles={{ width: "100%" }}
                  label="Title"
                  startIcon={<TitleIcon />}
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter title"
                />
                <InputField
                  formControlStyles={{ width: "100%" }}
                  label="Description"
                  inputProps={{ multiline: true, rows: 4 }}
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter description"
                  startIcon={<DescriptionIcon />}
                />
              </div>

              <div className="flex justify-around gap-4">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg my-4 hover:bg-green-600 transition-all duration-20"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="w-full bg-green-500 text-white py-3 rounded-lg my-4 hover:bg-green-600 transition-all duration-20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
      <Dialog open={addRequirmentForm} onClose={onCloseAddRequirementForm}>
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="py-10 px-10 bg-white rounded-3xl relative shadow-lg w-[45rem]">
            <form onSubmit={handleAddSubmit}>
              <h2 className="text-xl text-center my-4 font-bold text-gray-800 ">
                Create Requirement
              </h2>

              <div className="w-full">
                <InputField
                  name={"title"}
                  formControlStyles={{ width: "100%" }}
                  label="Title"
                  startIcon={<TitleIcon />}
                  value={addRequirementJson.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                />
                <InputField
                  name={"description"}
                  formControlStyles={{ width: "100%" }}
                  label="Description"
                  inputProps={{ multiline: true, rows: 4 }}
                  value={addRequirementJson.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  startIcon={<DescriptionIcon />}
                />
              </div>

              <div className="flex justify-around gap-4">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg my-4 hover:bg-green-600 transition-all duration-20"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={onCloseAddRequirementForm}
                  className="w-full bg-green-500 text-white py-3 rounded-lg my-4 hover:bg-green-600 transition-all duration-20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </Paper>
  );
}

export default MilestoneTable;
