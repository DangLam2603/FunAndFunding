import { Avatar, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

function BackerCard({ backer }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };
    return (
        <Card sx={{ width: '17.375rem', borderRadius: '0.625rem', backgroundColor: '#F5F7F8', boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', py: '1.5rem !important', px: '2.5rem !important' }}>
                <Avatar src={backer.avatarURL} sx={{
                    width: '10rem', height: '10rem', mx: 'auto', mb: '1rem'
                }} />
                <Typography sx={{ fontWeight: '700', fontSize: '1.5rem', color: '#2F3645', textAlign: 'center', marginBottom: '1.5rem' }}>
                    {backer.userName}
                </Typography>
                <Typography sx={{ fontWeight: '700', fontSize: '1.25rem', color: '#1BAA64', textAlign: 'center' }}>
                    {formatPrice(backer.totalDonation)} VND
                </Typography>
            </CardContent>
        </Card >
    )
}

export default BackerCard