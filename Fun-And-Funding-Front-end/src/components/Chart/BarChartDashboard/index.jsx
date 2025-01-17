import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';
const BarChartDashboard = ({ data }) => {
  console.log(data)
  // Extract xAxis and yAxis data
  const xAxis = data.map(item => item.packageName); // ["Package 1", "Non-package support", "Premium Package"]
  const yAxis = data.map(item => item.count);
  console.log(xAxis);
  console.log(yAxis);
  return (
    <Box sx={{ borderRadius : '10px', padding: '10px', marginBottom : '20px'
      ,boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
     }}>
      <Typography>Top donation packages</Typography>
      <BarChart
        xAxis={[{ scaleType: 'band', data: xAxis }]}
        series={[{ data: yAxis }]}
        width={500}
        height={300}
      />
    </Box>

  )
}

export default BarChartDashboard