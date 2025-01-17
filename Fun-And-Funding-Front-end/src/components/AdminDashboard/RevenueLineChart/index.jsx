import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import React, { useEffect, useRef, useState } from 'react';

function RevenueLineChart({ data }) {
    const [chartWidth, setChartWidth] = useState(600);
    const chartContainerRef = useRef(null);

    const transformedData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString("en-GB"),
        totalAmount: item.totalAmount,
    }));

    const xAxisData = transformedData.map(item => item.date);
    const seriesData = transformedData.map(item => item.totalAmount);

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current) {
                setChartWidth(chartContainerRef.current.offsetWidth);
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getDateRange = () => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        const formatDate = (date) =>
            date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

        return `${formatDate(oneMonthAgo)} - ${formatDate(today)}`;
    };

    return (
        <Paper
            elevation={3}
            ref={chartContainerRef}
            sx={{
                borderRadius: '0.625rem',
                pb: '2rem',
                pt: '1.5rem',
                px: '1.5rem',
                boxShadow:
                    '0px 2px 2px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
                mb: '2rem',
                height: 'fit-content',
                overflow: 'hidden',
            }}
        >
            <div className='flex flex-row justify-between items-center'>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'var(--grey)' }}>
                    Revenue Analysis
                    <Tooltip title={
                        <span>
                            Showing your platform revenue <br />
                            for the past month.
                        </span>
                    } arrow>
                        <IconButton
                            sx={{
                                color: 'var(--grey)',
                                '&:hover': {
                                    color: 'var(--black)',
                                },
                            }}
                            size="small"
                        >
                            <ErrorOutlineIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'var(--black)' }}>
                    {getDateRange()}
                </Typography>
            </div>
            <LineChart
                xAxis={[{ scaleType: 'band', data: xAxisData }]}
                yAxis={[{
                    scaleType: 'linear',
                    tickFormat: (value) => value.toLocaleString(),
                    min: 0,
                    axis: true,
                }]}
                series={[
                    {
                        data: seriesData,
                        area: true,
                        color: '#2f3645',
                        fillOpacity: 0.2
                    },
                ]}
                width={chartWidth}
                height={300}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                    mt: '1rem',
                    '& .MuiChart-root': {
                        overflow: 'visible',
                    },
                }}
            />
        </Paper>
    );
}

export default RevenueLineChart;
