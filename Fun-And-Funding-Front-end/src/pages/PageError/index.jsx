import { Button, Typography } from '@mui/material';
import React from 'react';
import ErrorGif from '../../assets/gifs/error-animation.gif';

function PageError() {
    return (
        <div className='mx-[var(--side-margin)] h-fit flex justify-center items-center flex-col mt-[2rem]'>
            <Typography
                sx={{
                    fontSize: '1.5rem',
                    my: '1.5rem',
                    color: 'var(--grey)',
                    fontWeight: 600,
                }}
            >
                Oops...
            </Typography>
            <img src={ErrorGif} alt="Error Animation" className='w-[15rem] h-[10rem]' />
            <Typography
                sx={{
                    fontSize: '2rem',
                    my: '1.5rem',
                    color: 'var(--black)',
                    fontWeight: 700,
                }}
            >
                Page not found
            </Typography>
            <Typography
                sx={{
                    fontSize: '1.5rem',
                    mb: '1rem',
                    color: 'var(--black)',
                    fontWeight: 600,
                    textAlign: 'center'
                }}
            >
                The requested page could not be found.
            </Typography>
            <Typography
                sx={{
                    fontSize: '1.25rem',
                    mb: '1.5rem',
                    color: 'var(--black)',
                    fontWeight: 500,
                    textAlign: 'center'
                }}
            >
                This might be a typo in the URL, the page has been deleted, or you do not have permission.
            </Typography>
            <a href='/'>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#1BAA64",
                        fontWeight: "600",
                        textTransform: "none",
                        px: "3rem",
                        py: "0.75rem",
                        fontSize: "1.2rem",
                    }}
                >
                    Back to Home
                </Button>
            </a>
        </div>
    );
}

export default PageError;