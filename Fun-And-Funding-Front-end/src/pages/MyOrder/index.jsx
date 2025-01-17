import { Box, Typography } from '@mui/material'
import Cookies from "js-cookie"
import React, { useEffect, useState } from 'react'
import OrderCard from '../../components/OrderCard'
import { useLoading } from '../../contexts/LoadingContext'
import orderApiInstace from '../../utils/ApiInstance/orderApiInstance'
import empty from "../../assets/images/image_empty.png";
const MyOrder = () => {
    const token = Cookies.get("_auth");
    const { isLoading, setIsLoading } = useLoading();
    const [orders, setOrders] = useState([]);
    const fetchOrders = async () => {
        setIsLoading(true);
        await orderApiInstace.get('', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data);
            if (res.data._statusCode == 200) {
                setOrders(res.data._data.items);
            } else {
                setOrders([]);
            }
            setIsLoading(false);
        }).catch(err => {
            setOrders([]);
        })
    }
    useEffect(() => {
        fetchOrders();
    }, [])
    return (
        <Box sx={{ paddingLeft: '4rem', paddingRight: '5.5rem' }}>
            <Typography sx={{ fontSize: '28px', paddingY: '20px', fontWeight: '600' }}>
                Order History
            </Typography>
            <Box>
                {orders.length > 0 ? orders.map(order => <OrderCard key={order.id} order={order} />)
                    : (
                        <div className='flex flex-col justify-center items-center rounded-[0.625rem] bg-[#EAEAEA] h-full'>
                            <img src={empty} className='h-[20rem] mb-[2rem]'></img>
                            <Typography
                                sx={{
                                    fontWeight: "400",
                                    fontSize: "1rem",
                                    color: "var(--black)",
                                    textAlign: "left",
                                }}
                            >You have not purchased any games yet</Typography>
                        </div>
                    )}
                <OrderCard />
            </Box>
        </Box>
    )
}

export default MyOrder