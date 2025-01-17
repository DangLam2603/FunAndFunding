import { Add } from "@mui/icons-material"
import { useCategoryApi } from "../../../utils/Hooks/Category"
import CategoryModal from "./CategoryModal"
import { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import { useLoading } from "../../../contexts/LoadingContext"
import categoryApiInstace from "../../../utils/ApiInstance/categoryApiInstance"
import { TablePagination } from "@mui/material"

const ManageCategory = () => {

  const [reload, setReload] = useState(false)

  // const { cateData, error } = useCategoryApi("all", "GET", null, reload)

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(1);
  const [cateData, setCateData] = useState()
  const { isLoading, setIsLoading } = useLoading()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await categoryApiInstace.get(``, {
          params: {
            pageSize: pageSize,
            pageIndex: pageIndex + 1,
            // searchValue: searchValue,
          },
        });
        setCateData(response.data);
        setPageIndex(response.data._data.pageIndex - 1);
        setPageSize(response.data._data.pageSize);
        setTotalItems(response.data._data.totalItems);
      } catch (err) {
        // setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [totalItems, pageIndex, reload]);

  const [openModal, setOpenModal] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)
  const [selectedCate, setSelectedCate] = useState()

  const handleChangePage = (event, newPage) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  return (
    <>
      <section class="bg-gray-50 p-3 sm:p-5">
        <ToastContainer />
        <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
          <div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div class="w-full md:w-1/2 font-semibold text-gray-700">
                Manage categories
              </div>
              <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  onClick={() => { setModalAdd(true); setOpenModal(true) }}
                  class="flex items-center justify-center text-white bg-primary-green hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none">
                  <Add />
                  Add category
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" class="px-4 py-3">Name</th>
                    <th scope="col" class="px-4 py-3">Created date</th>
                    <th scope="col" class="px-4 py-3">Is deleted</th>
                    <th scope="col" class="px-4 py-3">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    cateData?._data.items.map((c, index) => (
                      <tr key={index} class="border-b">
                        <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{c.name}</th>
                        <td class="px-4 py-3">{new Date(c.createdDate).toLocaleString()}</td>
                        <td class="px-4 py-3">{c.isDeleted.toString().toUpperCase()}</td>
                        <td class="px-4 py-3 flex items-center justify-end">
                          <button
                            onClick={() => { setSelectedCate(c); setModalAdd(false); setOpenModal(true); }}
                            id="apple-imac-27-dropdown-button" data-dropdown-toggle="apple-imac-27-dropdown" class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none" type="button">
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  }


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
      </section>
      {
        cateData && (
          <CategoryModal openModal={openModal} setOpenModal={setOpenModal} selectedCate={selectedCate} modalAdd={modalAdd} setSelectedCate={setSelectedCate} reload={reload} setReload={setReload} />
        )
      }
    </>
  )
}

export default ManageCategory