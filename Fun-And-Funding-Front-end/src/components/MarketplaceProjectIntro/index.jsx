import { Box, Typography } from '@mui/material'
import React from 'react'
const MarketplaceProjectIntro = ({ intro }) => {
  return (
    <Box>
      <Box className="max-w-[calc(1600px-8rem)]">
        {intro ? <div dangerouslySetInnerHTML={{ __html: intro }} /> : <Typography>Project Introduction for this project has not been published</Typography>}
      </Box>
    </Box>
  )
}

export default MarketplaceProjectIntro
