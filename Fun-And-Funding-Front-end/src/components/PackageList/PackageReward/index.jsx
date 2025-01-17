import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Backdrop, CircularProgress } from '@mui/material';
import kuru from '../../../assets/images/ktm.jpg';
import './index.css';
import PackageItem from './PackageItem';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
const PackageReward = ({ packageList, reloadDetail, isButtonActive }) => {
  const token = Cookies.get("_auth");

  const number = 30000000;
  const [donatedMoney, setDonatedMoney] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleDonateFree = async (item) => {
    let donateBody = {
      packageId: item.id,
      donateAmount: donatedMoney,
    };

    try {
      await axios
        .post("https://localhost:7044/api/package-backers", donateBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          Swal.fire({
            title: "Donation Success",
            text: "Thank you for your donation!",

            icon: "success",
          });
          reloadDetail();
        });
    } catch (error) {
      setIsLoading(false);
      if (error.status === 401) {

        Swal.fire({
          title: "Donation Failed",
          text: "Please Login in Backer role",
          icon: "error"
        })
      } else {
        Swal.fire({
          title: "Donation Failed",
          text: error.response.data._message,
          icon: "error"
        })
      }
      console.log(error);
    }
  };

  const handlePackageDonate = async (item) => {
    setIsLoading(true);
    let donateBody = {
      userId: "b3523de5-f1d2-4cc9-8306-fa4c0ec6d28c",
      packageId: item.id,
      donateAmount: item.requiredAmount,
    };

    console.log(donateBody);
    try {
      await axios
        .post("https://localhost:7044/api/package-backers", donateBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          Swal.fire({
            title: "Donation Success",
            text: "Thank you for your donation!",

            icon: "success",
          });
          reloadDetail();
        });
    } catch (error) {
      setIsLoading(false);
      if (error.status === 401) {

        Swal.fire({
          title: "Donation Failed",
          text: "Please Login in Backer role",
          icon: "error"
        })
      } else {
        Swal.fire({
          title: "Donation Failed",
          text: error.response.data._message,
          icon: "error"
        })
      }
      console.log(error);
    }

    console.log("abcd");
  };
  const sortedPackageList = packageList.sort((a, b) => {
    // First, check if either packageType is 0
    if (a.packageTypes === 0 && b.packageType !== 0) {
      return -1; // a comes before b
    } else if (a.packageTypes !== 0 && b.packageType === 0) {
      return 1; // b comes before a
    } else {
      // If both packageType are not 0, sort by ascending order of packageType
      return a.packageTypes - b.packageTypes;
    }
  });
  return (
    <div>
      <Grid
        container
        spacing={5}
      // sx={{ marginTop: "78px", marginBottom: "100px" }}
      >
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 100,
          }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {sortedPackageList.map((item, index) => (
          <>
            {item.packageTypes == 0 ? (
              <Grid size={6} sx={{ overflowY: "auto" }}>
                <div className="border-2 border-gray-300 p-4 rounded h-[28rem]">
                  <div className="flex items-center">
                    <div className="package-image rounded overflow-hidden flex justify-center items-center bg-gray-200">
                      <img src="https://i.ibb.co/z6VfqjK/heart.png" className=' !w-[8rem] !h-[8rem]' />
                    </div>
                    <Box sx={{ width: "50%" }}>
                      <div className='text-lg font-bold'>{item.name}</div>
                      <div className="text-sm text-gray-500 mt-2">{item.description}</div>
                    </Box>
                  </div>
                  <div className='mt-5 w-[70%] mx-auto'>
                    <div >
                      <Box sx={{ width: "100%" }}>
                        <TextField
                          fullWidth
                          type='number'
                          id="input-with-icon-adornment"
                          value={donatedMoney}
                          onChange={(e) => setDonatedMoney(e.target.value)}
                          onWheel={(e) => { e.target.blur() }}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Box>VND</Box>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Box>
                    </div>
                    <button
                      className="bg-primary-green text-white font-semibold py-2 w-[100%] rounded uppercase mt-5 hover:cursor-pointer"
                      disabled={isButtonActive}
                      onClick={() => handleDonateFree(item)}
                    >
                      Pledge
                    </button>
                  </div>
                </div>
              </Grid>
            ) : (
              <Grid key={index} size={6} sx={{ overflowY: "auto" }} className="border-2 rounded border-gray-300" spacing={5}>
                <div className=" p-4 rounded min-h-[25rem]">
                  <div className="flex">
                    <div className="package-image rounded overflow-hidden">
                      <img src={item.url} />
                    </div>
                    <Box sx={{ width: "50%" }}>
                      <div className='text-lg font-bold'>{item.name}</div>
                      <div className="text-3xl font-semibold text-primary-green my-2">
                        {item.requiredAmount.toLocaleString("de-DE")} vnd
                      </div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                      <div className="mt-5">
                        <span className="font-bold">
                          {item.limitQuantity}{" "}
                        </span>
                        <span className="">packages left</span>
                      </div>
                      <button
                        className="bg-primary-green text-white font-semibold py-2 w-[100%] rounded uppercase mt-5 hover:cursor-pointer"
                        disabled={isButtonActive}
                        onClick={() => handlePackageDonate(item)}
                      >
                        Pledge
                      </button>
                    </Box>
                  </div>
                  <div className="my-[1.5rem] font-semibold text-lg">This package consists of</div>
                  <div className="package-item ">
                    <Grid container spacing={5}>
                      {item.rewardItems.map((rItem, index) => (
                        <Grid size={6}>
                          <PackageItem item={rItem} />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </div>
              </Grid>
            )}
          </>
        ))}
      </Grid>
    </div>
  );
};

export default PackageReward;
