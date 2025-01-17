import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Box, Button, Typography } from '@mui/material';
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router";
import AuthDialog from "../Popup";
import './index.css';

import banner1 from '../../assets/images/banner1.png';
import banner2 from '../../assets/images/banner2.png';
import banner3 from '../../assets/images/banner3.png';

const banners = [
    {
        id: 1,
        image: banner1,
        text: '<span class="text-[var(--primary-green)]">Play</span> Together, <span class="text-[var(--primary-green)]">Fund</span> Together.',
        subText: 'Connects gamers and developers, creating a community to play and fund exciting new games!'
    },
    {
        id: 2,
        image: banner2,
        text: 'Game <span class="text-[var(--primary-green)]">On</span>, Together <span class="text-[var(--primary-green)]">Strong</span>.',
        subText: 'Unite players and creators to fund and experience groundbreaking games!'
    },
    {
        id: 3,
        image: banner3,
        text: 'Fueling <span class="text-[var(--primary-green)]">Games</span>, Building <span class="text-[var(--primary-green)]">Dreams</span>.',
        subText: 'Empowering a community to support and play the next big hits in gaming!'
    },
];

function BannerCarousel() {
    const token = Cookies.get("_auth");
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const openAuthDialog = () => setIsAuthDialogOpen(true);
    const closeAuthDialog = () => setIsAuthDialogOpen(false);

    const nextBanner = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(nextBanner, 5000);
    };

    const goToBanner = (index) => {
        setCurrentIndex(index);
        resetTimer();
    };

    useEffect(() => {
        intervalRef.current = setInterval(nextBanner, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleButtonClick = () => {
        if (token && token !== undefined) {
            navigate('/choose-project-plan');
        } else {
            setIsAuthDialogOpen(true);
        }
    };

    return (
        <>
            <div className="banner-carousel-container">
                <div className="banner-carousel-wrapper">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`banner-carousel-img ${index === currentIndex ? 'active' : ''}`}
                            style={{
                                backgroundImage: `url(${banner.image})`,
                            }}
                        >
                            {index === currentIndex && (
                                <>
                                    <Box className="banner-carousel-text">
                                        <Typography
                                            sx={{
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                fontSize: '3.5rem',
                                                mb: '1.5rem',
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: banners[currentIndex].text,
                                            }}
                                        ></Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: '500',
                                                textTransform: 'capitalize',
                                                fontSize: '1.5rem',
                                                mb: '2.5rem',
                                            }}
                                        >
                                            {banner?.subText}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontSize: '1.25rem',
                                                textTransform: 'capitalize',
                                                fontWeight: '700',
                                                backgroundColor: 'var(--primary-green)',
                                                px: '3.5rem',
                                                py: '0.75rem',
                                                ':hover': {
                                                    backgroundColor: '#257054',
                                                },
                                            }}
                                            endIcon={
                                                <ArrowForwardOutlinedIcon
                                                    sx={{
                                                        fontSize: '1.5rem !important',
                                                        strokeWidth: '1',
                                                        stroke: '#F5F7F8',
                                                    }}
                                                />
                                            }
                                            onClick={handleButtonClick}
                                        >
                                            Start now
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="banner-carousel-dots">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`banner-carousel-dot ${index === currentIndex ? 'banner-carousel-dot-active' : ''
                                }`}
                            onClick={() => goToBanner(index)}
                        ></div>
                    ))}
                </div>
                <div className="banner-carousel-image-carousel">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`relative rounded-lg !w-[20rem] h-[8rem] cursor-pointer`}
                            style={{
                                border: '3px solid var(--primary-green) !important',
                            }}
                            onClick={() => goToBanner(index)}
                        >
                            <div
                                className="absolute inset-0 rounded-lg"
                                style={{
                                    backgroundImage: `url(${banner.image})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            ></div>
                            <div className={`rounded-lg absolute inset-0 bg-black hover:bg-black hover:opacity-20 transition-all duration-300 ease-in-out ${index === currentIndex ? 'opacity-20' : 'opacity-60'
                                }`}></div>
                        </div>
                    ))}
                </div>
            </div>
            <AuthDialog isOpen={isAuthDialogOpen} onClose={closeAuthDialog} />
        </>
    );
}

export default BannerCarousel;
