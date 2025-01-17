import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';
const MarketBarChart = ({ x, y}) => {
    console.log(x, y);
  return (
    <Box sx={{ borderRadius : '10px', padding: '10px', marginBottom : '20px'
      ,boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
     }}>
      <Typography>Coupons</Typography>
      <BarChart
        xAxis={[{ scaleType: 'band', data: x }]}
        series={[{ data: y }]}
        width={500}
        height={300}
      />
    </Box>

  )
}

export default MarketBarChart;