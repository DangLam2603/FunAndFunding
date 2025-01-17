/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useProjectMilestoneApi } from "../../../utils/Hooks/ProjectMilestone";
import ProjectMilestoneModal from "./ProjectMilestoneModal";
import { TablePagination } from "@mui/material";
import { useLoading } from "../../../contexts/LoadingContext";
import projectMilestoneApiInstace from "../../../utils/ApiInstance/projectMilestoneApiInstance";

const AdminMilestone = () => {
  const [triggerReload, setTriggerReload] = useState(false)
  // const { data, error } = useProjectMilestoneApi("", "GET", null, triggerReload);
  const { isLoading, setIsLoading } = useLoading()

  const [openModal, setOpenModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const [totalItems, setTotalItems] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [data, setData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await projectMilestoneApiInstace.get(``, {
          params: {
            pageSize: pageSize,
            pageIndex: pageIndex + 1,
            // searchValue: searchValue,
          },
        });
        setData(response.data);
        setPageIndex(response.data._data.pageIndex - 1);
        setPageSize(response.data._data.pageSize);
        setTotalItems(response.data._data.totalItems);
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [totalItems, pageIndex, triggerReload]);


  const pmStatus = [
    "Pending",
    "Processing",
    "Completed",
    "Warning",
    "Failed",
    "Submitted",
    "Resubmitted"
  ];

  const handleOpenModal = (fundingProject) => {
    setSelectedMilestone(fundingProject);
    setOpenModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12 mt-[2rem]">
        <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <span className="text-sm font-normal text-gray-500">
                {/* Showing{" "}
                <span className="font-semibold text-gray-900">
                  {data?._data.totalItems}{" "}
                </span> */}
                Milestone disbursement requests
              </span>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <div cl
                assName="flex items-center space-x-3 w-full md:w-auto">
                {/* <button
                  id="filterDropdownButton"
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="h-4 w-4 mr-2 text-gray-400"
                    viewbox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Filter
                  <svg
                    className="-mr-1 ml-1.5 w-5 h-5"
                    fill="currentColor"
                    viewbox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </button> */}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Funding Project
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Created date
                  </th>
                  <th scope="col" className="px-4 py-3">
                    End date
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Milestone
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?._data.items.map((pm, index) => (
                  <tr key={index} className="border-b">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                    >
                      <div className="truncate w-48">
                        {pm.fundingProject.name}
                      </div>
                    </th>
                    <td className="px-4 py-3">
                      {new Date(pm.createdDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(pm.endDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {/* <img className="w-10 h-10 rounded" src={pm.fundingProject.fundingFiles.} alt="Default avatar" /> */}
                      {pm.milestoneName}
                    </td>
                    <td className="px-4 py-3">
                      {(
                        pm.milestone.disbursementPercentage *
                        pm.fundingProject.balance
                      )
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      đ
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                        {pmStatus[pm.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center justify-end">
                      <button
                        onClick={() => handleOpenModal(pm)}
                        className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                        type="button"
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewbox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination
            component="div"
            count={totalItems}
            page={pageIndex}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>

      </div>

      <ProjectMilestoneModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        pmData={selectedMilestone}
        setTriggerReload={setTriggerReload}
        triggerReload={triggerReload}
      />
    </>
  );
};

export default AdminMilestone;
