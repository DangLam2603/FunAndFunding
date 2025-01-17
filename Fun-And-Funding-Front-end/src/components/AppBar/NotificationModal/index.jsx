import { Modal } from "@mui/material"
import NotificationCard from "../../Notification/NotificationCard"


const NotificationModal = ({ openNotiModal, setOpenNotiModal, notiData }) => {


  const handleClose = () => {
    setOpenNotiModal(false)
  }

  return (
    <>
      <Modal
        open={openNotiModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex justify-center items-center w-full h-full scrollbar-hidden">
          <div className="relative p-4 w-full max-w-[40vw] max-h-full overflow-auto flex scrollbar-hidden flex-col">
            <div className="relative bg-gray-100 rounded-lg shadow min-h-[70vh] h-[80vh] pb-[7rem] overflow-auto scrollbar-hidden flex-grow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-primary-green sticky top-0 z-30">
                <h3 className="text-xl font-semibold text-white flex uppercase">
                  All notifications
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="end-2.5 bg-transparent text-white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                >
                  <svg
                    className="w-3 h-3"
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
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 md:p-5 flex-grow overflow-auto">
                <NotificationCard notiData={notiData} listAll={true} />
              </div>
            </div>
          </div>
        </div>

      </Modal>
    </>
  )
}

export default NotificationModal