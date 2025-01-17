import { Box, Typography } from '@mui/material'
import React from 'react'
const PackageItem = ({ item }) => {
  return (
    <>
      <div className="bg-gray-200 rounded-lg flex items-center py-2 px-3 gap-3">
        <Box className='reward-image'>
          {item.imageUrl ? (<img src={item.imageUrl} style={{ width: '40px', height: '40px' }} />) : (<img className='w-[1.5rem] h-[1.5rem]' src="https://i.ibb.co/ZBwT1V2/gift.png" />)}
        </Box>
        <Box>
          <div className='text-xs'>
            {item.name}
          </div>
          <div className='font-semibold text-[.6rem] text-primary-green'>{item.quantity} item(s)</div>
        </Box>
      </div>
    </>
  )
}

export default PackageItem