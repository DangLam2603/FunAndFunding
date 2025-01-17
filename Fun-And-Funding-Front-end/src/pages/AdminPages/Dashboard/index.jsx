import CachedIcon from '@mui/icons-material/Cached';
import { Button, Grid2, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import CategoryTable from '../../../components/AdminDashboard/CategoryTable';
import PlatformRevenue from '../../../components/AdminDashboard/PlatformRevenue';
import RevenueLineChart from '../../../components/AdminDashboard/RevenueLineChart';
import StatisticCard from '../../../components/AdminDashboard/StatisticCard';
import TransactionTable from '../../../components/AdminDashboard/TransactionTable';
import { useLoading } from '../../../contexts/LoadingContext';
import dashboardApiInstance from "../../../utils/ApiInstance/dashboardApiInstance";
import systemWalletApiInstance from "../../../utils/ApiInstance/systemWalletApiInstance";


const Dashboard = () => {
  const token = Cookies.get("_auth");
  const { isLoading, setIsLoading } = useLoading();

  const [platformRevenue, setPlatformRevenue] = useState(0);
  const [platformStatistic, setPlatformStatistic] = useState({});

  const [accountStatistic, setAccountStatistic] = useState([]);
  const [fundingStatistic, setFundingStatistic] = useState([]);
  const [milestoneStatistic, setMilestoneStatistic] = useState([]);
  const [gameStatistic, setGameStatistic] = useState([]);

  const [transactionStatistic, setTransactionStatistic] = useState([]);
  const [categoryStatistic, setCategoryStatistic] = useState([]);
  const [incomeStatistic, setIncomeStatistic] = useState([]);

  useEffect(() => {
    fetchData();
  }, [setIsLoading]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response1 = await systemWalletApiInstance.get('/platform-revenue');
      const response2 = await dashboardApiInstance.get('/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response3 = await dashboardApiInstance.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response4 = await dashboardApiInstance.get('/funding-projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response5 = await dashboardApiInstance.get('/milestones', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response6 = await dashboardApiInstance.get('/marketplace-projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response7 = await dashboardApiInstance.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response8 = await dashboardApiInstance.get('/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response9 = await dashboardApiInstance.get('/income', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const [data1, data2, data3, data4, data5, data6, data7, data8, data9] = await Promise.all([response1, response2, response3, response4, response5, response6, response7, response8, response9]);

      if (data1.data._statusCode === 200) {
        setPlatformRevenue(data1.data._data);
      }
      if (data2.data._statusCode === 200) {
        setPlatformStatistic(data2.data._data);
      }
      if (data3.data._statusCode === 200) {
        setAccountStatistic(data3.data._data);
      }
      if (data4.data._statusCode === 200) {
        setFundingStatistic(data4.data._data);
      }
      if (data5.data._statusCode === 200) {
        setMilestoneStatistic(data5.data._data);
      }
      if (data6.data._statusCode === 200) {
        setGameStatistic(data6.data._data);
      }
      if (data7.data._statusCode === 200) {
        setCategoryStatistic(data7.data._data);
      }
      if (data8.data._statusCode === 200) {
        setTransactionStatistic(data8.data._data.items);
      }
      if (data9.data._statusCode === 200) {
        setIncomeStatistic(data9.data._data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-[2rem] my-8">
      <div className="flex justify-between flex-row items-center">
        <div className="flex flex-col">
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, mb: '0.5rem' }}>Welcome, Administrator</Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 400, mb: '0.5rem' }}>Track your website usage and components today</Typography>
        </div>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1BAA64", textTransform: "none", fontWeight: "700" }}
          startIcon={<CachedIcon />}
          onClick={fetchData}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>
      <Grid2 container columnSpacing={4} rowSpacing={3} sx={{ mt: '2rem' }}>
        <Grid2 size={8}>
          <>
            <Grid2 container columnSpacing={2} rowSpacing={0}>
              <Grid2 size={8}>
                <PlatformRevenue platformRevenue={platformRevenue} platformStatistic={platformStatistic} />
              </Grid2>
              <Grid2 size={4} height={"100%"}>
                <StatisticCard content={"Accounts"} data={accountStatistic} description={"Show numbers of accounts in corresponding roles "} />
              </Grid2>
              <Grid2 size={4}>
                <StatisticCard content={"Crowdfunding"} data={fundingStatistic} description={"Show numbers of crowdfunding projects in the system "} />
              </Grid2>
              <Grid2 size={4}>
                <StatisticCard content={"Milestones"} data={milestoneStatistic} description={"Show numbers of milestones proceeded in the system "} />
              </Grid2>
              <Grid2 size={4}>
                <StatisticCard content={"Marketplace"} data={gameStatistic} description={"Show numbers of games published in the system "} />
              </Grid2>
              <Grid2 size={12}>
                <RevenueLineChart data={incomeStatistic} />
              </Grid2>
            </Grid2>
          </>
        </Grid2>
        <Grid2 size={4}>
          <TransactionTable data={transactionStatistic} />
          <CategoryTable data={categoryStatistic} />
        </Grid2>
      </Grid2>
    </div>
  )

}

export default Dashboard