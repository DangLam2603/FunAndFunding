import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import kuru from '../../../assets/images/ktm.jpg';
import PackageItem from '../PackageReward/PackageItem';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    boxShadow: 24,
    // p: 4,
    overflow: 'auto'
};

const PackageModal = ({ open, handleClose, item, onDonate, isButtonActive }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="package-reward !min-h-[70vh]" sx={style}>
                <div className='bg-primary-green px-5 py-3 font-semibold text-gray-100 uppercase'>Package detail</div>
                <Box sx={{ display: 'flex', padding: '2rem' }} >
                    <Box className='package-image' sx={{ width: '50%', objectFit: 'contain', background: 'rgba(0, 0, 0, 0.1)', borderRadius: '.3rem' }}>
                        <img src={item.url} className='object-contain' />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>{item.name}</Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: '700', color: '#1BAA64', marginTop: '10px' }}>
                            {item.requiredAmount.toLocaleString('de-DE')}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', fontWeight: '400', opacity: 0.5, marginTop: '10px' }}>
                            {item.description}
                        </Typography>
                        <Typography sx={{ fontSize: '16px', fontWeight: '700', marginTop: '10px' }}>
                            {item.limitQuantity} <span style={{ fontWeight: '400' }}>are left</span>
                        </Typography>
                        <Button sx={{
                            width: "100%", whiteSpace: "nowrap"
                            , background: "#1BAA64", fontWeight: "bold", py: 1,
                            borderRadius: '8px', color: '#FFFFFF', marginTop: '10px'
                        }}
                            disabled={isButtonActive}
                            className='pledge-btn'
                            onClick={() => onDonate()}>
                            Pledge
                        </Button>
                    </Box>
                </Box>
                <Divider>
                    <span className='text-gray-600 text-lg font-semibold'>
                        This package consists of
                    </span>
                </Divider>
                <Box className='package-item' sx={{ paddingX: '34px', paddingY: '24px' }}>
                    <Grid container spacing={2}>
                        {item.rewardItems.map((rItem, index) => (
                            <Grid size={6}>
                                <PackageItem item={rItem} />
                            </Grid>
                        ))}
                    </Grid>

                </Box>
            </Box>
        </Modal>
    );
};

export default PackageModal;