import { AccountBalance } from "@mui/icons-material"
import { Autocomplete, Avatar, Box, Grid2, Paper, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router"
import FormDivider from "../../../components/CreateProject/ProjectForm/Divider"
import NavigateButton from "../../../components/CreateProject/ProjectForm/NavigateButton"
import { useLoading } from "../../../contexts/LoadingContext"


const SetupBankAccount = () => {

  const { setFormIndex, setProjectData, projectData } = useOutletContext();
  const navigate = useNavigate()

  const { isLoading, setIsLoading } = useLoading()

  const [selectedBank, setSelectedBank] = useState(projectData.bankAccount?.bankCode || null)
  const [bankList, setBankList] = useState([])
  const [bankAccountNumber, setBankaccountNumber] = useState(projectData.bankAccount?.bankNumber || '')
  const [ownerName, setOwnerName] = useState('')
  useEffect(() => {

  }, [selectedBank, bankAccountNumber])

  useEffect(() => {
    setFormIndex(3)
    const fetchBank = axios.get("https://api.httzip.com/api/bank/list").then(res => {
      setBankList(res.data.data);
    })
  }, [])

  const checkBankAccount = async () => {
    setIsLoading(true)
    axios.post("https://api.httzip.com/api/bank/id-lookup-prod", {
      "bank": selectedBank && selectedBank.code,
      "account": bankAccountNumber
    }, {
      headers: {
        'x-api-key': '11f028b5-b964-4efa-ab9c-db4e199dccb4key',
        'x-api-secret': '691b9c60-353e-4e68-946f-ce68292884d0secret'
      }
    }).then(res => {
      console.log(res)
      setOwnerName(res.data.data.ownerName)
      setIsLoading(false)
    })
  }

  const onSubmit = () => {
    setProjectData(prevData => ({
      ...prevData,
      bankAccount: {
        bankCode: selectedBank?.code,
        bankNumber: bankAccountNumber
      }
    }))
    console.log(selectedBank, bankAccountNumber, ownerName)
    navigate('/request-funding-project/setup-donate-package')
  }

  return (
    <>
      <Paper elevation={1} className="bg-white w-full overflow-hidden">
        <div className="bg-primary-green text-white flex justify-center items-center h-[3rem] text-xl font-semibold items-center mb-4">
          <span className='mr-2'><AccountBalance /></span> Setup bank account
        </div>

        <div className='px-5'>
          <FormDivider title={'Setup bank account'} />
          <div className='text-sm text-black/50 text-center my-1'>Please select and verify your bank account.
            The bank information provided will be your channel for receiving funds when the project successfully raises capital.
          </div>
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
              <p className="text-gray-500 text-xs">This field shall display the name of the owner of the account as you provide correct information.</p>
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

          <button type="button" class="text-white bg-primary-green font-medium rounded text-sm px-5 py-2.5 me-2 mb-2"
            onClick={checkBankAccount}>
            Check
          </button>

          <div className="flex justify-center gap-5 my-5">
            <NavigateButton text={'Back'} onClick={() => { navigate('/request-funding-project/project-media') }} />
            <NavigateButton text={'Next'} disabled={ownerName == ''} onClick={() => onSubmit()} />
          </div>
        </div>
      </Paper>
    </>
  )
}

export default SetupBankAccount