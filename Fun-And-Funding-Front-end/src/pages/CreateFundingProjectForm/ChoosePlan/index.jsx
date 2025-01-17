import { Grid2 } from "@mui/material";
import ProjectPlanCard from "../../../components/CreateProject/ProjectPlanCard";
import "./index.css";
import { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoadingContext";
import commissionApiInstance from "../../../utils/ApiInstance/commisionApiInstance";

const ChoosePlan = () => {
  const [commissionFee, setCommissionFee] = useState();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    const fetchCommissionFee = async () => {
      setIsLoading(true);
      try {
        const type = 0; // funding fee
        const response = await commissionApiInstance.get(
          "/latest-commission-fee",
          {
            params: { type },
          }
        );
        setCommissionFee(response.data._data.rate);
      } catch (err) {
        console.error("Error fetching latest commission fee:", err);
      }
    };

    const fetchData = async () => {
      await fetchCommissionFee();
      setIsLoading(false);
    };

    fetchData();
  }, [setIsLoading]);

  return (
    <div className="bg-dark-green pb-[5rem] mt-[-6.4rem]">
      <div className="pt-[5rem]">
        <div className="h-[20rem] text-white flex justify-center items-center text-center leading-[6.5rem]">
          <span className="font1 text-[5rem]">
            Every innovation <br />
            has its{" "}
            <span className="font2 text-[8rem] text-primary-green">
              beginning
            </span>
          </span>
        </div>

        <Grid2 container spacing={5} className="flex justify-center mt-5">
          <Grid2 size={4}>
            <ProjectPlanCard
              option="Raise funds"
              title="Crowdfunding"
              brief="Launch your campaign, secure funding, and build community"
              bullets={[
                "Flexible funding options",
                "Robust campaign customization tools",
                "Dedicated campaign strategiests",
                "Tailored promo packages",
              ]}
              buttonText="Start your campaign"
              commission={`${commissionFee * 100}% of funds raised`}
            />
          </Grid2>
          {/* <Grid2 size={4}>
            <ProjectPlanCard
              option='2. Sell on Fun&Funding'
              title='Marketplace'
              brief='Sell ready-to-ship products on Fun&Funding and scale your business'
              bullets={['Sell on Fun&Funding, our curated marketplace', 'New audience access', 'Seamless transition from crowdfunding']}
              buttonText='Start selling'
              commission='10% of product sales'
            />
          </Grid2> */}
        </Grid2>
      </div>
    </div>
  );
};

export default ChoosePlan;
