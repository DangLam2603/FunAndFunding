import { Box, Modal } from "@mui/material"

const QRCodeModal = ({ pmData, openQRCode, setOpenQRCode }) => {

  const handleClose = () => {
    setOpenQRCode(false)
  }


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

  return (
    <>
      <Modal
        open={openQRCode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex">
            <div className="w-[50%] py-5">
              <div className="mb-5">
                <h2 class="mb-1 text-sm font-semibold text-yellow-700">Notes:</h2>
                <ul class="max-w-md text-yellow-700 text-sm list-disc list-inside ">
                  <li className="py-1">
                    Approve milestone requests only after you have successfully transferred funds to the game owner's bank account.
                  </li>
                  <li className="py-1">
                    Only approve if all the responses fulfill the milestone requirements
                  </li>
                  <li className="py-1">
                    Double-check all details before transferring funds.
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-[50%]">
              <img src={`https://img.vietqr.io/image/${pmData?.fundingProject.wallet.bankAccount.bankCode}-${pmData?.fundingProject.wallet.bankAccount.bankNumber}-compact2.jpg?amount=${pmData?.fundingProject.balance * pmData?.milestone.disbursementPercentage * 0.5}&addInfo=milestone%20request`} alt="QR Code" />
            </div>
          </div>
        </Box>



      </Modal>

    </>
  )
}

export default QRCodeModal