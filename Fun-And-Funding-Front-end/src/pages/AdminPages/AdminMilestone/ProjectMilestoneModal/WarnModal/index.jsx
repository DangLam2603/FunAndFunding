import { Modal, TextField } from "@mui/material"

const WarnModal = ({ openWarn, setOpenWarn, pmData, newEndDate, setNewEndDate, handleWarn }) => {

  const handleCloseModal = () => {
    setOpenWarn(false)
  }

  const handleConfirmWarn = () => {

    if (!newEndDate) {
      alert("Please choose a date")
    }
    else {
      handleWarn()
      setOpenWarn(false)
    }

  }


  return (
    <>
      <Modal
        open={openWarn}
        onClose={handleCloseModal}
      >
        <div className="flex justify-center items-center w-full h-full">
          <div class="relative p-4 w-full max-w-[45%] max-h-full overflow-auto scrollbar-hidden">
            <div class="relative bg-white rounded-lg shadow h-[20rem] ">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-primary-green">
                <h3 class="text-xl font-semibold text-white flex uppercase">
                  Extend milestone deadline
                </h3>
                <button type="button" onClick={handleCloseModal} class="end-2.5 text-gray-400 bg-transparent text-white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>

              <div className="px-6 py-2 mt-3 mb-[1.5rem] text-center">
                <div className="font-semibold text-gray-700 mb-[1.5rem] ">
                  Choose new end date for this project milestone
                </div>
                <div >
                  <TextField
                    className="w-[50%]"
                    label='Choose new end date'
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      // Add 1 day (24 hours) to the pmData.endDate and format it correctly
                      min: new Date(new Date(pmData.endDate).getTime() + 86400000).toISOString().slice(0, 16), // Add 1 day (86400000 ms)
                    }}
                    onChange={(e) => setNewEndDate(e.target.value)}
                  />
                  <div className="text-sm mt-1">Current deadline: {new Date(pmData.endDate).toLocaleString() + 1}</div>

                </div>
              </div>

              <div className="flex justify-center items-center gap-5">
                <button
                  onClick={() => setOpenWarn(false)}
                  className="bg-red-800 text-white font-semibold px-3 py-1 rounded">Cancel</button>
                <button
                  onClick={() => handleConfirmWarn()}
                  className={`bg-primary-green text-white font-semibold px-3 py-1 rounded`}>Warn this milestone</button>
              </div>

            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default WarnModal