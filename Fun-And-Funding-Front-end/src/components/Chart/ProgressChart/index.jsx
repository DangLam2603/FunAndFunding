import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import { Box } from '@mui/material';
const ProgressChart = ({ balance, target }) => {
    const progress = (balance / target) * 100; // Calculate progress percentage
    const remaining = 100 - progress;          // Calculate remaining percentage
    console.log(progress, remaining)
    return (
        <Box sx={{ borderRadius : '10px', padding: '10px', marginBottom : '20px'
            ,boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
           }}>
            <PieChart
                series={[
                    {
                        data: [
                            { id: 0, value: progress, label: 'Progress' },
                            { id: 1, value: remaining, label: 'Remaining' },
                        ],
                        innerRadius: 30,     // Creates a donut-style chart
                        //   outerRadius: 1,       // Controls the size of the pie
                    },
                ]}
                width={400}
                height={200}
            />
        </Box>
    );
}

export default ProgressChart
