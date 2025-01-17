import { Avatar, Box, Button, Grid2, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useLoading } from "../../../contexts/LoadingContext";
import userApiInstance from "../../../utils/ApiInstance/userApiInstance";

function AccountFollower({ user, fetchFollowerList }) {
    const { isLoading, setIsLoading } = useLoading();
    const [role, setRole] = useState("");

    useEffect(() => {
        fetchRole();
    }, [user])

    const fetchRole = async () => {
        try {
            const role = await userApiInstance.get(`/user-role/${user.id}`);
            if (role.data._statusCode == 200) {
                setRole(role.data._data);
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            {role && <Paper elevation={2} sx={{ padding: '2rem', borderRadius: '0.625rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src='' sx={{ width: '6rem', height: '6rem', mb: '1rem' }} />
                    <Typography
                        sx={{
                            fontSize: "1.2rem",
                            fontWeight: "700",
                            color: "var(--black)",
                            mb: "0.25rem",
                            textAlign: "center",
                            width: "15rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {user.userName}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '0.625rem',
                            fontWeight: '700',
                            width: 'fit-content',
                            padding: '4px 8px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'center',
                            bgcolor: 'var(--primary-green)',
                            color: 'var(--white)',
                            borderRadius: '0.25rem',
                            mb: '0.25rem'
                        }}
                    >
                        {role.replace(/([a-z])([A-Z])/g, '$1 $2')}
                    </Typography>
                </Box>
                <Grid2 container sx={{ mt: '1.75rem' }} columnSpacing={2}>
                    <Grid2 size={12}>
                        <a href={`/chat/${user.id}`}>
                            <Button variant='contained'
                                sx={{ width: '100%', backgroundColor: 'var(--primary-green)', textTransform: 'none', fontWeight: 600 }}
                                startIcon={<IoChatbubbleEllipsesOutline size={18} />}
                            >
                                Chat
                            </Button>
                        </a>
                    </Grid2>
                </Grid2>
            </Paper>
            }
        </>
    )
}

export default AccountFollower