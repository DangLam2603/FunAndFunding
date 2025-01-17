import { Box, Grid2, Typography } from "@mui/material";
import React from 'react';
import { FaDonate } from "react-icons/fa";
import { FaIdCard } from "react-icons/fa6";
import { IoWallet } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";

function FundingProjectOverview({ fundingProject }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };

    return (
        <div>
            <Typography sx={{ fontSize: '1rem', fontWeight: '600', mb: '1rem' }}>
                Project information
            </Typography>
            <div className="w-full mb-[2rem]">
                <div className="w-full">
                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                        <Grid2 xs={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                <TbTargetArrow size={16} />
                                <Typography sx={{
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                }}>
                                    Target
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--grey)'
                            }}>
                                :
                            </Typography>
                        </Grid2>

                        <Grid2 xs={8}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: fundingProject?.balance ? '500' : '400',
                                color: fundingProject?.balance ? 'var(--black)' : 'var(--grey)'
                            }}>
                                {formatPrice(fundingProject?.target)} <span className="text-[0.75rem]">VND</span>
                            </Typography>
                        </Grid2>
                    </Grid2>
                </div>
                <div className="w-full">
                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                        <Grid2 xs={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                <FaDonate size={16} />
                                <Typography sx={{
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                }}>
                                    Total Donation
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--grey)'
                            }}>
                                :
                            </Typography>
                        </Grid2>

                        <Grid2 xs={8}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: fundingProject?.balance ? '500' : '400',
                                color: fundingProject?.balance
                                    ? fundingProject.balance > fundingProject.target
                                        ? 'var(--primary-green)'
                                        : 'var(--red)'
                                    : 'var(--grey)',
                            }}>
                                {formatPrice(fundingProject?.balance)} <span className="text-[0.75rem]">VND</span>
                            </Typography>
                        </Grid2>
                    </Grid2>
                </div>
            </div>
            <Typography sx={{ fontSize: '1rem', fontWeight: '600', mb: '1rem' }}>
                Wallet information
            </Typography>
            <div className="w-full mb-[2rem]">
                <div className="w-full">
                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                        <Grid2 xs={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                <IoWallet size={16} />
                                <Typography sx={{
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                }}>
                                    Wallet Balance
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--grey)'
                            }}>
                                :
                            </Typography>
                        </Grid2>

                        <Grid2 xs={8}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: fundingProject?.wallet.balance ? '500' : '400',
                                color: fundingProject?.wallet.balance ? 'var(--black)' : 'var(--grey)'
                            }}>
                                {formatPrice(fundingProject?.wallet.balance)} <span className="text-[0.75rem]">VND</span>
                            </Typography>
                        </Grid2>
                    </Grid2>
                </div>
            </div>
            <Typography sx={{ fontSize: '1rem', fontWeight: '600', mb: '1rem' }}>
                Owner information
            </Typography>
            <div className="w-full mb-[2rem]">
                <div className="w-full">
                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                        <Grid2 xs={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                <FaIdCard size={16} />
                                <Typography sx={{
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                }}>
                                    Username
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--grey)'
                            }}>
                                :
                            </Typography>
                        </Grid2>

                        <Grid2 xs={8}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: fundingProject?.user.userName ? '500' : '400',
                                color: fundingProject?.user.userName ? 'var(--black)' : 'var(--grey)'
                            }}>
                                {fundingProject?.user.userName}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </div>
                <div className="w-full">
                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%' }}>
                        <Grid2 xs={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                <MdEmail size={16} />
                                <Typography sx={{
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                }}>
                                    Email
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--grey)'
                            }}>
                                :
                            </Typography>
                        </Grid2>

                        <Grid2 xs={8}>
                            <Typography sx={{
                                fontSize: '1rem',
                                fontWeight: fundingProject?.user.email ? '500' : '400',
                                color: fundingProject?.user.email ? 'var(--black)' : 'var(--grey)'
                            }}>
                                {fundingProject?.user.email}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </div>
            </div>
        </div>
    )
}

export default FundingProjectOverview