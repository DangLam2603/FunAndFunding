import { Box, Button, CircularProgress, Divider, Drawer, Typography } from '@mui/material';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import empty from "../../assets/images/image_empty.png";
import { useCart } from '../../contexts/CartContext';
import cartApiInstace from "../../utils/ApiInstance/cartApiInstance";
import CartItem from './CartItem';

function CartDrawer({ cartOpen, setCartOpen }) {
    const { cartItems, cartCount, setCartItems, setCartCount } = useCart();
    const navigate = useNavigate();
    const token = Cookies.get("_auth");
    const isLogined = Cookies.get("_auth") !== undefined;

    const [totalPrice, setTotalPrice] = useState(null);
    const [isClearingCart, setIsClearingCart] = useState(false);

    useEffect(() => {
        if (isLogined) {
            fetchCartItems();
        }
    }, [token]);

    useEffect(() => {
        if (isLogined) {
            getPriceTotal(cartItems);
        }
    }, [cartItems]);

    const fetchCartItems = async () => {
        try {
            const res = await cartApiInstace.get("", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode == 200) {
                setCartItems(res.data._data.items);
                getPriceTotal(res.data._data.items);
                fetchCartCount();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const fetchCartCount = async () => {
        try {
            const res = await cartApiInstace.get("/quantity", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode == 200) {
                setCartCount(res.data._data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getPriceTotal = async (cartItems) => {
        let total = 0;
        cartItems.forEach(cartItem => {
            total += cartItem.marketplaceProject.price;
        });
        setTotalPrice(total);
    }

    const handleDeleteCartItem = async (marketplaceProjectId) => {
        try {
            const res = await cartApiInstace.delete(`${marketplaceProjectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode == 200) {
                fetchCartItems();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleClearCart = async () => {
        try {
            setIsClearingCart(true);
            const res = await cartApiInstace.delete("", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data._statusCode === 200) {
                fetchCartItems();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsClearingCart(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };

    const redirectToCheckout = () => {
        setCartOpen(false);
        navigate('checkout-cart');
    }

    return (
        <Drawer
            anchor={"right"}
            open={cartOpen}
            onClose={setCartOpen}
            PaperProps={{
                sx: {
                    width: '30rem',
                    bgcolor: '#F5F7F8'
                }
            }}
        >
            <Box
                role="presentation"
                sx={{
                    width: '100%',
                    p: '2rem',
                    pb: '0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div>
                    <Typography
                        sx={{
                            fontWeight: "700",
                            fontSize: "1.75rem",
                            color: "var(--black)",
                            textAlign: "left",
                        }}
                    >
                        GAME CART
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: "400",
                            fontSize: "1rem",
                            color: "var(--black)",
                            textAlign: "left",
                        }}
                    >
                        All your added games will be displayed here.
                    </Typography>
                </div>
                <Divider orientation="horizontal" sx={{ borderColor: '#DBDBDB', mt: '1rem', mb: '1.5rem' }} />
                <div style={{
                    flexGrow: 1, marginBottom: cartItems != null && cartItems.length > 0 ? '0' : '2rem', overflowY: 'auto',
                    maxHeight: '26.57rem',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    {cartItems != null && cartItems.length > 0 ? (
                        <>
                            {cartItems.map((item, index) => (
                                <CartItem key={index} itemDetail={item} handleDeleteCartItem={handleDeleteCartItem} />
                            ))}
                            <div className='flex'>
                                <Button
                                    variant="outlined"
                                    onClick={handleClearCart}
                                    sx={{
                                        borderRadius: "0.5rem",
                                        textTransform: "none",
                                        fontSize: "0.75rem",
                                        padding: "0.813rem 3rem",
                                        width: "11rem",
                                        fontWeight: "600",
                                        height: "2rem",
                                        color: "var(--red)",
                                        borderColor: "var(--red)",
                                        mx: 'auto',
                                        mb: '1.5rem'
                                    }}
                                >
                                    {isClearingCart ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        "Clear Cart"
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col justify-center items-center rounded-[0.625rem] bg-[#EAEAEA] h-full'>
                            <img src={empty} className='h-[10rem] mb-[2rem]'></img>
                            <Typography
                                sx={{
                                    fontWeight: "400",
                                    fontSize: "1rem",
                                    color: "var(--black)",
                                    textAlign: "left",
                                }}
                            >No items in the cart.</Typography>
                        </div>
                    )}
                </div>
            </Box>
            <Box
                sx={{
                    height: 'fit-content',
                    width: '30rem',
                    zIndex: '130',
                    boxShadow: '0px -1px 8px rgba(0, 0, 0, 0.1)',
                    px: '2rem',
                    py: '1.5rem',
                }}
            >
                <div className='flex flex-row justify-between items-center'>
                    <Typography
                        sx={{
                            fontWeight: "700",
                            fontSize: "1rem",
                            color: "var(--black)",
                            textAlign: "left",
                            marginBottom: "1rem",
                        }}
                    >
                        Game total:
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: "500",
                            fontSize: "1rem",
                            color: "var(--black)",
                            textAlign: "left",
                            marginBottom: "1rem",
                        }}
                    >
                        {cartCount} {cartCount >= 2 ? 'games' : 'game'}
                    </Typography>
                </div>
                <div className='flex flex-row justify-between items-center'>
                    <Typography
                        sx={{
                            fontWeight: "700",
                            fontSize: "1rem",
                            color: "var(--black)",
                            textAlign: "left",
                            marginBottom: "1rem",
                        }}
                    >
                        Subtotal:
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: "700",
                            fontSize: "1rem",
                            color: "var(--primary-green)",
                            textAlign: "left",
                            marginBottom: "1rem",
                        }}
                    >
                        {formatPrice(totalPrice)} VND
                    </Typography>
                </div>
                <Button
                    variant='contained'
                    sx={{
                        borderRadius: "0.625rem",
                        textTransform: "none",
                        fontSize: "1rem",
                        padding: "0.813rem 3.5rem",
                        width: "100%",
                        fontWeight: "600",
                        height: "3rem",
                        backgroundColor: "var(--primary-green)",
                        color: "var(--white)",
                    }}
                    onClick={() => redirectToCheckout()}
                >
                    Continue to Checkout
                </Button>
            </Box>
        </Drawer >
    )
}

export default CartDrawer