import { Box, Divider, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import OwnerProjectCard from "../../components/UserProjectCard/OwnerProjectCard";
import PublicProjectCard from "../../components/UserProjectCard/PublicProjectCard";
import { useLoading } from "../../contexts/LoadingContext";
import fundingProjectApiInstance from "../../utils/ApiInstance/fundingProjectApiInstance";
import marketplaceProjectApiInstance from "../../utils/ApiInstance/marketplaceProjectApiInstance";
import userApiInstance from "../../utils/ApiInstance/userApiInstance";

function AccountProject() {
  const { isLoading, setIsLoading } = useLoading();
  const token = Cookies.get("_auth");
  const [user, setUser] = useState({});
  const [role, setRole] = useState("Backer");
  const [gameOwnerFundingProject, setGameOwnerFundingProject] = useState([]);
  const [gameOwnerMarketplaceProject, setGameOwnerMarketplaceProject] =
    useState([]);
  const [backerDonationProject, setBackerDonationProject] = useState([]);
  const [backerPurchaseProject, setBackerPurchaseProject] = useState([]);
  const [searchOwnerFundingProject, setSearchOwnerFundingProject] =
    useState("");
  const [searchDonationProject, setSearchDonationProject] = useState("");
  const [searchOwnerMarketplaceProject, setSearchOwnerMarketplaceProject] =
    useState("");
  const [searchPurchaseProject, setSearchPurchaseProject] = useState("");
  const [selectedSortOptions, setSelectedSortOptions] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [token]);

  useEffect(() => {
    fetchGameOwnerFundingProject(searchOwnerFundingProject);
  }, [searchOwnerFundingProject]);

  useEffect(() => {
    fetchBackerDonationProject(searchDonationProject);
  }, [searchDonationProject]);

  useEffect(() => {
    fetchGameOwnerMarketplaceProject(searchOwnerMarketplaceProject);
  }, [searchOwnerMarketplaceProject]);

  useEffect(() => {
    fetchBackerPurchaseProject(searchPurchaseProject);
  }, [searchPurchaseProject]);

  const handleOwnerProjectSearchChange = (value) => {
    setSearchOwnerFundingProject(value);
  };

  const handleDonationProjectSearchChange = (value) => {
    setSearchDonationProject(value);
  };

  const sortOptions = ["Draft", "Funding", "Marketing"];
  const handleSortChange = (values) => {
    setSelectedSortOptions(values);
  };

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await userApiInstance.get(`/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data._statusCode == 200) {
        setUser(res.data._data);
        fetchUserRole(res.data._data.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRole = async (id) => {
    try {
      const res = await userApiInstance.get(`user-role/${id}`);
      if (res.data._statusCode == 200) {
        setRole(res.data._data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGameOwnerFundingProject = async (searchOwnerFundingProject) => {
    try {
      const res = await fundingProjectApiInstance.get(`/game-owner-projects`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageSize: 999999,
          pageIndex: 1,
        },
      });
      if (res.data._statusCode == 200) {
        setGameOwnerFundingProject(res.data._data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBackerDonationProject = async () => {
    try {
      const res = await fundingProjectApiInstance.get(
        `/backer-donation-projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            pageSize: 999999,
            pageIndex: 1,
          },
        }
      );
      if (res.data._statusCode == 200) {
        setBackerDonationProject(res.data._data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGameOwnerMarketplaceProject = async () => {
    try {
      const res = await marketplaceProjectApiInstance.get(
        `/game-owner-projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            pageSize: 999999,
            pageIndex: 1,
          },
        }
      );
      if (res.data._statusCode == 200) {
        setGameOwnerMarketplaceProject(res.data._data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBackerPurchaseProject = async (searchPurchaseProject) => {
    try {
      const res = await marketplaceProjectApiInstance.get(
        `/backer-purchase-projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            pageSize: 999999,
            pageIndex: 1,
          },
        }
      );
      if (res.data._statusCode == 200) {
        console.log(res.data._data);
        setBackerPurchaseProject(res.data._data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pl-[4rem] pr-[5.5rem] mt-[2rem] mb-[4rem]">
      {role == "GameOwner" ? (
        <>
          <div className="w-[100%] mb-[4rem]">
            <div className="flex justify-start gap-[1rem] items-start flex-col mb-[4rem]">
              <h1 className="!text-[1.5rem] text-left font-bold text-[#2F3645]">
                Your Funding Project
              </h1>
              <Typography
                sx={{
                  color: "#2F3645",
                  fontSize: "1rem",
                  fontWeight: "400",
                  userSelect: "none",
                  width: "85%",
                }}
              >
                Track and manage your crowdfunding projects, monitor progress,
                and engage with supporters to bring your ideas to life.
              </Typography>
            </div>
            {gameOwnerFundingProject != null &&
              gameOwnerFundingProject.length > 0 ? (
              gameOwnerFundingProject.map((project, index) => (
                <div key={index}>
                  <OwnerProjectCard
                    project={project}
                    projectType={"Funding"}
                    fetchProjectData={fetchGameOwnerFundingProject}
                  />
                  {index !== gameOwnerFundingProject.length - 1 && (
                    <Divider sx={{ my: "1.5rem" }} />
                  )}
                </div>
              ))
            ) : (
              <Typography>Nothing to show</Typography>
            )}
          </div>
          <Box>
            <div className="my-[4rem]">
              <Divider
                sx={{ border: "1px solid #EAEAEA", borderRadius: "0.625rem" }}
              />
            </div>
          </Box>
          <div className="w-[100%]">
            <div className="flex justify-start gap-[1rem] items-start flex-col mb-[4rem]">
              <h1 className="!text-[1.5rem] text-left font-bold text-[#2F3645]">
                Your Marketplace Project
              </h1>
              <Typography
                sx={{
                  color: "#2F3645",
                  fontSize: "1rem",
                  fontWeight: "400",
                  userSelect: "none",
                  width: "85%",
                }}
              >
                Manage the details, content, and updates for your marketplace
                projects, ensuring they are ready for the audience.
              </Typography>
            </div>
            {gameOwnerMarketplaceProject != null &&
              gameOwnerMarketplaceProject.length > 0 ? (
              gameOwnerMarketplaceProject.map((project, index) => (
                <div key={index}>
                  <OwnerProjectCard
                    project={project}
                    projectType={"Marketplace"}
                    fetchProjectData={fetchGameOwnerMarketplaceProject}
                  />
                  {index !== gameOwnerMarketplaceProject.length - 1 && (
                    <Divider sx={{ my: "1.5rem" }} />
                  )}
                </div>
              ))
            ) : (
              <Typography>Nothing to show</Typography>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="w-[100%]">
            <div className="flex justify-start gap-[1rem] items-start flex-col mb-[4rem]">
              <h1 className="!text-[1.5rem] text-left font-bold text-[#2F3645]">
                All Donated Funding Projects
              </h1>
              <Typography
                sx={{
                  color: "#2F3645",
                  fontSize: "1rem",
                  fontWeight: "400",
                  userSelect: "none",
                  width: "85%",
                }}
              >
                View and track all the funding projects you’ve supported,
                including their updates and achievements.
              </Typography>
            </div>
            {backerDonationProject != null &&
              backerDonationProject.length > 0 ? (
              backerDonationProject.map((project, index) => (
                <div key={index}>
                  <PublicProjectCard
                    project={project}
                    projectType={"Funding"}
                  />
                  {index !== backerDonationProject.length - 1 && (
                    <Divider sx={{ my: "1.5rem" }} />
                  )}
                </div>
              ))
            ) : (
              <Typography>Nothing to show</Typography>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AccountProject;
