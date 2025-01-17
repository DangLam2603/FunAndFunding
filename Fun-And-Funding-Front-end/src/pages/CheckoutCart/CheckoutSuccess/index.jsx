import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, Divider, Modal, Paper, Tooltip, Typography } from '@mui/material';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { FaKey } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { HiOutlineHome } from "react-icons/hi2";
import { TbListDetails } from "react-icons/tb";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import Confetti from "../../../assets/images/confetti-background.png";
import BrowseMarketingCard from "../../../components/BrowseMarketingCard";
import marketplaceProjectApiInstance from "../../../utils/ApiInstance/marketplaceProjectApiInstance";
import orderApiInstance from "../../../utils/ApiInstance/orderApiInstance";
import './index.css';

const AnimatedCheckIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="160"
            height="160"
            className="check-icon"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                fill="var(--primary-green)"
                strokeWidth="2"
                className="circle"
            />
            <path
                d="M8 13l3 3 5-7"
                fill="none"
                stroke="var(--white)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="checkmark"
            />
        </svg>
    );
};

function CheckoutSuccess() {
    const { id } = useParams();
    const token = Cookies.get("_auth");
    const isLogined = Cookies.get("_auth") !== undefined;
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [detailList, setDetailList] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState("");
    const [marketplaceProjectList, setMarketplaceProjectList] = useState(null);
    const [clipboardCopied, setClipboardCopied] = useState(false);

    useEffect(() => {
        if (isLogined) {
            fetchOrder();
        }
        fetchTopMarketplaceProjects();
    }, [isLogined, id]);

    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchTopMarketplaceProjects = async () => {
        try {
            const res = await marketplaceProjectApiInstance.get('/top3');
            if (res.status == 200) {
                setMarketplaceProjectList(res.data._data);
            } else {
                setMarketplaceProjectList(null);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const fetchOrder = async () => {
        try {
            const res = await orderApiInstance.get(`/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode === 200) {
                const fetchedOrder = res.data._data;
                setOrder(fetchedOrder);

                const fetchedDetails = fetchedOrder.orderDetails.map((item) => ({
                    id: item.digitalKey.id,
                    imageUrl: item.digitalKey.marketingProject?.marketplaceFiles.find(file => file.fileType === 2)?.url || '',
                    name: item.digitalKey.marketingProject?.name || 'Unnamed Game',
                    keyString: item.digitalKey?.keyString || 'No Key',
                    price: item.unitPrice,
                    gameFile: item.digitalKey.marketingProject?.marketplaceFiles.find(file => file.fileType === 3)?.url || '',
                }));
                setDetailList(fetchedDetails);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };

    const handleOpen = (key) => {
        setSelectedKey(key);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedKey("");
        setClipboardCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedKey);
        setClipboardCopied(true);
    };

    return (
        <>
            <div className='relative-container'>
                <div className="success-background">
                    <img src={Confetti} alt="Confetti Background" />
                    <div className="success-overlay"></div>
                </div>
                <div className="flex flex-col justify-center items-center z-10">
                    <AnimatedCheckIcon />
                    <Typography className='checkout-success-title !mt-[1rem]'>
                        Thank You For Your Purchase!
                    </Typography>
                    <Typography>
                        Thank you for trusting us and our community. We are glad to serve you on our journey.
                    </Typography>
                    {order != null &&
                        <div className="mt-[2rem] mb-[1rem] w-fit">
                            <Paper elevation={3} className="checkout-success-paper">
                                <div className="border-[2px] border-[var(--primary-green)] px-[2rem] py-[1rem] flex flex-row justify-start items-center rounded-[0.625rem] gap-[2.5rem] w-[40rem]"
                                    style={{ backgroundColor: 'rgba(27, 170, 100, 0.1)' }}>
                                    <div className="flex-shrink-0">
                                        <FaMoneyBillTransfer style={{ fontSize: '4rem', color: 'var(--black)' }} />
                                    </div>
                                    <div className="flex-shrink-0 flex flex-col justify-start gap-[0.5rem]">
                                        <Typography sx={{ fontSize: '1rem', fontWeight: '400', color: 'var(--black)' }}>
                                            Total amount
                                        </Typography>
                                        <Typography sx={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--black)' }}>
                                            {formatPrice(order.totalPrice)} VND
                                        </Typography>
                                    </div>
                                </div>
                                <Divider orientation="horizontal" sx={{ borderColor: '#DBDBDB', my: '1.5rem' }} />
                                <div
                                    className="overflow-hidden"
                                    style={{
                                        maxHeight: `calc(2.5 * (7rem + 3.5rem))`,
                                        height: 'fit-content',
                                        overflowY: 'scroll',
                                        scrollbarWidth: 'none',
                                        WebkitOverflowScrolling: 'touch',
                                    }}
                                >
                                    <div className="hide-scrollbar">
                                        {detailList.length > 0 &&
                                            detailList.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="border-[2px] border-[var(--light-grey)] pl-[1rem] pr-[2rem] py-[1rem] flex flex-row justify-between items-center rounded-[0.625rem] gap-[1rem] w-[40rem]"
                                                    style={{
                                                        backgroundColor: 'var(--white)',
                                                        marginBottom: index === detailList.length - 1 ? 0 : '1rem',
                                                    }}
                                                >
                                                    <div className="!flex-grow-0 flex flex-row justify-start items-center rounded-[0.625rem] gap-[2rem] w-[25rem]">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                className="w-[8rem] h-[8rem] object-cover rounded-[0.25rem] flex-shrink-0"
                                                                src={item.imageUrl}
                                                                alt={item?.name}
                                                            />
                                                        </div>
                                                        <div className="flex-shrink-0 flex justify-between">
                                                            <div className="flex flex-col justify-start gap-[0.5rem] flex-grow-0 flex-shrink-0">
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '1.25rem',
                                                                        fontWeight: '700',
                                                                        color: 'var(--black)',
                                                                        display: '-webkit-box',
                                                                        WebkitBoxOrient: 'vertical',
                                                                        WebkitLineClamp: 1,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'normal',
                                                                        maxWidth: '15rem',
                                                                    }}
                                                                >
                                                                    {item?.name}
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: '700',
                                                                        color: 'var(--primary-green)',
                                                                    }}
                                                                >
                                                                    {formatPrice(item.price)} VND
                                                                </Typography>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: '400',
                                                                        color: 'var(--black)',
                                                                    }}
                                                                >
                                                                    Game unlock key: <br />
                                                                    <Button
                                                                        variant="outlined"
                                                                        sx={{ height: '2rem', mt: '0.5rem', textTransform: 'none', color: 'var(--primary-green)', borderColor: 'var(--primary-green)', fontSize: '0.75rem' }}
                                                                        startIcon={
                                                                            <FaKey
                                                                                sx={{
                                                                                    fontSize: "1rem !important",
                                                                                    strokeWidth: "1",
                                                                                    stroke: "#F5F7F8",
                                                                                }}
                                                                            />
                                                                        }
                                                                        onClick={() => handleOpen(item.keyString)}
                                                                    >
                                                                        Click To Show
                                                                    </Button>
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Tooltip title="Download game file" arrow>
                                                        <Button
                                                            variant="outlined"
                                                            className="outline-download-button"
                                                            onClick={() => {
                                                                const fileUrl = item.gameFile;
                                                                if (fileUrl) handleDownload(fileUrl);
                                                            }}
                                                        >
                                                            <DownloadIcon
                                                                sx={{
                                                                    fontSize: "2rem !important",
                                                                    strokeWidth: "1",
                                                                    stroke: "#F5F7F8",
                                                                }}
                                                            />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    }
                    <div className="flex flex-row justify-center items-center gap-[2rem] mb-[2rem]">
                        <a href='/home'>
                            <Button
                                variant="outlined"
                                className="outline-button"
                                startIcon={
                                    <HiOutlineHome
                                        sx={{
                                            fontSize: "1.5rem !important",
                                            strokeWidth: "1",
                                            stroke: "#F5F7F8",
                                        }}
                                    />
                                }
                            >
                                Back to Home
                            </Button>
                        </a>
                        <a href='/account/orders'>
                            <Button
                                variant="contained"
                                className='checkout-success-button'
                                startIcon={
                                    <TbListDetails
                                        sx={{
                                            fontSize: "1.5rem !important",
                                            strokeWidth: "1",
                                            stroke: "#F5F7F8",
                                        }}
                                    />
                                }
                            >
                                See more details
                            </Button>
                        </a>
                    </div>
                </div>
            </div >
            <div className="mx-[var(--side-margin)] mt-[4rem]">
                <Typography className='checkout-cart-title'>
                    Recommended games
                </Typography>
                <div className="flex flex-col items-center">
                    <div className="flex flex-row justify-between items-center w-full">
                        {marketplaceProjectList != null && marketplaceProjectList.length > 0 ? (
                            marketplaceProjectList.map((item, index) => (
                                <BrowseMarketingCard key={index} item={item} />
                            ))
                        ) : (
                            <>
                                <Typography>Nothing to show</Typography>
                            </>
                        )}
                    </div>
                    <div>
                        <a href="/marketplace">
                            <Button
                                variant="contained"
                                className='checkout-cart-more-button !w-[15rem]'
                                endIcon={
                                    <ArrowForwardOutlinedIcon
                                        sx={{
                                            fontSize: "1.5rem !important",
                                            strokeWidth: "1",
                                            stroke: "#F5F7F8",
                                        }}
                                    />
                                }
                            >
                                See more games
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="api-key-modal-title"
                aria-describedby="api-key-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        px: 4,
                        py: 3,
                        borderRadius: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: '600', mb: '1rem' }}>
                            Digital Key Generated
                        </Typography>
                    </Box>
                    <Typography id="api-key-modal-description" sx={{ mb: '1rem' }}>
                        Use your Digital keys securely. Do not share them or embed them in code
                        the public can view.
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#f5f5f5",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            mb: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {selectedKey}
                        </Typography>
                        <Button
                            onClick={handleCopy}
                            variant="outlined"
                            sx={{
                                ml: 2,
                                textTransform: "none",
                                color: 'var(--primary-green)',
                                borderColor: 'var(--primary-green)'
                            }}
                        >
                            Copy
                        </Button>
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', color: 'var(--primary-green)', display: clipboardCopied ? 'block' : 'none', fontWeight: '600' }}>Digital Key copied to clipboard!</Typography>
                </Box>
            </Modal>
        </>
    );
}

export default CheckoutSuccess;