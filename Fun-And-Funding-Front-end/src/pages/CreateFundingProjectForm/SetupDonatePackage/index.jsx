import { Paper } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router"
import EmptyIcon from '../../../assets/images/image_empty.png'
import FormDivider from "../../../components/CreateProject/ProjectForm/Divider"
import NavigateButton from "../../../components/CreateProject/ProjectForm/NavigateButton"
import PackageModal from "./PackageModal"
import fundingProjectApiInstace from "../../../utils/ApiInstance/fundingProjectApiInstance"
import Cookies from "js-cookie";
import { Backdrop, CircularProgress } from "@mui/material"
import Swal from "sweetalert2"
const SetupDonatePackage = () => {
  const token = Cookies.get("_auth");
  const { setFormIndex, setProjectData, projectData } = useOutletContext()
  const { thumbnail, projectVideo, projectImages } = useOutletContext();
  console.log(thumbnail);
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false)

  const [projectPackages, setProjectPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const handleOpenAddPackage = () => {
    setSelectedPackage(null);
    setOpenModal(true);
  };

  const handleOpenEditPackage = (packageData) => {
    setSelectedPackage(packageData);
    setOpenModal(true);
  };

  const addPackage = (newPackage) => {
    setProjectPackages([...projectPackages, newPackage]);
    setOpenModal(false);
  };

  const editPackage = (updatedPackage) => {
    const updatedPackages = projectPackages.map((pkg) =>
      pkg === selectedPackage ? updatedPackage : pkg
    );
    setProjectPackages(updatedPackages);
    setOpenModal(false);
  };

  useEffect(() => {
    setProjectData((prev) => (
      {
        ...prev,
        'packages': projectPackages
      }
    ))
  }, [projectPackages])


  useEffect(() => {
    setFormIndex(4)
  }, [])

  // call api create project
  const createRequest = async () => {
    const formData = new FormData();
    formData.append('Name', projectData.name);
    formData.append('Description', projectData.description);
    formData.append('Introduction', projectData.introduction);
    formData.append('StartDate', projectData.startDate);
    formData.append('EndDate', projectData.endDate);
    formData.append('Target', projectData.target);
    formData.append('Balance', 0);
    // Append Bank Account information
    formData.append('BankAccount.BankNumber', projectData.bankAccount.bankNumber);
    formData.append('BankAccount.BankCode', projectData.bankAccount.bankCode);
    // Append packages and reward items
    projectData.packages.forEach((packageData, index) => {
      formData.append(`Packages[${index}].Name`, packageData.name);
      formData.append(`Packages[${index}].RequiredAmount`, packageData.requiredAmount);
      formData.append(`Packages[${index}].Description`, packageData.description);
      formData.append(`Packages[${index}].LimitQuantity`, packageData.limitQuantity);
      if (packageData.imageFile) {
        formData.append(`Packages[${index}].ImageFile`, packageData.imageFile);
      }
      packageData.rewardItems.forEach((reward, rewardIndex) => {
        formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Name`, reward.name);
        formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Description`, reward.description);
        formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Quantity`, reward.quantity);
        if (reward.imageFile) {
          formData.append(`Packages[${index}].RewardItems[${rewardIndex}].ImageFile`, reward.imageFile);
        }
      });
    });
    //append categories
    console.log(projectData.categories[0]);
    for (let i = 0; i < projectData.categories.length; i++) {
      formData.append(`Categories[${i}].Id`, projectData.categories[i].id);
    }
    // Add other files (e.g., Funding Files)
    for (let i = 0; i < projectData.fundingFiles.length; i++) {
      formData.append(`FundingFiles[${i}].Name`, projectData.fundingFiles[i].name);
      formData.append(`FundingFiles[${i}].URL`, projectData.fundingFiles[i].url); // The actual file
      formData.append(`FundingFiles[${i}].Filetype`, projectData.fundingFiles[i].filetype); // Example file type
    }

    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      setIsLoading(true);
      const response = await fundingProjectApiInstace.post("", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      Swal.fire({
        title: `Your funding project request has been sent!`,
        text: "The waiting process can take 2-5 days. Thank you for your patience.Please check your email for more details.",
        icon: "success"
      });
      navigate("/account/projects")

    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error"
      });
      console.error('Error creating project:', error);
    } finally {

      setIsLoading(false);
    }
  }

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper elevation={1} className="bg-white w-full overflow-hidden]">
        <div className="bg-primary-green text-white flex justify-center items-center h-[3rem] text-xl font-semibold mb-4">
          Setup project donate packages
        </div>


        <div className='px-5 min-h-[25rem]'>
          <FormDivider title={'Set up donate packages'} />
          <div className='text-sm text-black/50 text-center my-1'>Set up support packages along with accompanying items and perks</div>


          <div className='text-right'>
            <button class="bg-gray-500 text-white text-sm font-bold py-1 px-3 rounded mt-5 mb-2"
              onClick={handleOpenAddPackage}
            >
              Add package
            </button>
          </div>
          {
            projectPackages.length > 0
              ? (
                <div class="relative overflow-x-auto table-fixed mb-10">
                  <table class="w-full text-sm text-left rtl:text-right text-gray-600">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          Image
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Quantity
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Rewards
                        </th>
                        <th scope="col" class="px-6 py-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        projectPackages.map((pkg, index) => (
                          <tr key={index} className="bg-white border-b">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              <img className='w-[5rem] h-[5rem]' src={pkg.imageUrl || 'default-image.png'} alt={pkg.name} />
                            </th>
                            <td className="px-6 py-4">{pkg.name}</td>
                            <td className="px-6 py-4">{pkg.limitQuantity}</td>
                            <td className="px-6 py-4">{pkg.requiredAmount} đ</td>
                            <td className="px-6 py-4">{pkg.rewardItems.length} item{pkg.rewardItems.length > 1 ? 's' : ''}</td>
                            <td className="px-1 py-4 text-center">
                              <a href="#" className="font-medium text-gray-100 bg-blue-800 px-3 py-1 rounded"
                                onClick={() => handleOpenEditPackage(pkg)}
                              >
                                Edit
                              </a>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )
              : (
                <div className='bg-gray-100 w-full h-[17rem] rounded flex justify-center items-center'>
                  <div>
                    <img className='w-[10rem] h-[10rem]' src={EmptyIcon} alt="data unavailable" />
                    <div className='font-semibold text-black/50'>Nothing to see here</div>
                  </div>
                </div>
              )
          }
          <PackageModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            selectedPackage={selectedPackage}
            addPackage={addPackage}
            editPackage={editPackage}
          />
        </div>
        <div>
          <div className="flex justify-center gap-5 my-5">
            <NavigateButton text={'Back'} onClick={() => { navigate('/request-funding-project/setup-bank-account') }} />
            <NavigateButton text={'Request funding'} onClick={() => createRequest()} />
          </div>
        </div>
      </Paper>
    </>
  )
}

export default SetupDonatePackage