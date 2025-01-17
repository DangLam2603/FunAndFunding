import { Card, Chip, IconButton, LinearProgress, linearProgressClasses, styled, Tooltip } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import followApiInstance from '../../utils/ApiInstance/followApiInstance';
import packageBackerApiInstance from "../../utils/ApiInstance/packageBackerApiInstance";
import './index.css';

const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: '0.25rem',
    borderRadius: 40,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: "#EAEAEA",
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 40,
        backgroundColor: "#1BAA64",
    },
}));

function BrowseFundingCard({ fundingProject }) {
    const token = Cookies.get("_auth");
    const navigate = useNavigate();
    const [followed, isFollowed] = useState(false);
    const [packBackers, setPackBackers] = useState([]);

    useEffect(() => {
        if (token != undefined || token != null) {
            fetchUserFollow();
        }
        fetchBackers();
    }, [fundingProject, token])

    const fetchUserFollow = async () => {
        try {
            const res = await followApiInstance.get(`/check-follow-project/${fundingProject.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.data._statusCode == 200) {
                isFollowed(res.data._data.isFollow);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleFollowProject = async () => {
        try {
            const res = await followApiInstance.post(`${fundingProject.id}/funding-project`, '', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.data._statusCode == 200) {
                isFollowed(!followed);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const calculateDaysLeft = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            const timeDiff = start - now;
            const daysTillStart = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            return `${daysTillStart} days till start`;
        } else if (now < end) {
            const timeDiff = end - now;
            const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hoursRemaining = Math.ceil((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            if (hoursRemaining === 24) {
                return `${daysRemaining + 1} days remaining`;
            } else {
                return `${daysRemaining} days ${hoursRemaining} hours remaining`;
            }
        } else {
            return "Campaign already ended";
        }
    }

    const fetchBackers = async () => {
        try {
            await packageBackerApiInstance
                .get(`/project-backers-detail?projectId=${fundingProject.id}`)
                .then((res) => {
                    if (res.data.result._isSuccess) {
                        setPackBackers(res.data.result._data);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const convertPercentage = (a, b) => Math.floor((a / b) * 100);

    return (
        <Card sx={{ maxWidth: '22rem', borderRadius: '0.625rem', backgroundColor: '#F5F7F8', position: 'relative', boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)' }}>
            <CardMedia
                component='img'
                image={fundingProject?.fundingFiles.find((file) => file.filetype === 2 && file.isDeleted == false)?.url || ''}
                loading='lazy'
                sx={{ height: '13.75rem', objectFit: 'cover' }}
            />
            {followed ? (
                <Tooltip title="Unfollow project" arrow>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: '#F5F7F8',
                            border: '1px solid #EAEAEA',
                            p: '0.75rem',
                            color: '#FF4D4D',
                            '&:hover': {
                                backgroundColor: '#88D1AE',
                            },
                            letterSpacing: '0.5px',
                            zIndex: 2,
                        }}
                        onClick={() => handleFollowProject()}
                    >
                        <FaBookmark size="1rem" style={{ strokeWidth: '1rem', color: 'var(--primary-green)' }} />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Follow project" arrow>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: '#F5F7F8',
                            border: '1px solid #EAEAEA',
                            p: '0.75rem',
                            color: '#2F3645',
                            '&:hover': {
                                backgroundColor: '#DDDDDD',
                            },
                            letterSpacing: '0.5px',
                            zIndex: 2,
                        }}
                        onClick={() => handleFollowProject()}
                    >
                        <FaRegBookmark size="1rem" style={{ strokeWidth: '1rem' }} />
                    </IconButton>
                </Tooltip>
            )}
            <CardContent sx={{ px: '2rem !important', marginBottom: '0.5rem' }} className='browse-funding-parent-card'>
                <Card className='browse-funding-children-card' sx={{ backgroundColor: '#F5F7F8' }}>
                    <div className='flex flex-col justify-center mx-[1rem] my-[0.5rem] w-[14.75rem]'>
                        <Typography sx={{ color: '#2F3645', fontSize: '0.75rem', fontWeight: '600' }}>
                            Target: {fundingProject.target.toLocaleString('de-DE')} VND
                        </Typography>
                        <BorderLinearProgress variant="determinate" sx={{ width: "100%", my: '0.313rem' }} value={convertPercentage(fundingProject.balance, fundingProject.target) <= 100 ? convertPercentage(fundingProject.balance, fundingProject.target) : 100} />
                        <div className='flex flex-row justify-between'>
                            <Typography sx={{ color: '#2F3645', fontSize: '0.75rem', fontWeight: '600' }}>
                                {convertPercentage(fundingProject.balance, fundingProject.target)}% of target
                            </Typography>
                            <Typography sx={{ color: '#2F3645', fontSize: '0.75rem', fontWeight: '600' }}>
                                {/* {packBackers?.length} Investors */}
                            </Typography>

                        </div>
                    </div>
                </Card>
                <div className='mt-[2rem]'>
                    <a
                        href={`/funding-detail/${fundingProject.id}`}
                        style={{
                            textDecoration: 'none',
                            marginBottom: '1rem',
                            display: 'inline-block',
                        }}
                    >
                        <Typography
                            sx={{
                                color: '#2F3645',
                                fontWeight: '700',
                                width: 'fit-content',
                                position: 'relative',
                                transition: 'all 0.3s ease-in-out',
                            }}
                            className="browse-funding-project-card-name"
                        >
                            <span
                                style={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                }}
                            >
                                {fundingProject.name}
                            </span>
                        </Typography>
                    </a>
                    <Typography sx={{
                        color: '#2F3645', fontWeight: '400', fontSize: '0.875rem', width: 'fit-content',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: '2.5rem'
                    }}>
                        {fundingProject.description}
                    </Typography>
                    <div className='mt-[1.75rem] w-[18.75rem]'>
                        <Chip label={calculateDaysLeft(fundingProject.startDate, fundingProject.endDate)} sx={{ borderRadius: '0.313rem', fontSize: '0.875rem', mb: '1rem' }} />
                        <div className='flex flex-row gap-[0.5rem] overflow-x-auto pb-[0.5rem]' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <style>
                                {`
                                    .scrollable-category::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}
                            </style>
                            {fundingProject.categories && fundingProject.categories.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={item.name}
                                    className="browse-funding-scrollable-category"
                                    sx={{
                                        borderRadius: '0.313rem',
                                        fontSize: '0.875rem',
                                        backgroundColor: '#F5F7F8',
                                        border: '2px solid #EAEAEA',
                                        whiteSpace: 'nowrap',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default BrowseFundingCard;
