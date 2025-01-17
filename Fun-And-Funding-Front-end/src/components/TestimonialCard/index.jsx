import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { Avatar, Box, Card, CardContent, Divider, Typography } from '@mui/material';
import React from 'react';

function TestimonialCard({ testimonial }) {
    return (
        <Card sx={{
            width: '17.375rem',
            borderRadius: '0.625rem',
            backgroundColor: '#F5F7F8',
            boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)'
        }}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                py: '1.5rem !important',
                px: '2.5rem !important'
            }}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                    <FormatQuoteIcon sx={{ fontSize: '1.5rem', color: '#1BAA64' }} />
                </Box>
                <Divider sx={{ backgroundColor: '#1BAA64', mb: '1rem', borderBottomWidth: '2px' }} />
                <Typography sx={{
                    fontWeight: '400',
                    fontSize: '1rem',
                    color: '#2F3645',
                    textAlign: 'left',
                    mb: '1rem',
                    height: '16rem',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' }
                }}>
                    {testimonial.content}
                </Typography>
                <Divider sx={{ backgroundColor: '#1BAA64', mb: '1rem', borderBottomWidth: '2px' }} />
                <div className='flex flex-row gap-[1rem]'>
                    <Avatar src={testimonial.avatar} sx={{
                        width: '1.5rem', height: '1.5rem'
                    }} />
                    <Typography sx={{ fontWeight: '700', fontSize: '1rem', color: '#2F3645', marginBottom: '1.5rem' }}>
                        {testimonial.name}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    )
}

export default TestimonialCard