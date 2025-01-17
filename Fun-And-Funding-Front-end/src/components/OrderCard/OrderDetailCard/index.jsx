import React from 'react'
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
const OrderDetailCard = ({ item }) => {
    console.log(item)
    const getThumbnail = () => item.digitalKey.marketingProject.marketplaceFiles.find(file => file.fileType === 2);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };
    return (
        <>
            {item && (
                <Card
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        borderRadius: 4,
                        boxShadow: "none",
                        border: "1px solid #f0f0f0",
                        marginBottom: 2
                    }}
                >
                    {/* Product Image */}
                    <CardMedia
                        component="img"
                        image={getThumbnail().url} // Replace with actual image URL
                        alt="Japan Green Outer"
                        sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            objectFit: "cover",
                        }}
                    />

                    {/* Product Details */}
                    <CardContent
                        sx={{
                            flex: 1,
                            paddingLeft: 2,
                        }}
                    >
                        <Typography variant="body1" fontWeight="bold">
                            {item.digitalKey.marketingProject.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {formatPrice(item.digitalKey.marketingProject.price)} VND
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </>

    );
}

export default OrderDetailCard