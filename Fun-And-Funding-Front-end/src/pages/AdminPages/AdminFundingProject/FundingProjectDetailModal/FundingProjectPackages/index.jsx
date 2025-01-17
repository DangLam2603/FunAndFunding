import { Box, Button, CircularProgress, Dialog, Grid2, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { IoIosPricetag } from "react-icons/io";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import NoImage from "../../../../../assets/images/no-image.png";

function FundingProjectPackages({ packages }) {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };

    const handleClickOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
    }

    const handleClose = () => {
        setSelectedItem({});
        setOpen(false);
    };

    return (
        <div className='w-full'>
            {packages != null ? (
                <Grid2 container columnSpacing={2} rowSpacing={2} sx={{ width: '100%', mb: '2rem' }}>
                    {packages.filter(p => p.packageTypes != 0).map((item, index) => <Grid2 size={6}>
                        <Paper
                            key={index}
                            sx={{
                                width: '100%',
                                p: '1rem',
                                height: '100%',
                                borderRadius: '0.625rem',
                                boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)'
                            }}
                            elevation={3}
                        >
                            <Grid2 container columnSpacing={3} alignItems="center">
                                <Grid2 size={4.5}>
                                    <div className="overflow-hidden flex justify-start items-center w-fit">
                                        <img class=" object-cover rounded-[0.625rem] h-[8.5rem]" alt="Package image" src={item.url} />
                                    </div>
                                </Grid2>
                                <Grid2 size={7.5}>
                                    <Typography sx={{ fontSize: '1.25rem', fontWeight: '700', mb: '0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        {item.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: '500', mb: '0.5rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        {item.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}>
                                            <MdOutlineProductionQuantityLimits />: {item.limitQuantity}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}>
                                            <IoIosPricetag />: {formatPrice(item.requiredAmount)} <span className="text-[0.625rem] ml-1 pt-[0.125rem]">VND</span>
                                        </Typography>
                                    </Box>
                                    <Button variant='contained' sx={{ textTransform: 'none', backgroundColor: 'var(--primary-green)', fontSize: '0.75rem', fontWeight: '600', width: '100%' }} onClick={() => handleClickOpen(item.rewardItems)}>
                                        Show reward items
                                    </Button>
                                </Grid2>
                            </Grid2>
                        </Paper>
                    </Grid2>)}
                </Grid2>
            ) : (
                <Typography>No package found</Typography>
            )}
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '30rem',
                        maxWidth: '30rem',
                        p: '2rem',
                    },
                }}
            >
                <Typography sx={{ fontSize: '1.5rem', fontWeight: '700', width: '100%', textAlign: 'left' }}>
                    Reward Item List
                </Typography>
                <Typography sx={{ mt: '0.5rem', fontSize: '1rem', fontWeight: 400, mb: '2rem' }}>
                    Showing all package reward items
                </Typography>
                <Box sx={{
                    overflowY: 'auto',
                    maxHeight: '25rem',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    {selectedItem != null && selectedItem.length > 0 ?
                        selectedItem.map((item, index) =>
                            <div className='flex justify-between items-center mb-[1.5rem]' key={index}>
                                <img src={item.imageUrl ?? NoImage} style={{ width: '4rem', height: '4rem', objectFit: 'cover', borderRadius: '0.625rem' }} />
                                <div className='flex flex-col justify-start'>
                                    <Typography sx={{ fontSize: '1.25rem', fontWeight: '700', mb: '0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        {item.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: '400', mb: '0.5rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        {item.description}
                                    </Typography>
                                </div>
                                <div className='my-auto w-[6rem]'>
                                    <Typography sx={{ fontSize: '1rem', fontWeight: '500', mb: '0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '6rem', textAlign: 'right' }}>
                                        Qty: {item.quantity}
                                    </Typography>
                                </div>
                            </div>
                        ) : <div className='w-full flex justify-center'>
                            <CircularProgress sx={{ color: 'var(--grey)' }} />
                        </div>
                    }
                </Box>
            </Dialog>
        </div>
    )
}

export default FundingProjectPackages