import { Modal } from "@mui/material"
import { useState } from "react"
import categoryApiInstace from "../../../../utils/ApiInstance/categoryApiInstance"
import { toast, ToastContainer } from "react-toastify"

const CategoryModal = ({ selectedCate, openModal, setOpenModal, modalAdd, setSelectedCate, reload, setReload }) => {


  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedCate(null)

  }

  const handleAddCate = async () => {
    try {
      const response = await categoryApiInstace.post("/", { name: selectedCate.name });
      toast.success("Category added successfully!");
      setTimeout(() => {
        handleCloseModal();
        setReload(!reload)
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category. Please try again.");
    }
  };

  const handleUpdateCate = async () => {
    try {
      const response = await categoryApiInstace.put(`/${selectedCate.id}`, { name: selectedCate.name });
      toast.success("Category updated successfully!");
      setTimeout(() => {
        handleCloseModal();
        setReload(!reload)
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCate = async () => {
    try {
      const response = await categoryApiInstace.delete(`/${selectedCate.id}`);
      toast.success("Delete successfully!");

      setTimeout(() => {
        handleCloseModal();
        setReload(!reload)
      }, 2000);
      return response;
    } catch (error) {
      console.error('Error deleting category:', error.response ? error.response.data : error.message);
      toast.error("Failed to delete category. Please try again.");

    }
  }

  const [updated, setUpdated] = useState(false)

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <div className="flex justify-center items-center w-full h-full">
          <ToastContainer />
          <div class="relative p-4 w-full max-w-[55%] max-h-full overflow-auto scrollbar-hidden">
            <div class="relative bg-white rounded-lg shadow min-h-[100%]">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-primary-green">
                <h3 class="text-xl font-semibold text-white flex uppercase">
                  {modalAdd ? 'Add new category' : 'Update category'}
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  class="end-2.5 text-gray-400 bg-transparent text-white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 md:p-5">
                <div>
                  <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 ">Category name</label>
                  <input
                    value={selectedCate ? selectedCate.name : null}
                    onChange={(e) => { setSelectedCate({ ...selectedCate, name: e.target.value }); setUpdated(true) }}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 " placeholder="Enter category name..." required />
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    disabled={!updated}
                    onClick={modalAdd ? handleAddCate : handleUpdateCate}
                    className={`${updated ? 'bg-primary-green' : 'bg-gray-400'} rounded text-white py-1 px-2 font-semibold`}>
                    {modalAdd ? 'Add' : 'Update'}
                  </button>
                  {
                    !modalAdd &&
                    (
                      <button
                        onClick={handleDeleteCate}
                        className={`bg-red-600 rounded text-white py-1 px-2 font-semibold`}>
                        Delete
                      </button>
                    )
                  }
                  <button
                    onClick={handleCloseModal}
                    className="bg-red-600 rounded text-white py-1 px-2 font-semibold">
                    Cancel
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal >
    </>
  )
}

export default CategoryModal 