import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, Grid2 } from '@mui/material';
import FormDivider from '../../../../components/CreateProject/ProjectForm/Divider';
import RewardItemTable from './RewardItemTable';


const PackageModal = ({ openModal, setOpenModal, selectedPackage, addPackage, editPackage }) => {
  const [packageData, setPackageData] = useState({
    imageUrl: '',
    name: '',
    description: '',
    requiredAmount: 0,
    limitQuantity: 0,
    packageTypes: 'FixedPackage',
    // rewardItems: [
    //   {
    //     name: '',
    //     description: '',
    //     quantity: 0,
    //     imageFile: ''
    //   }
    // ]
  });

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setPackageData((prev) => ({
      ...prev,
      [name]: value
    }));

    // console.log(packageData)
  };

  useEffect(() => {
    if (selectedPackage) {
      setPackageData(selectedPackage);
    } else {
      setPackageData({
        name: '',
        description: '',
        requiredAmount: 0,
        limitQuantity: 0,
        packageTypes: 0,
        // rewardItems: [{ name: '', description: '', quantity: 0, imageFile: '' }]
        rewardItems: []
      });
    }
  }, [selectedPackage, openModal]);

  const handleSubmit = () => {
    if (selectedPackage) {
      editPackage(packageData);
    } else {
      addPackage(packageData);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl);
      setPackageData((prev) => ({
        ...prev,
        imageUrl: imageUrl,
        imageFile: file
      }));
    }
  };


  return (
    <>
      <Dialog
        open={openModal}
        onClose={handleClose}
        // scroll={scroll}
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '55% !important',
            width: '55% !important'
          },
        }}
      >
        <DialogTitle sx={{ background: 'var(--primary-green)', color: 'white', fontWeight: 'bold' }}>Package detail</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            tabIndex={-1}
          >
            <Grid2 container>
              <Grid2 size={4.5}>
                <div class="block mb-2 text-sm font-medium text-gray-900 ">Package image</div>
                <div class="flex items-center justify-center w-full">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-[17.5rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100"
                  >
                    {packageData.imageUrl ? (
                      <img
                        src={packageData.imageUrl}
                        alt="Package preview"
                        class="w-full h-[17.5rem] object-cover rounded-lg"
                      />
                    ) : (
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          class="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p class="mb-2 text-sm text-gray-500">
                          <span class="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p class="text-xs text-gray-500">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                    )}
                    <input
                      id="dropzone-file"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

              </Grid2>
              <Grid2 size={7.5}>
                <form class="max-w-sm mx-auto">
                  <div class="mb-5">
                    <label class="block mb-2 text-sm font-medium text-gray-900 ">Package name</label>
                    <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 :focus:border-blue-500" placeholder="Package name..." required
                      value={packageData.name} name='name'
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex gap-2'>
                    <div class="mb-5">
                      <label class="block mb-2 text-sm font-medium text-gray-900 ">Package price</label>
                      <input type='number' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 :focus:border-blue-500" placeholder='Price...' required
                        value={packageData.requiredAmount} name='requiredAmount'
                        onChange={handleInputChange}
                      />
                    </div>
                    <div class="mb-2">
                      <label class="block mb-2 text-sm font-medium text-gray-900 ">Package quantity</label>
                      <input type='number' placeholder='Quantity...' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 :focus:border-blue-500" required
                        value={packageData.limitQuantity} name='limitQuantity'
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <form class="max-w-sm mx-auto">
                    <label class="block mb-2 text-sm font-medium text-gray-900 ">Description</label>
                    <textarea rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 :focus:border-blue-500" placeholder="Description..."
                      value={packageData.description} name='description'
                      onChange={handleInputChange}
                    ></textarea>
                  </form>
                </form>

              </Grid2>
            </Grid2>

            <div class='mt-8 mb-4'>
              <FormDivider title={'Package rewards'} />
            </div>
            <RewardItemTable
              packageData={packageData}
              setPackageData={setPackageData}
            />


          </DialogContentText>
        </DialogContent>
        <DialogActions className='!bg-gray-200'>
          <div className='w-[100%] flex items-center justify-start gap-1 px-5 py-2'>
            <button className='text-white bg-primary-green font-normal py-1 px-2 rounded' onClick={handleSubmit}>
              {selectedPackage ? 'Save changes' : 'Add package'}
            </button>
            <button className='text-white bg-red-800 font-normal py-1 px-2 rounded' onClick={() => setOpenModal(false)}>Cancel</button>
          </div>
        </DialogActions>
      </Dialog >
    </>
  );

}

export default PackageModal