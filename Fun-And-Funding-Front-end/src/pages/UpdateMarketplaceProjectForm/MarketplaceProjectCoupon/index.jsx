/* eslint-disable no-unused-vars */
import { Box, Button, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CouponsTable from "../../../components/CouponsTable";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import couponApiInstace from "../../../utils/ApiInstance/couponApiInstance";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useLoading } from "../../../contexts/LoadingContext";
import empty from "../../../assets/images/image_empty.png";

const MarketplaceProjectCoupon = () => {
  const [data, setData] = useState([]);
  const [couponFile, setCouponFile] = useState(null);
  const { id } = useParams();
  const { isLoading, setIsLoading } = useLoading();
  const token = Cookies.get("_auth");

  const fetchData = async () => {
    try {
      const response = await couponApiInstace.get(`/all/${id}`);
      console.log(response.data);
      setData(response.data._data);
    } catch (error) {
      console.log(error);
    }
  };

  const mappingData = data.map((item) => ({
    Id: item.id,
    "Coupon Key": item.couponKey,
    "Coupon Name": item.couponName,
    "Discount Rate": item.discountRate,
    Status: item.status === 1 ? "Enabled" : "Disabled",
  }));

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCouponFile(file);
      console.log(file);
      e.target.value = null;
    }
  };

  const handleSave = async () => {
    if (couponFile) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("formFile", couponFile);

      try {
        const response = await couponApiInstace.post(
          `?projectId=${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Success",
            text: "The coupons are imported successfully",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });

          fetchData();
          setCouponFile(null);
        }
      } catch (error) {
        console.log(error);
        if (error.response) {
          Swal.fire({
            title: "Error",
            text: "Import file failed",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="m-2 p-4">
        <p className="text-gray-500 text-l mb-2 px-[3rem]">
          Download template{" "}
          <span>
            <a
              href="https://funfundingmediafiles.blob.core.windows.net/fundingprojectfiles/CouponFileTemplate_149c720d-a6cc-44d0-9124-b80db1b55976.xlsx"
              style={{ color: "var(--primary-green)", fontWeight: "500" }}
            >
              here
            </a>
          </span>
        </p>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            paddingX: "3rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <input
              type="file"
              onChange={(e) => handleFileChange(e)}
              style={{ display: "none" }}
              id="file-input"
            />
            <Button
              variant="contained"
              onClick={() => document.getElementById("file-input").click()}
              sx={{
                backgroundColor: "#1BAA64",
                textTransform: "none",
                fontWeight: "600",
              }}
              startIcon={<AddCircleIcon />}
            >
              Import File
            </Button>
            <a href={couponFile ? URL.createObjectURL(couponFile) : ""}>
              {couponFile ? couponFile.name : ""}
            </a>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={() => {
                handleSave();
              }}
              sx={{
                backgroundColor: "#1BAA64",
                textTransform: "none",
                fontWeight: "600",
                display: `${couponFile ? "block" : "none"}`,
              }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {mappingData && mappingData.length > 0 ? (
          <CouponsTable data={mappingData} />
        ) : (
          <>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={empty} className="h-[10rem] mb-[2rem]"></img>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "500",
                  color: "#2F3645",
                  mt: "2rem",
                }}
              >
                No coupons.
              </Typography>
            </Box>
          </>
        )}
      </div>
    </>
  );
};

export default MarketplaceProjectCoupon;
