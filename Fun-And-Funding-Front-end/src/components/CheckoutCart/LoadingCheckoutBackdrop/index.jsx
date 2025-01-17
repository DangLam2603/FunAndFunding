import { Backdrop, CircularProgress, Typography } from '@mui/material';
import React from 'react';

function LoadingCheckoutBackDrop({ isLoading, loadingStatus }) {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <div className='flex flex-col justify-center items-center gap-[1.5rem]'>
                <CircularProgress color="inherit" />
                {loadingStatus === 0 ? (
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: '500' }}>
                        Loading Project
                    </Typography>
                ) : loadingStatus === 1 ? (
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: '500' }}>
                        Updating
                    </Typography>
                ) : loadingStatus === 2 ? (
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: '500' }}>
                        Saving
                    </Typography>
                ) : loadingStatus === 3 ? (
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: '500' }}>
                        Checking
                    </Typography>
                ) : (
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: '500' }}>
                        Discarding
                    </Typography>
                )}
            </div>
        </Backdrop>
    )
}

export default LoadingCheckoutBackDrop;