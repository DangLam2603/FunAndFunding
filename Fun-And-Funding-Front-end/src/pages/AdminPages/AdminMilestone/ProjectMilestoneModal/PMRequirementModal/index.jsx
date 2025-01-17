import { Box, Modal } from "@mui/material"


const PMRequirementModal = ({ pmrData, openPMRequirement, setOpenPMRequirement }) => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1
  };

  const handleClose = () => {
    setOpenPMRequirement(false)
  }

  console.log(pmrData)

  return (
    <>
      <Modal
        open={openPMRequirement}
        onClose={handleClose}
      >
        <div className="flex justify-center items-center w-full h-full">
          <div class="relative p-4 w-full max-w-[45%] max-h-full overflow-auto scrollbar-hidden">
            <div class="relative bg-white rounded-lg shadow min-h-[80vh] ">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-primary-green">
                <h3 class="text-xl font-semibold text-white flex uppercase">
                  Requirement response
                </h3>
                <button type="button" onClick={handleClose} class="end-2.5 text-gray-400 bg-transparent text-white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              {
                pmrData &&
                (
                  <div className="p-5">
                    <div className="text-sm italic font-semibold text-gray-500 text-right">Last updated at {new Date(pmrData.updateDate).toLocaleString()}</div>
                    <div className="mb-5">
                      <div className="font-semibold text-gray-700 my-1">Response content</div>
                      <div className="" dangerouslySetInnerHTML={{ __html: pmrData.content }} />
                    </div>

                    <div>
                      <div className="font-semibold text-gray-700 my-1">Response files</div>
                      <div>

                      </div>
                      <div>
                        <div class="grid grid-cols-2 gap-2">
                          {
                            pmrData.requirementFiles.length > 0
                              ? pmrData.requirementFiles.map((file, index) => {
                                if (file.file == 6)
                                  return (<div className="h-[10rem] object-contain overflow-hidden rounded-lg">
                                    <img class=" max-w-full " src={file.url} alt="" />

                                  </div>)
                                else if (file.file == 7)
                                  return (<div className="h-[10rem] overflow-hidden rounded-lg">
                                    <video class="h-auto max-w-full " controls alt="">
                                      <source src={file.url} type="video/mp4" />
                                    </video>
                                  </div>)
                                else
                                  return (
                                    <div className="h-[10rem] overflow-hidden rounded-lg bg-gray-200 flex justify-center items-center">
                                      <div>
                                        <div className="font-light mb-1 italic text-gray-800">
                                          {file.name}
                                        </div>
                                        <a href={file.url} download class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 "><svg class="w-3.5 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                          <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                        </svg> Download File</a>
                                      </div>
                                    </div>
                                  )
                              })
                              : 'No files available'

                          }
                        </div>
                      </div>
                    </div>

                  </div>
                )
              }


            </div>
          </div>
        </div>
      </Modal >
    </>
  )
}

export default PMRequirementModal