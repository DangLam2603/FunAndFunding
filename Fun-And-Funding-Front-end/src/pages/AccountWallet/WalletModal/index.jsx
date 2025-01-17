import { Modal } from "@mui/material"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import withdrawRequestApiInstance from "../../../utils/ApiInstance/withdrawRequestApiInstance";
import { toast, ToastContainer } from "react-toastify";

const WalletModal = ({ openModal, modalAddMoney, handleCloseModal, walletId, triggerReload, setTriggerReload }) => {

  const [amount, setAmount] = useState(0)

  // const token = Cookies.get("_auth")
  // const decoded = jwtDecode(token)
  // const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]

  const handleAddMoney = () => {
    const walletRequest = {
      'WalletId': walletId,
      'Balance': amount
    }

    const queryString = new URLSearchParams(walletRequest).toString();
    window.location.href = `https://localhost:7044/api/payos/create-payment-link?${queryString}`
  }

  const hanldleRequestWithdrawMoney = async () => {
    try {
      const response = await withdrawRequestApiInstance.post(`/wallet-request?amount=${amount}`);
      console.log(response)
      if (response.data._statusCode == 200)
        toast.success(response.data._message[0])
      else
        toast.warn(response.data._message[0])

      handleCloseModal()
      setTriggerReload(!triggerReload)
    }
    catch (error) {
      console.log(error)
      toast.warn(error.message)
    }
  }

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <div className="flex justify-center items-center w-full h-full">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow min-h-[25rem]">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-xl font-semibold text-gray-900 ">
                  {
                    modalAddMoney
                      ? "Add money to wallet"
                      : "Withdraw money from wallet"
                  }
                </h3>
                <button type="button" onClick={handleCloseModal} class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">
                  <div>
                    <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 ">Input amount</label>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number" name="amount" id="amount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 " placeholder="Enter your amount here..." required />
                  </div>

                  {
                    modalAddMoney
                      ? (
                        <div>
                          <h2 class="mb-1 text-sm font-semibold text-yellow-700">Notes:</h2>
                          <ul class="max-w-md text-yellow-700 text-sm list-disc list-inside ">
                            <li className="py-1">
                              You can only perform payments using QR code scans method.
                            </li>
                            <li className="py-1">
                              Money will be added to your account's wallet within 2–5 minutes.
                            </li>
                            <li className="py-1">
                              All customer information is encrypted for protection.
                            </li>
                          </ul>
                        </div>
                      )
                      : (
                        <div>
                          <h2 class="mb-1 text-sm font-semibold text-yellow-700">Notes:</h2>
                          <ul class="max-w-md text-yellow-700 text-sm list-disc list-inside ">
                            <li className="py-1">
                              Your withdrawn money will be transferred to your linked bank account within 48 hours.
                            </li>
                            <li className="py-1">
                              The withdrawal amount cannot exceed your current wallet balance.
                            </li>
                            <li className="py-1">
                              All customer information is encrypted for protection.
                            </li>
                          </ul>
                        </div>
                      )
                  }

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      modalAddMoney ? handleAddMoney() : hanldleRequestWithdrawMoney()
                    }}
                    class="w-full text-white bg-primary-green hover:bg-primary-green/80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {
                      modalAddMoney
                        ? "Add money"
                        : "Request withdraw"
                    }
                  </button>
                </form>

              </div>
            </div>

          </div>

        </div>


      </Modal>
    </>
  )
}

export default WalletModal