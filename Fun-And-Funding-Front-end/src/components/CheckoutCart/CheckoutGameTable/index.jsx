import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Button,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Tooltip,
    Typography
} from "@mui/material";
import React, { useState } from 'react';
import { BiSolidDiscount } from "react-icons/bi";
import { IoRemoveCircle } from "react-icons/io5";
import { RiDiscountPercentFill } from "react-icons/ri";
import empty from "../../../assets/images/image_empty.png";
import NoImage from '../../../assets/images/no-image.png';
import AddCouponForm from '../AddCouponForm';

function CheckoutGameTable({ order, handleDeleteCartItem, handleAddCoupon, handleRemoveCoupon }) {
    const [isDeletingMap, setIsDeletingMap] = useState({});
    const [open, setIsOpen] = useState(false);

    const cartItems = order && order.length > 0 && order[0]?.cartItems ? order[0].cartItems : [];

    const formatDate = (date) => {
        const formattedDate = new Date(date);
        const day = String(formattedDate.getDate()).padStart(2, '0');
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const year = formattedDate.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    const handleCloseCoupon = () => {
        setIsOpen(!open);
    };

    const handleDelete = async (marketplaceProjectId) => {
        setIsDeletingMap((prev) => ({ ...prev, [marketplaceProjectId]: true }));
        await handleDeleteCartItem(marketplaceProjectId);
    };

    return (
        <div>
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: '1rem',
                    px: '2rem',
                    backgroundColor: 'var(--white)',
                    borderRadius: '0.625rem',
                    fontWeight: '700',
                    fontSize: '1rem',
                    justifyContent: 'space-between',
                    mb: '2rem'
                }}
                elevation={3}
            >
                <Typography sx={{ flexGrow: 1, color: 'var(--black)', width: '45%', fontWeight: '600', fontSize: '1rem', }}>Game name</Typography>
                <Typography sx={{ width: '25%', color: 'var(--black)', fontWeight: '600', fontSize: '1rem', }}>Price</Typography>
                <Typography sx={{ width: '15%', color: 'var(--black)', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', }}>Discount<RiDiscountPercentFill /></Typography>
                <Typography sx={{ width: '15%', color: 'var(--black)', visibility: 'hidden', fontSize: '1rem', }}>Action</Typography>
            </Paper>
            {
                order != null && cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        item.appliedCoupon && item.appliedCoupon.couponKey ? (
                            <Paper
                                key={item.marketplaceProject.id}
                                sx={{
                                    marginTop: '1rem',
                                    py: '2rem',
                                    px: '2rem',
                                    borderRadius: '0.625rem',
                                    backgroundColor: 'var(--white)',
                                    boxShadow: '0px 4px 8px rgba(27, 170, 100, 0.6)',
                                    position: 'relative',
                                    flexDirection: 'column'
                                }}
                                elevation={3}
                            >
                                <RiDiscountPercentFill
                                    style={{
                                        position: 'absolute',
                                        top: '-1.25rem',
                                        right: '-1.25rem',
                                        fontSize: '3rem',
                                        color: 'var(--primary-green)',
                                    }}
                                />
                                <div className='flex flex-row justify-start items-center w-full'>
                                    <div className='flex flex-row justify-start items-center w-[45%]'>
                                        <img
                                            className="w-[5rem] h-[5rem] object-cover rounded-[0.25rem] flex-shrink-0 mr-[1.5rem]"
                                            src={item.marketplaceProject.marketplaceFiles?.find(file => file.fileType === 2)?.url || NoImage}
                                            alt={item.marketplaceProject.name}
                                        />
                                        <div className='flex flex-col justify-between max-h-[5rem]'>
                                            <Typography
                                                sx={{
                                                    fontWeight: '600',
                                                    fontSize: '1rem',
                                                    color: 'var(--black)',
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                    textOverflow: 'ellipsis',
                                                    mr: '1.5rem',
                                                    mb: '1rem'
                                                }}
                                            >
                                                {item.marketplaceProject.name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontWeight: "300",
                                                    fontSize: "0.875rem",
                                                    color: "var(--black)",
                                                    textAlign: "left",
                                                }}
                                            >
                                                Added date: {formatDate(item.createdDate)}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Typography sx={{ fontWeight: '500', fontSize: '1rem', width: '25%' }}>
                                        <span style={{ textDecoration: 'line-through' }}>{formatPrice(item.price)} VND</span>
                                        <br />
                                        <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>{formatPrice(item.discountedPrice)} VND</span>
                                    </Typography>
                                    <Typography sx={{ fontWeight: '600', fontSize: '1.5rem', width: '15%', textAlign: 'center', color: 'var(--primary-green)' }}>
                                        {item.appliedCoupon.discountRate * 100} %
                                    </Typography>
                                    <div className='w-[15%] flex justify-center'>
                                        <Tooltip title="Remove from cart" placement="bottom">
                                            <IconButton onClick={() => handleDelete(item.marketplaceProjectId)}>
                                                {isDeletingMap[item.marketplaceProjectId] ? (
                                                    <CircularProgress size={20} sx={{ color: 'var(--black)', fontSize: '2rem' }} />
                                                ) : (
                                                    <DeleteIcon sx={{ color: 'var(--black)', fontSize: '2rem' }} />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                                <Divider orientation="horizontal" sx={{ borderColor: '#DBDBDB', my: '1.5rem' }} />
                                <div className='mt-[0.5rem] flex flex-row justify-between'>
                                    <div className='flex flex-row items-center justify-start gap-[0.5rem]'>
                                        <CheckCircleIcon sx={{ color: 'var(--primary-green)' }} />
                                        <Typography sx={{ fontWeight: '600', fontSize: '1rem', color: 'var(--primary-green)' }}>
                                            Coupon applied
                                        </Typography>
                                    </div>
                                    <Button
                                        variant="contained"
                                        sx={{ textTransform: 'none', bgcolor: 'var(--red)', fontWeight: '600' }}
                                        onClick={() => handleRemoveCoupon(item.marketplaceProjectId)}
                                        startIcon={
                                            <IoRemoveCircle
                                                style={{
                                                    fontSize: "1.5rem !important",
                                                    strokeWidth: "1",
                                                    stroke: "#F5F7F8",
                                                }}
                                            />
                                        }
                                    >
                                        Remove coupon
                                    </Button>
                                </div>
                                <AddCouponForm marketplaceProject={item.marketplaceProject} open={open} handleCloseCoupon={handleCloseCoupon} />
                            </Paper>
                        ) : (
                            <Paper
                                key={item.marketplaceProject.id}
                                sx={{
                                    marginTop: '1rem',
                                    py: '2rem',
                                    px: '2rem',
                                    borderRadius: '0.625rem',
                                    backgroundColor: 'var(--white)',
                                    flexDirection: 'column'
                                }}
                                elevation={3}
                            >
                                <div className='flex flex-row justify-start items-center w-full'>
                                    <div className='flex flex-row justify-start items-center w-[45%]'>
                                        <img
                                            className="w-[5rem] h-[5rem] object-cover rounded-[0.25rem] flex-shrink-0 mr-[1.5rem]"
                                            src={item.marketplaceProject.marketplaceFiles?.find(file => file.fileType === 2)?.url || NoImage}
                                            alt={item.marketplaceProject.name}
                                        />
                                        <div className='flex flex-col justify-between max-h-[5rem]'>
                                            <Typography
                                                sx={{
                                                    fontWeight: '600',
                                                    fontSize: '1rem',
                                                    color: 'var(--black)',
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                    textOverflow: 'ellipsis',
                                                    mr: '1.5rem',
                                                    mb: '1rem'
                                                }}
                                            >
                                                {item.marketplaceProject.name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontWeight: "300",
                                                    fontSize: "0.875rem",
                                                    color: "var(--black)",
                                                    textAlign: "left",
                                                }}
                                            >
                                                Added date: {formatDate(item.createdDate)}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Typography sx={{ fontWeight: '500', fontSize: '1rem', width: '25%' }}>
                                        {formatPrice(item.price)} VND
                                    </Typography>
                                    <Typography sx={{ fontWeight: '600', width: '15%', textAlign: 'center', fontSize: '1.5rem' }}>
                                        0%
                                    </Typography>
                                    <div className='w-[15%] flex justify-center'>
                                        <Tooltip title="Remove from cart" placement="bottom">
                                            <IconButton onClick={() => handleDelete(item.marketplaceProjectId)}>
                                                {isDeletingMap[item.marketplaceProjectId] ? (
                                                    <CircularProgress size={20} sx={{ color: 'var(--black)', fontSize: '2rem' }} />
                                                ) : (
                                                    <DeleteIcon sx={{ color: 'var(--black)', fontSize: '2rem' }} />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                                <Divider orientation="horizontal" sx={{ borderColor: '#DBDBDB', my: '1.5rem' }} />
                                <div className='mt-[0.5rem] flex flex-row justify-between'>
                                    <div className='flex flex-row items-center justify-start gap-[0.5rem]'>
                                        <CancelIcon sx={{ color: 'var(--black)' }} />
                                        <Typography sx={{ fontWeight: '600', fontSize: '1rem', color: 'var(--black)' }}>
                                            No coupon applied
                                        </Typography>
                                    </div>
                                    <Button
                                        variant="contained"
                                        sx={{ textTransform: 'none', bgcolor: 'var(--primary-green)', fontWeight: '600' }}
                                        onClick={() => setIsOpen(true)}
                                        startIcon={
                                            <BiSolidDiscount
                                                style={{
                                                    fontSize: "1.5rem !important",
                                                    strokeWidth: "1",
                                                    stroke: "#F5F7F8",
                                                }}
                                            />
                                        }
                                    >
                                        Add coupon
                                    </Button>
                                </div>
                                <AddCouponForm marketplaceProject={item.marketplaceProject} open={open} handleCloseCoupon={handleCloseCoupon} handleAddCoupon={handleAddCoupon} />
                            </Paper>
                        )
                    ))
                ) : (
                    <div className='flex flex-col justify-center items-center rounded-[0.625rem] bg-[var(--light-grey)] h-[20rem] mt-[2rem]'>
                        <img src={empty} className='h-[10rem] mb-[2rem]'></img>
                        <Typography
                            sx={{
                                fontWeight: "600",
                                fontSize: "1rem",
                                color: "var(--black)",
                                textAlign: "left",
                            }}
                        >No items in the cart.</Typography>
                    </div>
                )
            }
        </div >
    )
}

export default CheckoutGameTable;
