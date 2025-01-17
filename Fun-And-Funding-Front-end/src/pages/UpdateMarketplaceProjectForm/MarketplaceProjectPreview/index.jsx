import { Backdrop, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { RiBillLine, RiCoupon5Fill } from "react-icons/ri";
import { useParams } from "react-router";
import MarketBarChart from "../../../components/Chart/MarketBarChart/index.jsx";
import MarketLineChart from "../../../components/Chart/MarketLineChart/index.jsx";
import StatBox from "../../../components/Chart/StatBox/index.jsx";
import MarketTransactionTable from "../../../components/TransactionTable/MarketTransactionTable/index.jsx";
import { useUpdateMarketplaceProject } from "../../../contexts/UpdateMarketplaceProjectContext.jsx";
import couponApiInstace from "../../../utils/ApiInstance/couponApiInstance.jsx";
import orderApiInstace from "../../../utils/ApiInstance/orderApiInstance.jsx";
import transactionApiInstace from "../../../utils/ApiInstance/transactionApiInstance.jsx";
function MarketplaceProjectPreview() {
  const { id } = useParams();
  const { marketplaceProject, setMarketplaceProject, edited, setEdited } =
    useUpdateMarketplaceProject();
  const [loading, setLoading] = useState(false);
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [couponCount, setCouponCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [activeCoupons, setActiveCoupons] = useState(0);
  const [transactions, setTransactions] = useState([]);
  //fetch line chart data
  const fetchLineChart = async (projectId) => {
    try {
      const res = await orderApiInstace
        .get(`group-orders?id=${projectId}`)
        .then((res) => {
          console.log(res);
          setLineData(res.data._data);
          setOrdersCount(res.data._data.length);
        });
    } catch (error) {
      console.error("Error fetching line chart data:", error);
    }
  };
  console.log(marketplaceProject);
  //fetch bar data

  const fetchCoupon = async (projectId) => {
    try {
      const res = await couponApiInstace.get(`all/${projectId}`);
      setCouponCount(res.data._data.length);
      const activeCoupons =
        res.data._data.length > 0
          ? coupons.filter((coupon) => coupon.status === 1)
          : [];
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };
  const fetchTransaction = async (projectId) => {
    try {
      const res = await transactionApiInstace.get(`marketplace-transaction?marketId=${projectId}`)
      console.log(res)
      setTransactions(res.data.result._data)
    } catch (error) {

    }
  }
  const couponsXAxis = ["Active", "Total"];
  useEffect(() => {
    fetchLineChart(id);
    fetchCoupon(id);
    fetchTransaction(id)
  }, [marketplaceProject]);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* statbox */}
      {marketplaceProject && (
        <>
          <Grid container spacing={4} justifyContent="center" m="2rem">
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                title={marketplaceProject.wallet.balance.toLocaleString(
                  "en-US"
                )}
                subtitle="Wallet Balance"
                increase="+21%"
                icon={<FaWallet size={26} />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                title={couponCount}
                subtitle="Total Coupons"
                icon={<RiCoupon5Fill size={26} />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                title={ordersCount}
                subtitle="Total Orders"
                icon={<RiBillLine size={26} />}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"center"} m="2rem">
            <Grid sx={8}>
              <MarketLineChart apiData={lineData} />

              <MarketTransactionTable transactions={transactions} />
            </Grid>
            <Grid sx={4}>
              <MarketBarChart
                x={couponsXAxis}
                y={[activeCoupons, couponCount]}
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export default MarketplaceProjectPreview;
