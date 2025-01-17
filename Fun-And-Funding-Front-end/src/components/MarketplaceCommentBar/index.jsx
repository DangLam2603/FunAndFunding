import { Avatar, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import userApiInstace from "../../utils/ApiInstance/userApiInstance";

function MarketplaceCommentBar({ response, index }) {
    const [userRole, setUserRole] = useState("N/A");

    useEffect(() => {
        fetchUserRole();
    }, [response])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    const fetchUserRole = async () => {
        try {
            const res = await userApiInstace.get(`user-role/${response.userId}`)
            if (res.data._statusCode == 200) {
                setUserRole(res.data._data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box sx={{ maxWidth: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', mt: index === 0 ? "3rem" : '2rem' }}>
            <Avatar
                sx={{
                    width: "3.5rem",
                    height: "3.5rem",
                    marginRight: "1.25rem",
                }}
                src={''}
            />
            <div>
                <div className='flex flex-row justify-start items-center'>
                    <Typography
                        sx={{
                            fontSize: "1.25rem",
                            fontWeight: '700',
                            color: 'var(--black)',
                            mr: '0.5rem'
                        }}
                    >
                        {response?.userName ?? "N/A"}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            fontWeight: '400',
                            color: 'var(--black)',
                        }}
                    >
                        {response?.createDate ? formatDate(response.createDate) : "00/00/0001 0:00 am"}
                    </Typography>
                </div>
                <Typography
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: '600',
                        color: 'var(--primary-green)',
                        mb: '1rem'
                    }}
                >
                    {userRole.replace(/([a-z])([A-Z])/g, '$1 $2')}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "1rem",
                        fontWeight: '400',
                        color: 'var(--black)',
                        mb: '1rem'
                    }}
                >
                    {response?.content ?? "N/A"}
                </Typography>
            </div>
        </Box>
    )
}

export default MarketplaceCommentBar