import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Backdrop, Box, Divider, Fade, IconButton, Modal, Paper, Tooltip, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import React, { useState } from 'react';

function StatisticCard({ content, description, data }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        px: '2rem',
        py: '2rem',
        minHeight: '60%',
        borderRadius: 1
    };

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    const totalUsers = data.reduce((acc, item) => acc + item.count, 0);

    const platforms = data.map(item => ({
        label: content === "Accounts" ? item.role : content === "Crowdfunding" ? item.status.replace(/([a-z])([A-Z])/g, "$1 $2") : content === "Milestones" ? `Milestone ${item.milestoneOrder}` : content === "Marketplace" ? item.status : "N/A",
        value: item.count,
    }));

    const series = [
        {
            innerRadius: 30,
            outerRadius: 50,
            data: platforms,
        },
    ];

    const modalSeries = [
        {
            innerRadius: 80,
            outerRadius: 120,
            data: platforms,
        },
    ];

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: '0.625rem',
                    pt: '1.5rem',
                    boxShadow:
                        '0px 2px 2px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
                    mb: '2rem',
                    height: '15rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignContent: 'space-between',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        px: '1.5rem',
                        color: 'var(--grey)',
                        mb: '1rem',
                    }}
                >
                    {content}
                    <Tooltip title={description} arrow>
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
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100% !important',
                        height: 100,
                        px: '1.5rem',
                    }}
                >
                    <PieChart
                        series={series}
                        width={80}
                        height={100}
                        slotProps={{
                            legend: { hidden: true },
                        }}
                        sx={{
                            mx: 'auto',
                            '& g[transform]': {
                                transform: 'translate(50%, 50%)',
                            },
                        }}
                    />
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--black)',
                        }}
                    >
                        {new Intl.NumberFormat("de-DE").format(totalUsers)}
                    </Typography>
                </Box>
                <Divider sx={{ mt: '1.5rem', color: 'var(--light-grey)' }} />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        backgroundColor: 'transparent',
                        borderBottomLeftRadius: '0.625rem',
                        borderBottomRightRadius: '0.625rem',
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'var(--black)',
                            color: 'var(--white)',
                        },
                        height: '100%'
                    }}
                    onClick={() => setOpen(true)}
                >
                    <Typography
                        sx={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            textAlign: 'center',
                            color: 'inherit',
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        See Details
                        <ArrowForwardIcon
                            sx={{
                                ml: '0.25rem',
                                fontSize: '1rem',
                                '& path': {
                                    strokeWidth: '1',
                                },
                            }}
                        />
                    </Typography>
                </Box>
            </Paper>
            <Modal open={open} onClose={handleClose} slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                sx={{ zIndex: '50 !important' }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <div className="mb-[4rem] mx-[0.5rem]">
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                {content} usages
                            </Typography>
                            <Typography sx={{ mt: '0.5rem', fontSize: '1rem', fontWeight: 400 }}>
                                All {content} statistics will be stated here.
                            </Typography>
                        </div>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100% !important',
                                height: 200,
                            }}
                        >
                            <PieChart
                                margin={{ left: -100 }}
                                series={modalSeries}
                                width={500}
                                height={300}
                                slotProps={{
                                    legend: {
                                        hidden: false,
                                        position: { vertical: 'middle', horizontal: 'right' },
                                        itemGap: 15,
                                    },
                                }}
                                sx={{
                                    mx: 'auto',
                                    position: 'relative',
                                }}
                            />
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    top: '60%',
                                    left: '33%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: 'var(--black)',
                                    whiteSpace: 'pre-line',
                                    textAlign: 'center'
                                }}
                            >
                                Total{"\n"}
                                <span className='text-[1.5rem] font-bold'>{new Intl.NumberFormat("de-DE").format(totalUsers)}</span>
                            </Typography>
                        </Box>
                    </Box>
                </Fade>
            </Modal >
        </>
    );
}

export default StatisticCard;