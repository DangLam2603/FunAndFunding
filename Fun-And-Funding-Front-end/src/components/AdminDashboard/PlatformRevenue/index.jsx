import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { IconButton, Paper, Tooltip, Typography } from "@mui/material";
import React from 'react';
import { FaFolderOpen, FaUserTie } from "react-icons/fa6";

function PlatformRevenue({ platformRevenue, platformStatistic }) {
    return (
        <Paper elevation={3}
            sx={{
                borderRadius: '0.625rem',
                pb: '2rem',
                pt: '1.5rem',
                px: '1.5rem',
                boxShadow:
                    '0px 2px 2px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
                mb: '2rem',
                height: '15rem'
            }}>
            <div className='flex flex-row justify-between items-center'>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'var(--grey)' }}>Platform Overview
                    <Tooltip title={
                        <span>
                            Showing your platform revenue <br />
                            according to the system wallet
                        </span>
                    } arrow>
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
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'var(--black)' }}>Website Revenue
                </Typography>
            </div>
            <div className='mt-[0.75rem]'>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-green)', mb: '0.5rem' }}>{new Intl.NumberFormat("de-DE").format(platformRevenue)}<span className='ml-[0.5rem] text-[1rem]'>VND</span>
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--black)', mt: '1rem' }}>With a total increase in this month of:
                </Typography>
                <div className='mt-[1rem] flex flex-row justify-between'>
                    <div className='flex flex-col items-center justify-center gap-[0.75rem] w-[6rem]'>
                        <FaUserTie style={{ fontSize: "1.2rem" }} />
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)', textAlign: 'center' }}>
                            {Object.keys(platformStatistic).length === 0
                                ? "N/A"
                                : `${new Intl.NumberFormat("de-DE").format(platformStatistic.numberOfUsers)} Users`}
                        </Typography>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-[0.75rem]'>
                        <FaFolderOpen style={{ fontSize: "1.2rem" }} />
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)', textAlign: 'center' }}>
                            {Object.keys(platformStatistic).length === 0
                                ? "N/A"
                                : `${new Intl.NumberFormat("de-DE").format(platformStatistic.numberOfFundingProjects)} Projects`}
                        </Typography>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-[0.75rem] w-[6rem]'>
                        <SportsEsportsIcon style={{ fontSize: "1.2rem" }} />
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)', textAlign: 'center' }}>
                            {Object.keys(platformStatistic).length === 0
                                ? "N/A"
                                : `${new Intl.NumberFormat("de-DE").format(platformStatistic.numberOfMarketplaceProjects)} Games`}
                        </Typography>
                    </div>
                </div>
            </div>
        </Paper>
    )
}

export default PlatformRevenue