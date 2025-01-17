import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, CircularProgress, Fade, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { BiSolidDiscount } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import NoImage from '../../../assets/images/no-image.png';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    bgcolor: 'var(--white)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    paddingLeft: '2.5rem !important',
    paddingRight: '2.5rem !important',
    paddingTop: '2.5rem !important',
    paddingBottom: '2.5rem !important',
    borderRadius: '0.625rem',
    height: 'fit-content',
};

const notify = (message, type) => {
    const options = {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
            backgroundColor: "#ffffff",
            color: "#2F3645",
            fontWeight: "600",
        },
    };

    if (type === "warn") {
        toast.warn(message, options);
    } else if (type === "success") {
        toast.success(message, options);
    } else if (type === "error") {
        toast.error(message, options);
    }
};

function AddCouponForm({ marketplaceProject, open, handleCloseCoupon, handleAddCoupon }) {
    const [couponSending, isCouponSending] = useState(false);
    const [sendingSuccess, isSendingSuccess] = useState(false);
    const [couponKey, setCouponKey] = useState("")

    const handleSendCoupon = async (marketplaceProjectId, couponKey) => {
        isCouponSending(true);
        const status = await handleAddCoupon(marketplaceProjectId, couponKey);
        if (status.code === 200) {
            isSendingSuccess(true);
            isCouponSending(false);
            setTimeout(() => {

                isSendingSuccess(false);
                handleCloseCoupon();
            }, 100);
        } else {
            notify(`${status.message}`, "error");
            isCouponSending(false);
        }
    };


    const handleChangeCouponKey = (e) => {
        setCouponKey(e.target.value);
    }

    return (
        <>
            <Modal open={open} onClose={handleCloseCoupon} closeAfterTransition>
                <Fade in={open}>
                    <Box sx={style}>
                        <div className='flex flex-col justify-center items-center w-full mb-[2rem]'>
                            <img
                                className="w-[12rem] h-[12rem] object-cover rounded-[0.25rem] flex-shrink-0 mb-[1rem]"
                                src={marketplaceProject.marketplaceFiles?.find(file => file.fileType === 2)?.url || NoImage}
                                alt={marketplaceProject.name}
                            />
                            <Typography
                                sx={{
                                    fontWeight: '600',
                                    fontSize: '1.5rem',
                                    color: 'var(--black)',
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    textOverflow: 'ellipsis',
                                    mx: '4rem',
                                    textAlign: 'center',
                                }}
                            >
                                {marketplaceProject.name}
                            </Typography>
                        </div>
                        <div className='flex flex-col justify-center items-center w-full'>
                            <Typography
                                sx={{
                                    fontWeight: '400',
                                    fontSize: '1rem',
                                    color: 'var(--black)',
                                    textAlign: 'center',
                                    mb: '1rem'
                                }}
                            >
                                Enter your coupon for here for verifying
                            </Typography>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "0.625rem",
                                    width: "90%",
                                    backgroundColor: "#EAEAEA",
                                }}
                            >
                                <TextField
                                    placeholder="Coupon code..."
                                    fullWidth
                                    variant="standard"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BiSolidDiscount
                                                    style={{
                                                        color: "#2F3645",
                                                        marginRight: "1.25rem",
                                                        marginLeft: "1.5rem",
                                                        height: "1.5rem",
                                                        fontSize: '1.5rem'
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                        disableUnderline: true,
                                        style: {
                                            height: "3rem",
                                            fontSize: "1rem",
                                            paddingRight: "1.25rem",
                                        },
                                    }}
                                    sx={{ height: "3rem" }}
                                    value={couponKey}
                                    onChange={handleChangeCouponKey}
                                />
                                <Button
                                    sx={{
                                        borderTopRightRadius: "0.625rem",
                                        borderBottomRightRadius: "0.625rem",
                                        borderTopLeftRadius: "0",
                                        borderBottomLeftRadius: "0",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        padding: "0 1.5rem",
                                        width: "6rem",
                                        fontWeight: "600",
                                        height: "3rem",
                                        backgroundColor: "#1BAA64",
                                        boxShadow: "none",
                                        color: "#F5F7F8",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onClick={() => handleSendCoupon(marketplaceProject.id, couponKey)}
                                    disabled={couponSending || sendingSuccess}
                                >
                                    {couponSending ? (
                                        <CircularProgress size={20} sx={{ color: "#F5F7F8" }} />
                                    ) : sendingSuccess ? (
                                        <CheckIcon sx={{ color: "#F5F7F8" }} />
                                    ) : (
                                        "Check"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                pauseOnFocusLoss
            />
        </>
    )
}

export default AddCouponForm