import { Box, Typography } from "@mui/material";
import React from "react";
import { AiOutlineFacebook } from "react-icons/ai";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Background from "../../assets/images/background-pattern.png";
import Logo from "../../assets/images/logo-alt.png";
import "./index.css";

function Footer() {
    const navigate = useNavigate();
    const handleOpenInNewTab = () => {
        const url = "/policies"; // Relative path
        const fullUrl = window.location.origin + url; // Construct full URL
        window.open(fullUrl, "_blank", "noopener,noreferrer");
      };
    return (
        <footer className="bg-[#2F3645] w-full bottom-0 left-0 right-0 h-[38rem] mt-[5rem] flex flex-col items-center justify-center relative"
        >
            <div className="footer-background">
                <img src={Background} alt="footer" border="0" style={{ height: '38rem', objectFit: 'cover', width: '100%' }} />
                <div className="footer-overlay"></div>
            </div>
            <div
                className="flex flex-row h-full z-10 w-full !px-[6rem] my-[5rem] justify-between"
            >
                <div className="text-[#F5F7F8] text-left !pl-0 !p-1">
                    <img
                        src={Logo}
                        alt="logo"
                        style={{ width: "15.25rem", height: "3.2rem", marginBottom: '1rem' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: '600', marginBottom: '2.25rem', fontSize: '1rem' }}>
                        Game on, Fund on, Thrive together.
                    </Typography>
                    <div>
                        <Typography variant="body2" className="text-wrap break-all" sx={{ marginBottom: '0.4rem', fontSize: '1rem', fontWeight: '300' }}>
                            Email: fundandfunding2024@gmail.com
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '1rem', fontWeight: '300' }}>Phone: 0123456789</Typography>
                    </div>
                </div>
                <div className="text-[#F5F7F8] text-left !pl-0 !p-1">
                    <div className="flex justify-between gap-[4rem]">
                        <div className="w-fit">
                            <hr className="divide-line" />
                            <Typography
                                gutterBottom
                                sx={{ textAlign: "left", marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '300' }}
                            >
                                Investing
                            </Typography>
                            <Typography onClick={() => window.location.href = '/about-us'} variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">Investor Returns</Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">Tax relief</Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">Fees and charges</Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content"
                            >
                                Opportunities
                            </Typography>
                            <Typography x={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content"
                            >
                                Risk information
                            </Typography>
                        </div>
                        <div className="w-fit">
                            <hr className="divide-line" />
                            <Typography
                                gutterBottom
                                sx={{ textAlign: "left", marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '300' }}
                            >
                                Raising
                            </Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                            onClick={() => handleOpenInNewTab()}
                                className="bottom-footer-content">Term of Services</Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">How it works</Typography>
                            <Typography x={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">Refund Project</Typography>
                        </div>
                        <div className="w-fit">
                            <hr className="divide-line" />
                            <Typography
                                gutterBottom
                                sx={{ textAlign: "left", marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '300' }}
                            >
                                Purchasing
                            </Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                            onClick={() => handleOpenInNewTab()}
                                className="bottom-footer-content">Term of Services</Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">Refund Policy</Typography>
                            <Typography x={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">Customer Support</Typography>
                        </div>
                        <div className="w-fit">
                            <hr className="divide-line" />
                            <Typography
                                gutterBottom
                                sx={{ textAlign: "left", marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '300' }}
                            >
                                About
                            </Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">About us</Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">Privacy</Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">News</Typography>
                            <Typography variant="body2" sx={{
                                marginBottom: '1.25rem'
                            }}
                                className="bottom-footer-content">Contact us</Typography>
                        </div>
                    </div>
                </div>
            </div>
            <Box className="w-full mt-auto text-[#F5F7F8] px-[6rem]" sx={{ zIndex: 2 }}>
                <hr />
                <div className="!mt-[2rem] !mb-[3rem] flex justify-between">
                    <Typography
                        variant="body2"
                        sx={{ fontSize: '1rem', fontWeight: '100' }}
                    >{`@${new Date().getFullYear()} Fun and Funding. All rights reserved.`}</Typography>
                    <div className="flex justify-between gap-[3rem]">
                        <div className="flex justify-evenly gap-[3rem]">
                            <Typography variant="body2" className="bottom-footer-content">
                                Terms and Conditions
                            </Typography>
                            <Typography variant="body2" className="bottom-footer-content">
                                Risk Warning
                            </Typography>
                            <Typography variant="body2" className="bottom-footer-content">
                                Feedback
                            </Typography>
                        </div>
                        <div className="flex justify-evenly gap-[1.5rem]">
                            <AiOutlineFacebook size="1.5rem" className="media-platform" />
                            <FaInstagram size="1.5rem" className="media-platform" />
                            <FaGithub size="1.5rem" className="media-platform" />
                        </div>
                    </div>
                </div>
            </Box>
        </footer >
    );
}
export default Footer;