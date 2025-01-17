import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';
const MarketLineChart = ({ apiData }) => {

  // Preprocess the data: filter, map, and format the y-axis values as strings
  const validData = apiData
    .filter(entry => entry.createdDate && typeof entry.totalAmount === 'number')
    .map(entry => ({
      x: new Date(entry.createdDate).toLocaleDateString('en-GB'), // Use the date string directly from the API
      y: entry.totalAmount, // Format the y-axis value as a string
    }));

  const xAxisData = validData.map(entry => entry.x);
  const seriesData = validData.map(entry => entry.y);

  console.log("xAxisData (raw date strings):", xAxisData);
  console.log("seriesData (formatted):", seriesData);

  return (
    <Box sx={{ borderRadius : '10px', padding: '10px', marginBottom : '20px'
      ,boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
     }}>
        <Typography>Orders Transactions By Date</Typography>
      <LineChart
        xAxis={[{ scaleType: 'band', data: xAxisData }]}
        series={[
          {
            data: seriesData,
            area: true,
            color: '#1BAA64',
            fillOpacity: 0.2
          },
        ]}
        width={600}
        height={300}
        grid={{ vertical: true, horizontal: true }}
      />

    </Box>


  );
};

export default MarketLineChart;