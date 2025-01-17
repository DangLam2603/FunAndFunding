import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Backdrop, Box, Fade, IconButton, LinearProgress, Modal, Paper, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';

function CategoryTable({ data }) {
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
        minHeight: '70%',
        borderRadius: 1
    };

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: '0.625rem',
                    py: '1rem',
                    px: '1.5rem',
                    boxShadow:
                        '0px 2px 2px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
                    mb: '2rem',
                }}
            >
                <div className="flex flex-row justify-between items-center mb-[1rem]">
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'var(--grey)' }}>Most Used Categories</Typography>
                    <Tooltip title="Expand" arrow>
                        <IconButton
                            sx={{
                                p: '0.75rem',
                                color: 'var(--black)',
                                '&:hover': {
                                    backgroundColor: 'var(--white)',
                                },
                            }}
                            size="small"
                            onClick={() => setOpen(true)}
                        >
                            <ArrowOutwardIcon fontSize="inherit" style={{ strokeWidth: '2rem !important' }} />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className='mb-[1rem]'>
                    {data && data.slice(0, 5).map((category, index) => (
                        <div
                            key={index}
                            className="flex flex-col"
                            style={{ marginBottom: index < data.length - 1 ? '1rem' : '0' }}
                        >
                            <div className="flex justify-between items-center mb-[0.5rem]">
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        width: '6rem',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {category.categoryName}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: category.percentageUsed >= 50
                                            ? 'var(--primary-green)'
                                            : category.percentageUsed > 25
                                                ? 'var(--yellow)'
                                                : 'var(--red)',
                                    }}
                                >
                                    {(Math.ceil(category.percentageUsed * 100) / 100).toFixed(2)}%
                                </Typography>
                            </div>
                            <LinearProgress
                                variant="determinate"
                                sx={{
                                    width: '100%',
                                    height: '0.5rem',
                                    borderRadius: '0.25rem',
                                    backgroundColor: '#EAEAEA',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: category.percentageUsed >= 50
                                            ? 'var(--primary-green)'
                                            : category.percentageUsed > 25
                                                ? 'var(--yellow)'
                                                : 'var(--red)',
                                    }
                                }
                                }
                                value={category.percentageUsed <= 100 ? category.percentageUsed : 100}
                            />
                        </div>
                    ))}
                </div>
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
                        <div className="mb-[2rem] mx-[0.5rem]">
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                Category usages
                            </Typography>
                            <Typography sx={{ mt: '0.5rem', fontSize: '1rem', fontWeight: 400 }}>
                                All category usages will be stated here.
                            </Typography>
                        </div>
                        <Box
                            sx={{
                                height: '23rem',
                                mb: '0.5rem',
                                overflowY: 'auto',
                                overflowX: 'visible',
                                px: '0.5rem',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': {
                                    display: 'none'
                                },
                            }}
                        >
                            {data.map((category, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col"
                                    style={{ marginBottom: index < data.length - 1 ? '1rem' : '0' }}
                                >
                                    <div className="flex justify-between items-center mb-[0.25rem]">
                                        <Typography
                                            sx={{
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                width: '20rem',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {category.categoryName}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                color: 'var(--grey)'
                                            }}
                                        >
                                            Number of use: <span style={{
                                                color: category.percentageUsed >= 50
                                                    ? 'var(--primary-green)'
                                                    : category.percentageUsed > 25
                                                        ? 'var(--yellow)'
                                                        : 'var(--red)',
                                            }}>{category.projectCount}</span>
                                        </Typography>
                                    </div>
                                    <div className="flex justify-between items-center gap-[1rem]">
                                        <LinearProgress
                                            variant="determinate"
                                            sx={{
                                                width: '100%',
                                                height: '0.75rem',
                                                borderRadius: '0.25rem',
                                                backgroundColor: '#EAEAEA',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: category.percentageUsed >= 50
                                                        ? 'var(--primary-green)'
                                                        : category.percentageUsed > 25
                                                            ? 'var(--yellow)'
                                                            : 'var(--red)',
                                                }
                                            }
                                            }
                                            value={category.percentageUsed <= 100 ? category.percentageUsed : 100}
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: category.percentageUsed >= 50
                                                    ? 'var(--primary-green)'
                                                    : category.percentageUsed > 25
                                                        ? 'var(--yellow)'
                                                        : 'var(--red)',
                                            }}
                                        >
                                            {(Math.ceil(category.percentageUsed * 100) / 100).toFixed(2)}%
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}

export default CategoryTable;