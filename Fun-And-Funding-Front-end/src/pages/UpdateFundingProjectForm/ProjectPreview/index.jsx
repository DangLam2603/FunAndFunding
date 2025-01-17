import React, { useState, useEffect } from 'react'
import fundingProjectApiInstance from '../../../utils/ApiInstance/fundingProjectApiInstance';
import { useParams } from 'react-router';
import { Backdrop, CircularProgress } from '@mui/material';
import ProgressChart from '../../../components/Chart/ProgressChart';
import LineChartDashBoard from '../../../components/Chart/LineChartDashboard/index.jsx';
import packageBackerApiInstance from '../../../utils/ApiInstance/packageBackerApiInstance';
import StatBox from '../../../components/Chart/StatBox/index.jsx';
import { FaWallet, FaEnvelope } from "react-icons/fa";
import Grid from '@mui/material/Grid2';
import BarChartDashboard from '../../../components/Chart/BarChartDashboard/index.jsx';
import transactionApiInstance from '../../../utils/ApiInstance/transactionApiInstance';
import projectMilestoneApiInstace from '../../../utils/ApiInstance/projectMilestoneApiInstance.jsx';
import TransactionTable from '../../../components/TransactionTable/index.jsx';
import { FaUser } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
function ProjectPreview() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lineData, setLineData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [transactionData, setTransactionData] = useState([]);
    const [backerCount, setBackerCount] = useState(0);
    const [secondMilestone, setSecondMilestone] = useState(null);
    useEffect(() => {
        getProject();
        console.log("a")
    }, [])
    const getSecondMilestone = async (id) => {
        await projectMilestoneApiInstace.get(`/milestones-disbursement?projectId=${id}`).then(res => {
            console.log(res)
            if(res.data._data.length > 0){
                const secMile = res.data._data.filter(m => m.milestone.milestoneOrder == 2);
            console.log(secMile)
            setSecondMilestone(secMile);
            }

            
        })
    }
    // fetch project data
    const getProject = async () => {
        setLoading(true);
        try {
            const response = await fundingProjectApiInstance.get(`/${id}`)
            setProject(response.data._data);
            console.log(response.data);
            fetchLineChart(response.data._data.id);
            fetchBarData(response.data._data.id);
            fetchTransaction(response.data._data.id);
            getSecondMilestone(response.data._data.id)
        } catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }
    //fetch line chart data
    const fetchLineChart = async (projectId) => {
        try {
            const res = await packageBackerApiInstance.get(`/project-backers?projectId=${projectId}`);
            console.log(res);
            setBackerCount(res.data.result._data.length);
            setLineData(res.data.result._data);
        } catch (error) {
            console.error('Error fetching line chart data:', error);
        }
    };
    //fetch bar data
    const fetchBarData = async (projectId) => {
        try {
            const res = await packageBackerApiInstance.get(`/package-backer-count?projectId=${projectId}`);
            console.log(res);
            setBarData(res.data.result._data);
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    }
    //fetch transaction data
    const fetchTransaction = async () => {
        try {
            const res = await transactionApiInstance.get(`?projectId=${id}`);
            console.log(res);
            setTransactionData(res.data._data)
        } catch (error) {
            console.error('Error fetching transaction data:', error);
        }
    }
    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* statbox */}
            {project && (
                <>
                    <Grid container spacing={6} justifyContent="center" m="2rem">
                        <Grid item xs={12} sm={6} md={3}>
                            <StatBox
                                title={project.wallet.balance.toLocaleString("en-US")}
                                subtitle="Wallet Balance"
                                increase="+21%"
                                icon={<FaWallet size={26} />}
                                withdraw={project.hasBeenWithdrawed}
                                render={getProject}
                                pmId={secondMilestone && secondMilestone[0].id}
                            />

                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatBox
                                title={backerCount || 0}
                                subtitle="Backers"
                                icon={<FaUser size={26} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatBox
                                title={(project.balance - project.wallet.balance).toLocaleString("en-US")}
                                subtitle="Transfered Amount"
                                icon={<MdOutlineAttachMoney size={26} />}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justifyContent={"center"} m="2rem">
                        <Grid sx={8}>
                            <LineChartDashBoard apiData={lineData} />
                            <TransactionTable transactions={transactionData} />
                        </Grid>
                        <Grid sx={4}>
                            <BarChartDashboard data={barData} />
                            <ProgressChart balance={project.balance} target={project.target} />
                        </Grid>

                    </Grid>

                </>
            )}
        </>

    )
}

export default ProjectPreview