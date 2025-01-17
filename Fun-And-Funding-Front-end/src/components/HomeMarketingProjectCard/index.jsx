import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Card, Chip, IconButton, Tooltip } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import likeApiInstace from '../../utils/ApiInstance/likeApiInstance';
import './index.css';

function HomeMarketingProjectCard({ marketplaceProject }) {
    const token = Cookies.get("_auth");
    const navigate = useNavigate();

    const [liked, isLiked] = useState(false);

    useEffect(() => {
        if (token != undefined || token != null) {
            fetchUserLike();
        }
    }, [marketplaceProject, token]);

    const fetchUserLike = async () => {
        try {
            const res = await likeApiInstace.get(`/get-project-like/${marketplaceProject.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode == 200) {
                isLiked(res.data._data.isLike);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleLikeProject = async () => {
        try {
            const res = await likeApiInstace.post(`/marketplace`, {
                projectId: marketplaceProject.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode == 200) {
                isLiked(!liked);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Card sx={{ width: '22.75rem', borderRadius: '0.625rem', backgroundColor: '#F5F7F8', position: 'relative', boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)' }}>
            <CardMedia
                component="img"
                image={marketplaceProject?.marketplaceFiles.find((file) => file.fileType === 2)?.url || ''}
                loading="lazy"
                sx={{ width: '22.75rem', height: '13.75rem', objectFit: 'cover' }}
            />
            {liked ? (
                <Tooltip title="Unlike project" arrow>
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
                                backgroundColor: '#FFCCCC',
                            },
                            letterSpacing: '0.5px',
                            zIndex: 2,
                        }}
                        onClick={() => handleLikeProject()}
                    >
                        <FavoriteIcon size="1rem" style={{ strokeWidth: '1rem' }} />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Like project" arrow>
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
                        onClick={() => handleLikeProject()}
                    >
                        <FavoriteBorderIcon size="1rem" style={{ strokeWidth: '1rem' }} />
                    </IconButton>
                </Tooltip>
            )}
            <CardContent sx={{ px: '2rem !important', marginBottom: '0.5rem' }} className='parent-card'>
                <div className='mt-[0.5rem]'>
                    <a
                        href={`/marketplace-detail/${marketplaceProject.id}`}
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
                            className="project-card-name"
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
                                {marketplaceProject.name}
                            </span>
                        </Typography>
                    </a>

                    <Typography sx={{
                        color: '#2F3645', fontWeight: '400', fontSize: '0.875rem', width: 'fit-content',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: '4rem'
                    }}>
                        {marketplaceProject.description}
                    </Typography>
                    <div className='flex flex-row justify-between align-bottom mt-[1.75rem]'>
                        <div>
                            <div className='flex flex-row gap-[0.5rem] overflow-x-auto pb-[0.5rem] w-[10rem]' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <style>
                                    {`
                                    .scrollable-category::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}
                                </style>
                                {marketplaceProject.categories && marketplaceProject.categories.map((item, index) => (
                                    <Chip
                                        key={index}
                                        label={item.name}
                                        className="scrollable-category"
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
                            <Chip label="Unity" sx={{ borderRadius: '0.313rem', fontSize: '0.875rem' }} />
                        </div>
                        <div>
                            <Typography sx={{ color: 'var(--black)', fontWeight: '700', mb: '0.5rem', width: 'full', fontSize: '1.5rem', textAlign: 'right' }}>
                                VND
                            </Typography>
                            <Typography sx={{ fontWeight: '700', width: 'fit-content', fontSize: '1.5rem', color: 'var(--primary-green)', textAlign: 'right' }}>
                                {marketplaceProject.price.toLocaleString('de-DE')}
                            </Typography>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default HomeMarketingProjectCard