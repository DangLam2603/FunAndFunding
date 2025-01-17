import React, { useState } from "react";
import { Typography, Box, Divider, Button, Modal } from "@mui/material";
import OrderDetailCard from "./OrderDetailCard";
import OrderDetailModal from "./OrderDetailModal";


const OrderCard = ({ order }) => {
    console.log(order)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const options = {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        // border : 'none !important',
      };
    return (
        <div>
            {order && (
                <Box
                    sx={{
                        padding: 2,
                        borderRadius: 4,
                        border: "1px solid #f0f0f0",
                        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#fff",
                        marginBottom: 2
                    }}>
                    {/* Header */}
                    <Box sx={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 2
                    }}>
                        
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#FF5722",
                                backgroundColor: "#FFEAE6",
                                padding: "4px 8px",
                                borderRadius: 2,
                            }}
                        >
                            {formatDateTime(order.createdDate)}
                        </Typography>
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                        {order && order.orderDetails.map((item, index) => (
                            <OrderDetailCard item={item} key={index} />
                        ))}
                    </Box>

                    <Divider sx={{ marginBottom: 2 }} />
                    {/* Total and Actions */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight="bold">
                            Total: {formatPrice(order.totalPrice)} VND
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{
                                textTransform: "none",
                                borderRadius: 4,
                                borderColor: '#1BAA64',
                                color: '#1BAA64',

                            }}
                            onClick={handleOpen}
                        >
                            Details
                        </Button>
                    </Box>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        disableAutoFocus={true}
                    >
                        <Box sx={style}>
                            <OrderDetailModal details = {order.orderDetails}/>
                        </Box>
                    </Modal>
                </Box>

            )}
        </div>
    )
}

export default OrderCard