import { Autocomplete, Avatar, AvatarGroup, Box, Divider, Grid2, Modal, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "axios"
import bankAccountApiInstance from "../../../utils/ApiInstance/bankAccountApiInstance"
import { useLoading } from "../../../contexts/LoadingContext"


const BankAccountSettingModal = ({ openModal, setOpenModal, walletId, bankAccData, triggerReload, setTriggerReload }) => {
  const [selectedBank, setSelectedBank] = useState(null)
  const [bankList, setBankList] = useState([])
  const [bankAccountNumber, setBankaccountNumber] = useState('')
  const [ownerName, setOwnerName] = useState('')

  const { isLoading, setIsLoading } = useLoading()

  const checkInitialBankAccount = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://api.httzip.com/api/bank/list");
      if (response.data.code === 200) {
        const bankList = response.data.data;
        setBankList(response.data.data)
        setBankaccountNumber(bankAccData.bankNumber)
        const bankCode = bankAccData?.bankCode;
        const foundBank = bankList.find(record => record.code === bankCode);
        // alert(foundBank)
        if (foundBank) {
          setSelectedBank(foundBank);
          const bankAccountResponse = await axios.post(
            "https://api.httzip.com/api/bank/id-lookup-prod",
            {
              "bank": foundBank.code,
              "account": bankAccData.bankNumber
            },
            {
              headers: {
                'x-api-key': '11f028b5-b964-4efa-ab9c-db4e199dccb4key',
                'x-api-secret': '691b9c60-353e-4e68-946f-ce68292884d0secret'
              }
            }
          );

          if (bankAccountResponse.data.code === 200) {
            setOwnerName(bankAccountResponse.data.data.ownerName);
          } else {
            console.error('Error checking bank account:', bankAccountResponse.data.message);
          }
        }
      } else {
        console.error('Error fetching bank list:', response.data.message);
      }
    } catch (error) {
      console.error('Error during initial bank account check:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkInitialBankAccount()
    }
    fetchData()
  }, [bankAccData])


  const handleOnCloseModal = () => {
    setOpenModal(false)
  }

  const checkBankAccount = async () => {
    axios.post("https://api.httzip.com/api/bank/id-lookup-prod", {
      "bank": selectedBank && selectedBank.code,
      "account": bankAccountNumber
    }, {
      headers: {
        'x-api-key': '11f028b5-b964-4efa-ab9c-db4e199dccb4key',
        'x-api-secret': '691b9c60-353e-4e68-946f-ce68292884d0secret'
      }
    }).then(res => {
      setOwnerName(res.data.data.ownerName)
    })
  }

  const handleLinkBankAccount = async () => {
    setIsLoading(true)
    try {
      const linkBankBody = {
        'bankCode': selectedBank?.code,
        'bankNumber': bankAccountNumber,
        'id': walletId
      }
      bankAccountApiInstance
        .post("/", linkBankBody)
        .then(res => {
          setTriggerReload(!triggerReload)
          console.log('response', res)
        })

    } catch (error) {
      console.error('Error linking bank account:', error);
    }
    handleOnCloseModal()
    setIsLoading(false)
  }

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleOnCloseModal}
      >
        <div className="flex justify-center items-center w-[full] h-full">
          <div class="relative p-4 w-[40rem] max-h-full">
            <div class="relative bg-white rounded-lg shadow pb-[1rem]">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-xl font-semibold text-gray-900 ">
                  Bank account setting
                </h3>
                <button type="button" onClick={handleOnCloseModal} class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>

              <div className="px-6">
                <Grid2 container spacing={4} className="my-8">
                  <Grid2 size={4}>
                    <h4 className="font-semibold text-sm mb-1">Select your bank*</h4>
                    <p className="text-gray-500 text-xs">Please select your bank from the options.</p>
                  </Grid2>
                  <Grid2 size={8}>
                    <Autocomplete
                      freeSolo
                      id="free-solo-2-demo"
                      disableClearable
                      value={selectedBank}
                      options={bankList}
                      getOptionLabel={(option) => option.name || ''}
                      onChange={(event, newValue) => {
                        setSelectedBank(newValue)
                        // console.log(newValue)
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Avatar alt={option.name} src={option.logo_url}
                            sx={{
                              marginRight: 2, objectFit: 'fill', width: 60,
                              height: 24
                            }} variant="rounded" />
                          <Typography variant="body1">{option.name}</Typography>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select bank"
                          InputProps={{
                            ...params.InputProps,
                            type: 'search',
                          }}
                        />
                      )}
                    />
                  </Grid2>


                  <Grid2 size={4}>
                    <h4 className="font-semibold text-sm mb-1">Enter your bank number*</h4>
                    <p className="text-gray-500 text-xs">Provide your bank account number.</p>
                  </Grid2>
                  <Grid2 size={8}>
                    <TextField
                      value={bankAccountNumber}
                      type='number'
                      fullWidth
                      label="Enter your account number"
                      onChange={(e) => setBankaccountNumber(e.target.value)}
                    />
                  </Grid2>

                  <Grid2 size={4}>
                    <h4 className="font-semibold text-sm mb-1">Account owner*</h4>
                    <p className="text-gray-500 text-xs">Display the owner's name as you provide the correct account information.</p>
                  </Grid2>
                  <Grid2 size={8}>
                    <TextField
                      disabled
                      label='Name of the account owner'
                      fullWidth
                      value={ownerName}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // value={bankState != undefined ? bankState.ownerName : bankOwner}
                      sx={{ background: "rgba(0, 0, 0, 0.05)" }}
                    />
                  </Grid2>
                </Grid2>

                <button type="button" class="text-white bg-primary-green font-medium rounded text-sm px-5 py-2.5"
                  onClick={checkBankAccount}>
                  Check
                </button>
                <Divider sx={{ width: '50%', margin: '1rem auto' }} />
                <div className="flex justify-center items-center gap-5">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="bg-red-800 text-white font-semibold px-3 py-1 rounded">Cancel</button>
                  <button
                    onClick={() => handleLinkBankAccount()}
                    disabled={ownerName ? false : true}
                    className={`${ownerName ? 'bg-primary-green' : 'bg-gray-400'}  text-white font-semibold px-3 py-1 rounded`}>Confirm</button>
                </div>

              </div>

            </div>
          </div>
        </div>

      </Modal>
    </>
  )
}

export default BankAccountSettingModal